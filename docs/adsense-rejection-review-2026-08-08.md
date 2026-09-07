# Tourpick360 AdSense Rejection Review

Date: 2026-08-08
Trigger: Site was rejected once for "낮은 가치의 콘텐츠" (low value content) and is now back in "준비 중" (pending review) status.

## Scope Note

The Search Console screenshots shared alongside this request are for `issuespot.co.kr`, not `tourpick360.com`. That site's Page Indexing report (76 not indexed / 67 indexed, 39 pages "찾을 수 없음(404)") looks like a different property — likely shared as a reference for what a 404-heavy coverage report looks like, or attached by mistake. This review does not touch `issuespot.co.kr`; it is out of scope and not in this repository. If the intent was to also inspect that site, it needs to be handled separately (different codebase/access).

This environment's network policy blocks outbound requests to `tourpick360.com` (confirmed via the proxy status endpoint — `connect_rejected` on port 443), so this review could not load the live site, live Search Console data, or the live AdSense status page directly. Everything below comes from auditing the site's source in this repository and running its own build/QA tooling. Recommended follow-up: pull the equivalent Search Console "Page indexing" report for `tourpick360.com` (Search Console property is separate per domain) and compare its "not found (404)" and "crawled — not indexed" buckets against the URL lists in `docs/indexing-priority-urls.md`.

## What's Already Healthy

Verified by running `npm run build` and `node scripts/check-seo-build.mjs` against the current branch:

- 76 pages build cleanly, all required files present (`robots.txt`, `sitemap-index.xml`, `rss.xml`, `ads.txt`).
- Every page: exactly one H1, valid heading order, canonical URL, unique title, AdSense verification meta + script present.
- `ads.txt` has the correct Google seller line; `robots.txt` references the sitemap.
- No broken internal links and no missing images across all 76 built pages (checked directly against the `dist/` output).
- About/Contact pages show a named operator (김안나) with a real email and a first-person description of how content is verified — this is a real trust signal, not boilerplate.
- Legal pages (Privacy, Terms, Disclosure, Editorial Policy) all exist and are linked from the homepage footer.

None of this explains a "low value content" rejection by itself — the skeleton was already in good shape per `docs/adsense-approval-plan.md`. The rejection reason points at content substance and consistency, not missing infrastructure.

## Real Issues Found (and fixed in this pass)

### 1. `/domestic/jeju/` hub page was thin (157 words)

This is the site's flagship category — it's the one niche the approval docs specifically narrowed to ("국내 계절 축제 여행 가이드" / Jeju as the first proof cluster) — yet its hub page was little more than a headline and a card grid. Sibling hubs are much deeper: `/domestic/festivals/` (1,286 words), `/templates/` (1,141 words), `/domestic/` (878 words). A reviewer landing on the site's most-linked category page and seeing the thinnest page on the whole site is a bad first impression, and it's inconsistent in a way that reads as unfinished.

**Fixed**: added an area-comparison board (4 Jeju regions with real trade-offs), a traveler-type section (family / parents / couple / no rental car), and a booking-order checklist — the same structural pattern already proven on the festivals hub. Now 409 words of genuine comparison content, not filler.

**Correction made in a follow-up commit**: the first pass of this fix linked the 4 area-board rows to `airport-area-hotel-checklist`, `aewol-hotel-pros-cons`, `jungmun-family-resort-guide`, and `seongsan-hotel-route-guide` — slugs that read as real from `jejuApprovalArticles.js` but don't actually exist as pages. That file still contained a 373-line unused array of the original 10 per-area Jeju articles, left over from when they were intentionally merged into one comprehensive article (`jejuHotelAreaGuide.js`, commit `b3a8974` "Consolidate Jeju hotel articles"). The array was never exported or rendered by any page — `jejuApprovalArticles` (the actual export) is just `[jejuHotelAreaGuide]`, one article. Real live Jeju content is **3 articles**, not 10: `jeju-hotel-area-guide`, `family-hotel-area-guide`, `2n3d-rental-car-itinerary`.

Fixed by pointing the area board at the two real articles that do cover all 4 regions, deleting the unused array (it's already preserved in git history from before the consolidation), and switching the hub's displayed article count from a hardcoded `10` to `{allJejuArticles.length}` so it can't silently go stale again. Re-verified with a full internal-link scan against the `dist/` build after the fix: 0 broken targets.

This is also a useful data point on its own: the consolidation from 10 thin per-area pages down to 1 comprehensive comparison article was exactly the right instinct for avoiding the "low value / scaled content" pattern — it just left dead code behind that made the site's real content count look bigger than it is on a casual read of the source.

### 2. `/travel-tips/` hub had a dead section

The page defines a `coreGuides` array (7 core links: budget planning, late check-in, rainy-day backup, etc.) but the render loop was missing — the "기본 여행 준비 글" section shipped as an empty `<div>`. Anyone landing on this hub saw a heading with nothing under it. The linked articles weren't orphaned (they're cross-linked elsewhere), but this hub itself looked broken.

**Fixed**: restored the `.map()` render.

### 3. Homepage service cards promised content that doesn't exist

- "맛집 지도" (restaurant map) linked to `/domestic/festivals/seasonal-festival-travel-guide/` — a seasonal festival prep article with no restaurant map or dining directory of any kind.
- "교통 정보" (transit info) promised "KTX, 버스, 렌터카" coverage but linked only to the rental-car checklist — there's no unified KTX/bus hub on the site.

This is exactly the kind of mismatch a manual reviewer flags as low-effort or bait-and-switch: the card copy oversells what the destination page actually delivers.

**Fixed**: relabeled to match real destinations — "일정 개선 사례" → `/case-studies/` (which genuinely covers meal-timing and route trade-offs), and "여행 준비 가이드" → `/travel-tips/` (the actual hub, copy trimmed to what it covers).

### 4. SEO checker had a false-positive on the noindex search page

`scripts/check-seo-build.mjs` was failing the build check on `/search/` for a "too-short meta description," even though that page is intentionally `noindex, follow` and isn't meant to carry content weight. A checker that cries wolf on a correctly-configured page erodes trust in its other signals.

**Fixed**: word-count and description-length checks now skip pages with `noindex` in their robots meta. `npm run check:seo` passes clean again.

## Real Risk That Was Not Code-Fixable This Pass: Template Sameness

Corrected count after checking what's actually exported and rendered (not just grepped from source, which over-counts thanks to the dead Jeju array above): the live approval-article clusters are `festivalApprovalArticles.js` — 18 articles and `problemSolvingArticles.js` — 15 articles, **33 pages total**. Jeju is no longer part of this risk — it was already consolidated into 1 article, which is the right shape.

These 33 are individually well-written — specific, non-generic reasoning, real trade-offs, not spun text. But they follow one recurring skeleton: intro → ~4 fixed-purpose sections (pros/cons, criteria, route, recommendation, in varying words) → checklist → 3 FAQs. Google's low-value/scaled-content review does not only look at whether one page is thin; it looks at whether a large cluster of pages reads as the same template with nouns swapped. With 33 similarly-shaped pages, that pattern is a plausible contributor to the original rejection even though no single article is bad — and the Jeju consolidation shows the team already knows how to defuse this (merge many thin variants into fewer comprehensive ones) rather than just varying the prose.

This isn't something to code-fix reflexively — rewriting 33 articles risks doing more harm than good without editorial judgment. Recommended approach before reapplying:

1. Consider whether the festival (18) and problem-solving (15) clusters have the same over-segmentation the Jeju cluster had — i.e., whether some of these should be merged into fewer, deeper comparison articles rather than kept as many similar single-scenario pages. That's a stronger fix than prose-level variation.
2. For clusters that stay separate, pick 8-10 of the highest-value articles and vary their structure: different heading counts, a first-person observation, a real number or date, a photo where one doesn't exist yet — anything that breaks the template fingerprint.
3. Don't publish new articles from the same template in bulk right before reapplying; new content should look like it was written when needed, not generated in a batch.
4. Whatever gets touched, re-run the internal-link scan afterward (see the correction above) — consolidating or renaming articles is exactly the kind of change that silently orphans links if a data file isn't fully cleaned up.

## Recommended Order of Operations

1. Deploy this fix set (hub content, dead section, homepage cards, checker) — low risk, purely additive, no structural/URL changes, safe to ship even while a review is pending.
2. Pull the real Search Console "Page indexing" report for `tourpick360.com` and compare against `docs/indexing-priority-urls.md`. Confirm the 404/redirect counts are near zero — if Search Console shows a meaningful "찾을 수 없음(404)" bucket like the issuespot.co.kr example, that would point at stale internal links or an old sitemap entry and should be chased down before reapplying.
3. Apply the template-diversification pass above to 8-10 flagship articles.
4. Wait for organic traffic/indexing signal to stabilize (the existing roadmap's "2~3일에 글 1개, 구조 변경 최소화" cadence) before submitting for re-review — don't reapply the same day as a content batch push.
5. Re-run `npm run check:seo` before every reapplication as a final gate; it's a good pre-flight signal but not a substitute for a human skim of the top 5 landing pages a reviewer is most likely to hit (`/`, `/domestic/`, `/domestic/jeju/`, `/domestic/festivals/`, `/travel-tips/`).

## Structural Audit (2026-08-08, second pass)

Follow-up review focused specifically on site-wide *structure* — navigation, internal linking, page hierarchy — since that's the layer a reviewer forms an impression from before reading any single article closely.

### 5. Site-wide header nav had the same label/destination mismatch as the homepage cards — but global

`BaseLayout.astro`'s `<nav class="main-nav">` renders on all 76 pages. It had two defects:
- "맛집" (restaurant map) linked to `/domestic/festivals/seasonal-festival-travel-guide/` — same mismatch pattern as the homepage cards fixed earlier, except this one is on every single page, not just the homepage.
- "가이드" linked to `/domestic/` — identical URL to the adjacent "국내여행" item. Two menu items, one destination; looks like a placeholder that was never finished.

Both `/case-studies/` and `/templates/` — two fully-built hub pages (1,000+ words each, real checklists and comparison tables) — had **zero presence in either the header or footer nav**. They were only reachable through inline links buried in article bodies. For a reviewer (or Google) forming a picture of site structure from the nav alone, these sections effectively didn't exist.

**Fixed**: replaced the two broken nav slots with `/case-studies/` and `/templates/`, added both to the footer's service-links group, and refactored the footer's link generation away from a fragile parallel-array + index-slice pattern (label array, separate href array, matched by numeric position) into direct `{label, href}` pairs — that pattern is exactly the shape of bug that caused the header mismatch in the first place, just correct by coincidence in the footer. Rebuilt and re-scanned: 0 broken internal links across all 76 pages.

### Other structural checks (all clean, no fix needed)

- **Orphan pages**: built a full internal-link graph from the `dist/` output. Every page is reachable from at least one other internal link except `/search/`, which is intentionally form-only and `noindex`. No accidental orphans.
- **Duplicate titles/descriptions**: checked all 76 pages for exact-match `<title>` or meta description collisions. Zero duplicates — every page has a unique title and description.
- **Sitemap accuracy**: `sitemap-0.xml` lists 74 URLs; all 74 correspond to real built pages, none point at removed content (confirmed no leftover references to the deleted "bicycle" routes content that `docs/indexing-priority-urls.md` still mentions — that doc is stale, the sitemap itself is clean).
- **URL structure**: consistent `/domestic/{region}/{article}/` and `/travel-tips/{article}/` patterns, no numeric IDs, trailing slashes consistent, single canonical host.

### Lower-priority structural gap (not fixed this pass)

About half of individual article pages have a visual breadcrumb (`<nav class="breadcrumb">`) but no matching `BreadcrumbList` JSON-LD, and hub pages (`/domestic/`, `/domestic/jeju/`, `/travel-tips/`, `/templates/`, `/case-studies/`, homepage) have no breadcrumb at all, visual or structured. This affects how cleanly Google can render breadcrumb trails in search results and understand page hierarchy programmatically — real, but secondary to the nav-destination bugs above, and touches enough files that it's a separate, deliberate pass rather than a quick fix. Worth doing before the next reapplication, not blocking it.

## Breadcrumb Pass (2026-08-20)

This closes the "lower-priority structural gap" flagged at the end of the 2026-08-08 second pass — breadcrumbs were half-implemented and hub pages had none at all.

### What was wrong

- **Visual breadcrumbs and structured data were separate code.** The three shared article components (`ApprovalArticle`, `FestivalArticle`, `ProblemSolvingArticle`) each hand-wrote a `<nav class="breadcrumb">` *and*, independently, a `buildBreadcrumbJsonLd([...])` call listing the same trail. Nothing kept the two in sync — the same shape of duplication that caused the header-nav mismatch fixed on 2026-08-08.
- **That duplication had already drifted into a real defect.** `ProblemSolvingArticle`'s JSON-LD listed `https://tourpick360.com/travel-tips/problems/` as an intermediate crumb. There is no such page — `src/pages/travel-tips/problems/` only contains `[slug].astro`, so that URL 404s. All 15 problem-solving pages were shipping a `BreadcrumbList` pointing at a non-existent page, which is worse than having no breadcrumb markup at all.
- **18 standalone region/festival article pages** had a visual breadcrumb and no `BreadcrumbList` whatsoever.
- **21 pages had neither**, including every hub (`/domestic/`, `/domestic/festivals/`, `/domestic/jeju/`, `/travel-tips/`, `/case-studies/`, `/templates/`, `/tools/itinerary-comparison/`), all six legal/info pages, and six `/travel-tips/` articles.
- The trailing crumb was also semantically wrong on the region pages: it read `홈 / 국내여행 / 부산`, where `부산` is not a page — there are no region hubs — and the article itself never appeared in its own trail.

### What changed

A single `src/components/Breadcrumb.astro` now renders the visible `<nav>` and the `BreadcrumbList` JSON-LD from one `items` array, so the two cannot diverge again. `홈` is prepended automatically; the final item renders as `aria-current="page"` text but still carries its URL in the structured data, which is what Google reads.

Applied to 73 of 75 pages. The two exclusions are deliberate: `/` is the breadcrumb root and has nothing to show, and `/search/` is `noindex`. Region article trails are now `홈 / 국내여행 / {글 제목}` — every crumb resolves to a real page, and the region stays legible because the region name is already in each title.

### Verified

- 76 pages build; `npm run check:seo` passes.
- 73 `BreadcrumbList` blocks, one per page, no page emitting two.
- Every `item` URL in every crumb resolves to a page that exists in `dist/` — **0 broken crumb targets** (this is the check that would have caught the `/travel-tips/problems/` bug, and it is worth re-running whenever a page is renamed or merged).
- `position` values are contiguous from 1 on every list.
- Full internal-link and image scan across the build: 0 broken links, 0 missing images.

### Also fixed in this pass

`/domestic/festivals/imsil-n-rose-festival-guide/` was displaying the `공식자료 기반 가이드` badge while its own headline read "5월 29일 방문기", its lead described arriving at 임실치즈테마파크 that afternoon in the first person, and its figcaptions dated the author's own photos. The 2026-08-16 badge pass classified it from `visitType` in the data files and missed it because this article is a standalone `.astro` page with no data-file entry. A badge that contradicts the headline directly above it is a credibility problem on the exact article type the site is strongest at, so it now carries `type="visited"` with the 2026년 5월 29일 visit date, and its `Article` author changed from `Organization` to the named `Person` used elsewhere on the site. Live visit reviews: 6, not 5.

`/domestic/festivals/gokseong-rose-festival-guide/` was checked the same way and correctly stays a desk guide — no first-person visit narrative, no dated photos.

### Indexing URL list rebuilt

`docs/indexing-priority-urls.md` was stale enough to be actively harmful: it claimed the sitemap held 102 URLs (it holds 74) and listed **9 URLs that no longer exist** as manual indexing targets, including the removed bicycle content and four `/templates/` sub-pages. All 9 do have 301s in `public/_redirects`, so nothing 404s — but submitting redirect-only URLs for indexing wastes a limited daily quota and muddies the Search Console coverage report.

The document is now generated against `dist/sitemap-0.xml`: 74 URLs in five priority tiers, cross-checked so the tiers contain every sitemap URL exactly once and nothing else. Retired URLs moved to a "do not request indexing" section with their redirect targets, and the file ends with the command to re-derive the list after any page change.

## Duplicate Consolidation and Guideline Audit (2026-08-20)

Run against the operations manual `애드센스 승인 실전 지침서` (rev. 2026-08-15) supplied by the site owner. Relevant clauses: 2.3 ("제목만 바꾼 중복 글은 통합합니다"), 2.4 (대표 글 3개의 역할 분리), 3.2 (개인정보처리방침은 실제 수집·처리를 반영), 8.3 ("다른 글과 결론과 역할이 겹치지 않는다"), 5.2 (보장 암시 표현 금지).

### Measuring the duplication before acting on it

The 2026-08-08 review flagged 33 template-shaped articles as a plausible rejection contributor but could not quantify it. Two measurements were run this pass, and the second corrected the first:

1. **Rendered-page comparison** put every pair of the 15 problem-solving pages at **47–51% identical**. Taken at face value this looks like mass-produced content.
2. **Source-prose comparison, excluding shared chrome and the checklist**, put the same pairs at **0–8.7%**. The prose is genuinely distinct.

The gap between the two numbers was itself the finding: **all 15 problem-solving articles shipped a byte-identical 5-item checklist** (`baseChecklist` in `problemSolvingArticles.js`, applied by the `makeArticle` factory). That single shared block, not copied prose, produced most of the apparent duplication — and it is exactly what guideline 8.3 describes as "의미 없는 정의·FAQ·반복으로 분량만 늘리지 않았다". Acting on measurement (1) alone would have meant deleting well-written articles to fix a factory default.

The festival cluster was measured the same way and came in at **max 3.6%** overlap with unique checklists and FAQs throughout — no consolidation was warranted there, and none was done.

### What was merged (6 pages, on role duplication)

Guideline 8.3's test is overlapping *conclusion and role*, not copied text. Six problem-solving articles restated a conclusion another page already owned:

| 통합된 글 | 흡수한 글 | 근거 |
|---|---|---|
| `problems/rainy-trip-route-change` | `/travel-tips/rainy-day-backup-plan/` | 같은 결론, 후자가 60분 복구 플랜·템플릿까지 포함 |
| `problems/busan-rainy-day-indoor-family-course` | `/domestic/busan/rainy-day-family-route/` | 부산 우천 코스를 이미 3,151자로 전담 (해운대·센텀·부산역 권역 비교) |
| `problems/late-arrival-first-day-plan` | `/travel-tips/late-checkin-plan/` | 같은 결론("첫날은 회복일"), 후자가 30분 복구 플랜·원인별 분류표 포함 |
| `problems/gangneung-late-ktx-hotel-area` | `/domestic/gangneung/ktx-weekend-trip-guide/` | 이미 "도착 시간별 1박 2일 예시"와 강릉역·경포·안목 선택 기준 보유 |
| `problems/trip-budget-overrun-fix` | `/travel-tips/travel-budget-plan/` | 같은 주제, 후자가 항목 6분할·2인 2박 3일 실계산 포함 |
| `problems/jeonju-hanok-parking-alternative-route` | `problems/parking-full-travel-route-fix` | 본문 8.7% 중복에 결론 동일. 전주는 지역 변형판 |

`summer-beach-hotel-area-alternative` was **kept**, though its conclusion resembles `festival-hotel-sold-out-alternative`. Its decision inputs differ (오션뷰 프리미엄 계산 vs 마감·셔틀), text overlap is negligible, and merging it would have been trimming rather than deduplicating.

Consolidation is not deletion (guideline 10.2 asks what new value appeared). The two region articles already contained everything their problem-solving twins had, so those were clean supersessions. The three `/travel-tips/` longforms did not carry the 숙소 권역 angle at all (`권역` appeared 0 times in each), so each absorbed a new section: 우천 대체 코스의 폭을 정하는 숙소 권역 3기준, 늦은 도착 시 권역이 첫날을 결정하는 이유와 강릉 예시, 예산은 항목을 깎기 전에 이동 권역을 좁히는 순서. `parking-full-travel-route-fix` absorbed the 전주 article's 도보 루트 순환 구성, 경사·계단 확인, 식사 우선 전환 as new steps and an FAQ.

Every one of the 15 remaining problem-solving checklists was rewritten to be specific to its own problem. Result: **9 articles, 9 unique checklists, max pairwise overlap 2.1%** (was 21.2% with an identical checklist on all 15).

### Guideline gaps found and fixed

**개인정보처리방침에 광고·쿠키 고지 없음 (지침서 3.2, 10.1-9).** Every page on the site loads the Google AdSense script and the site ships `ads.txt` with a valid seller line, yet `/privacy/` mentioned 쿠키 four times and never mentioned 광고, AdSense, Google, or 개인 맞춤 광고. For an AdSense application this is the most consequential gap of the pass — disclosing third-party ad cookies is a publisher requirement, not a nicety. Added a 광고와 제3자 쿠키 section (Google 및 파트너의 쿠키 사용, 광고 설정·aboutads.info 옵트아웃 경로, 파트너 사이트 정책 링크, 개인 식별 정보 미제공 명시) and an 접속 분석 section covering Search Console / 서치어드바이저 등록. Written for this site rather than copied, per guideline 3.2's warning against pasting another site's legal text.

**대표 글 3개가 사이트에 드러나지 않음 (지침서 2.4, 10.1-3, 10.1-6).** The homepage had no representative-article section with defined roles. Added 먼저 읽으면 좋은 글 3편 — 입문 (계절별 축제 여행 가이드), 실전 (무주 14명 단체 여행 후기), 문제 해결 (악천후 즉시 복구 가이드) — each card stating its role and what the reader ends up with.

### Checked and found already compliant

- **보장 암시 표현 (5.2).** `무조건` appears on 9 pages, but every occurrence is a question or negation that *rejects* the absolute claim ("행사장과 가까운 숙소가 무조건 좋은가요?" → "아닙니다", "특정 숙소나 상품을 무조건 추천하지 않고"). That is the nuance the guideline asks for, not a violation. No change made — checking the context rather than pattern-replacing was the difference between a fix and a regression.
- **이용약관 샘플 문구 (10.1-10)**, **문의 실제 작동 (10.1-8)**, **정보 제공 원칙** — all site-specific, no boilerplate.
- **빈 카테고리·404 (3.3, 10.1-17)** — 0 broken links across 2,674 internal links, 0 missing images.

### Verified

- 70 pages build; `npm run check:seo` passes.
- 68 sitemap URLs, all resolving to real pages; 67 `BreadcrumbList` blocks with 0 broken crumb targets.
- All 6 merged URLs return 301 to their absorbing page (added to `public/_redirects`); none remain in the sitemap; every internal link that pointed at them was repointed, including the comparison tool's 문제 해결 links and the 전주 야경 글.
- Indexing document rebuilt against the new sitemap: five tiers totalling exactly 68, cross-checked for duplicates and omissions.

## Visit Reclassification and Image Licensing (2026-08-20, third pass)

Prompted by a direct question about whether image sourcing matters for approval. Short answer recorded here so it is not re-litigated: image *attribution* is a license obligation and a policy-surface risk, but it is not what "낮은 가치의 콘텐츠" refers to. What image provenance genuinely affects for this site is the **originality signal** — and auditing it surfaced a much larger problem than the licensing gap.

### Copyright: 3 uses fixed

`public/images/domestic-places/ATTRIBUTION.json` records six Wikimedia photos with author and license. Three of those uses rendered with no visible credit:

| 페이지 | 이미지 | 라이선스 |
|---|---|---|
| `/` | `busan-haeundae-beach.jpg` | CC BY 2.0 (StephNurnberg) |
| `/` | `gangneung-anmok-beach.jpg` | CC BY-SA 4.0 (Mobius6) |
| `/case-studies/` | `gangneung-anmok-beach-hero.jpg` | CC BY-SA 4.0 (Mobius6) |

CC BY and CC BY-SA both require attribution, so these were license violations regardless of AdSense. The homepage 인기 여행지 grid has no per-card caption slot, so a `sky-photo-credit` line was added under the grid crediting all six destination photos by source; the case-studies hero credit went into its existing `figcaption`. The CC0 photos (경주, 전주 한옥) need no credit and were left alone. Verified: 0 uses of a credit-requiring image without its author named on the same page.

The trap here is structural and worth remembering: several pages pass a Wikimedia image as the *fallback* to `getTourApiImage(...)`, with the credit written into the fallback caption. When the TourAPI image exists the fallback never renders — so the credit only appears when the fallback does. Checking source code alone would have missed which uses actually needed a credit; the check has to run against `dist/`.

### The real finding: 6 more articles were understating themselves

While tracing image provenance, six articles turned out to carry 58 photos with filenames that read unmistakably as on-site photography (`bridge-info-sign`, `hanok-village-map-sign`, `lantern-courtyard`, `ssookseom-harbor-view`, `rose-photo-zone`) while displaying the `공식자료 기반 가이드` badge — the badge that says "직접 방문하지 않고". The site owner confirmed all six were real visits made with their group, photographed themselves: 거창 Y자형 출렁다리, 여수 장도·웅천·낭도, 전주 한옥마을, 합천 해인사, 곡성 세계장미축제, 고흥 쑥섬.

This is the same class of defect as the 임실 badge fixed earlier in the day, at six times the scale, and it runs in the most damaging possible direction for a site rejected for low-value content: **the strongest originality evidence the site has was labelled as desk research.** Live visit reviews were not 6 but **12**; own photography in use is 169 images, not 111.

### Badge honesty in both directions

Flipping the six to `visited` with the existing copy would have introduced the opposite error — that copy promised "방문일, 인원, 실제 지출" and these articles have none of it. Per the owner's instruction (지출목록이 없는 것은 없는 대로), `SourceBadge` now takes an explicit `settlement` flag rather than inferring from `visitedOn`:

- **방문 + 정산표 (4편)** — 부여, 무주, 고창, 거제. 총 입금액, 항목별 지출, 1인 부담액이 본문에 있음.
- **방문, 정산 없음 (8편)** — 전주 야경(각자 계산), 임실, 곡성, 거창, 전주 한옥, 합천, 고흥, 여수. 방문 사실과 직접 촬영 사진까지만 약속.
- **공식자료 기반 (42편)** — 변동 없음.

`visitedOn` and `settlement` are now independent, because 전주 야경 has a visit date but no settlement — inferring one from the other would have made the badge overclaim on exactly that article.

### Settlement fact corrected

The 부여 and 무주 settlement tables stated 총무는 회비 면제. The owner corrected this: it was the **리더** whose fee was waived. Ten occurrences across the two data files were changed. The generic 총무 advice in `festivalBookingBudgetGuide.js` is reader-facing guidance, not a claim about this site's trips, and was left as is. Worth noting that these articles already disclose the waiver in their own settlement tables rather than hiding it — that transparency is a trust signal, and the correction preserves it while making it accurate.

### Also updated

- `/editorial-policy/` gained a 사진 출처와 저작권 section (직접 촬영 / TourAPI / Wikimedia, with the licenses named and a statement that unverifiable-license, other-blog, booking-platform and press photos are not used), and its visit/desk section now explains the settlement distinction — "본문에 없는 내용을 배지가 앞질러 말하지 않는 것이 기준입니다."
- The homepage visit-review section now states that direct-visit articles total 12 and that all photos are the operator's own.
- `docs/indexing-priority-urls.md` moved the six reclassified articles into 2순위 (방문 후기 12개, 정산표 있는 4편 우선), leaving 3순위 13 and 4순위 14. Tier total re-verified at exactly 68.

### Verified

70 pages build; `npm run check:seo` passes; 67 `BreadcrumbList` with 0 broken crumb targets; 2,674 internal links with 0 broken; 0 missing images; 0 credit-requiring images without attribution; badge distribution 4 / 8 / 42 with none unclassified.

## Visit Dates Added (2026-08-20, fourth pass)

All 12 visit reviews now carry a visit date in their badge. Two things are worth recording about how the dates were obtained, because both were near-misses.

### EXIF was recoverable on exactly one article

A deep scan (EXIF APP1, XMP, and raw date-string search across every byte) found capture dates in **only** `imsil-n-rose-festival` — 12 photos, all `2026-05-29`, matching the date already set from the article's own text. The other six directories returned 0 EXIF, 0 XMP, 0 embedded date strings: the image pipeline (`sharp`) strips metadata on resize, so the published files cannot yield capture dates. The originals on the owner's own devices still hold them.

This matters procedurally: the owner initially said "the photo dates you gave me are correct, put those in." But no photo dates had been derived for those six — what had been presented was a table of *clues* (본문 작성일 / 최종 확인일 / 축제 기간) plus a **fill-in-the-blank example block containing invented placeholder dates** (거창 6/20, 합천 6/14, 곡성 5/30). Treating that example as data would have published fabricated visit dates on articles claiming first-hand visits — the exact failure mode this whole workstream exists to prevent, and one that would have been invisible afterwards. The dates below came from the owner checking their own records instead.

### One date contradicted the article and had to be resolved, not just entered

The owner's date for 곡성 was **5월 17일**, but that article states the festival ran **5월 22일 ~ 6월 7일**. Entering the date as-is would have put "2026년 5월 17일에 직접 다녀왔다" on a page titled 곡성 세계장미축제 방문 가이드 that simultaneously says the festival opened five days later — a contradiction visible to any reviewer reading the page top to bottom, and worse than having no date at all.

Confirmed with the owner: the visit was to 섬진강기차마을 장미공원 **before the festival opened**. The article now says so explicitly in the lead — that the photos predate the festival, that the garden is open outside the festival period so the visit is useful for planning the route in advance, and that the photos therefore do **not** show the festival-only stages, booths, or crowds, so readers should re-scale their expectation of congestion. Two figcaptions were amended for the same reason. The date and the festival period now reinforce each other instead of colliding.

### Dates as entered

| 글 | 방문일 | 요일 | 근거 |
|---|---|---|---|
| 부여 궁남지·칠갑산 | 2026-07-05 | 일 | 본문 정산표 |
| 무주 머루와인동굴·적상산 | 2026-07-12 | 일 | 본문 정산표 |
| 거제 수국공원·바람의언덕 | 2026-06-28 | 일 | 본문 정산표 |
| 고창 청농원·영광 | 2026-06-21 | 일 | 본문 정산표 |
| 전주 베테랑칼국수·덕진공원 | 2026-07-22 / 07-17 | 수/금 | 본문 서술 |
| 임실N장미축제 | 2026-05-29 | 금 | **사진 EXIF** |
| 거창 Y자형 출렁다리 | 2026-04-26 | 일 | 운영자 확인 |
| 합천 해인사 | 2026-04-26 | 일 | 운영자 확인 (거창과 같은 날) |
| 여수 장도·웅천·낭도 | 2026-05-31 | 일 | 운영자 확인 |
| 고흥 쑥섬 | 2026-06-07 | 일 | 운영자 확인 |
| 전주 한옥마을 | 2026-06-16 | 화 | 운영자 확인 (지인 동행) |
| 곡성 세계장미축제 | 2026-05-17 | 일 | 운영자 확인 (축제 개막 전 장미정원) |

Nine of the twelve fall on a Sunday, consistent with the group's travel pattern; the three that do not (전주 야경 수/금, 전주 한옥 화) are both local Jeonju outings where a weekday is expected. All twelve predate the date each photo directory was first committed. No date failed a consistency check after the 곡성 resolution.

Note on 전주 한옥마을: visited with an acquaintance rather than the group. The badge for non-settlement visits reads "운영자가 …에 직접 다녀온 뒤 작성했습니다" and never claims 모임, so it is already correct — the 모임과 함께 wording appears only on the four settlement articles, which are all genuine group trips.

### Verified

70 pages build; `npm run check:seo` passes; 12 visit badges (4 settlement / 8 photo-only), all dated; 67 `BreadcrumbList` with 0 broken crumb targets; 0 broken internal links; 0 missing images.

## AI Search Visibility Pass (2026-09-07)

Prompted by a third-party "AI 성적표" scan (SEO 98 / AEO 63 / GEO 51, overall 72) flagging three gaps: no `Organization`/`Person` entity schema, no `llms.txt`, and AI answer-engine crawlers (ChatGPT-User, Claude-SearchBot, PerplexityBot) reading as blocked.

### Entity schema was missing everywhere except individual articles

Per-article pages (`ApprovalArticle`, `FestivalArticle`, `ProblemSolvingArticle`) already emit `Article` JSON-LD with a `Person` author and `Organization` publisher. But the homepage only had `WebSite` schema, and every hub page (`/domestic/`, `/domestic/jeju/`, `/travel-tips/`, legal pages, About/Contact) had no entity schema at all — exactly the pages an automated scanner samples first. Added a site-wide `Organization` JSON-LD block to `BaseLayout.astro` (name, url, logo, `founder`/`employee` Person 김안나, `contactPoint`) so it renders on all 70 pages, not just articles.

### `llms.txt` added

`public/llms.txt` now describes the site's purpose, operator, sourcing method (weekly direct visits + TourAPI/지자체 공식 자료), links to the core hub pages and sitemap/RSS, and a note asking AI systems to check the per-article 최종 확인일 before citing prices or hours.

### AI crawler block: not reproducible in this repo

`public/robots.txt` already shipped `User-agent: * / Allow: /` with no bot-specific block, and `functions/_middleware.js` only handles the `www` → apex redirect — neither blocks any crawler. Added explicit `Allow: /` blocks for named AI crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, Bytespider, CCBot) so no automated robots.txt parser can misread the wildcard rule as ambiguous.

If a scanner's live request still comes back blocked after this, the cause is outside this repository: Cloudflare Pages projects commonly ship with **Security → Bots → Super Bot Fight Mode / "Block AI Scrapers and Crawlers"** enabled by default, which blocks these exact user agents at the edge before the request ever reaches this code. That toggle lives in the Cloudflare dashboard for this zone and needs to be turned off (or set to "Allow" for verified AI bots) by whoever has account access — it cannot be changed from the repo.

### Verified

70 pages build; `npm run check:seo` passes; `Organization` JSON-LD present on all 70 pages (spot-checked homepage and `/about/`); `llms.txt` and `robots.txt` both present in `dist/` with the expected content.

## Search Console "Page with Redirect" Coverage Check (2026-09-07)

The site owner exported Search Console's Page Indexing coverage drilldown for the "페이지가 리디렉션을 포함함" (Page with redirect) reason — 52 non-indexed URLs as of 2026-09-04, grown from 0 on 2026-06-12.

This is a non-indexed *reason*, not an *error*, in Search Console's own taxonomy — a URL that 301s somewhere is correctly excluded from the index under its own address while its destination is indexed separately. But since it landed alongside the low-value-content rejection, it was worth checking that the reason is accurate and not masking something broken (a redirect to a dead page, a loop, or a long chain).

All 52 URLs were resolved programmatically against `public/_redirects` and the live `dist/` build (host normalization for `www.`/`http://` first, then path rules, iterated to a fixed point):

- **52/52 resolve to a real, currently-built page.** No missing destination, no redirect loop.
- **Every chain is at most 2 hops**: host normalization (`www.tourpick360.com` → `tourpick360.com`, or `http://` → `https://`) plus, where relevant, one content redirect from `_redirects`. No 3+ hop chains.
- The URLs break down into exactly the categories `_redirects`' own comments describe: `www`/`http` variants of live pages, the consolidated Jeju/festival/case-study/template articles (already documented above), and the removed multi-language (`/en/`, `/ja/`, `/es/`, `/zh-CN/`) and bicycle-routes pages.
- None of the 52 source URLs appear anywhere in current internal links, the sitemap, or an `hreflang` tag (the site has none) — Search Console is simply still holding onto addresses it indexed before those consolidations and periodically re-checking that they still redirect, which is expected long-tail crawl behavior, not something this site is currently doing to cause it.

No code change followed from this check — there was nothing to fix. Recorded here so a future re-run of this same Search Console export isn't mistaken for a new problem.
