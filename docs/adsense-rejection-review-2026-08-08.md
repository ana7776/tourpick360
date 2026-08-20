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
