# Tourpick360 AdSense and SEO Content Strategy

Last updated: 2026-06-09

## Current Diagnosis

Tourpick360 already has the minimum site skeleton for AdSense review:

- 30+ indexable pages exist under `src/pages`.
- About, Contact, Privacy, Terms, Disclosure, Editorial Policy pages exist.
- Sitemap, RSS, robots.txt, ads.txt are present.
- Core categories are clear: domestic travel, festival travel, Jeju guides, travel tips, case studies, templates, comparison tool.

The remaining risk is not page count. The real review risk is whether each content cluster looks deep, original, useful, and consistent enough. Approval should focus on strengthening information value before adding aggressive revenue features.

## AdSense Approval Strategy

### 1. Keep The Niche Narrow

Before approval, do not add unrelated categories such as fashion, food product reviews, IT, overseas travel, or shopping. They dilute topical authority.

Recommended positioning:

```txt
국내 계절 축제 여행과 숙소 동선 판단 가이드
```

This keeps the site focused enough for Google and Naver to understand.

### 2. Minimum Safe Approval Standard

Use this as the pre-application checklist:

- 30+ content pages, excluding legal pages and thin index pages.
- Each article should have at least one image with meaningful alt text.
- Each article should include internal links to 3 related pages.
- Each article should show a clear update or final-check date.
- Category hub pages should explain what the category covers, not just list links.
- No empty pages, broken links, placeholder text, or auto-generated thin pages.
- No excessive affiliate links before review.
- No ad-placement boxes that make the page look built only for ads.

## Content Category Strategy

### 1. Problem-Solving Content

Priority: highest

Purpose:

- Captures search queries from real travel problems.
- Works well for Google and Naver because it answers a specific intent.
- Naturally leads to internal links and the itinerary comparison tool.

Recommended structure:

```txt
Problem -> Cause -> Fix order -> Example -> Checklist -> FAQ -> Related tool
```

Current status:

- The `/travel-tips/problems/` dynamic article cluster is strong.
- The structure already includes problem, solution, example, steps, checklist, FAQ, and tool link.

Next content ideas:

- 숙소 체크인 시간이 늦어질 때 일정 바꾸는 법
- 아이가 갑자기 피곤해할 때 가족여행 일정 줄이는 법
- 축제장 식당 대기가 길 때 식사 동선 바꾸는 법
- 렌터카 반납 시간이 애매할 때 마지막 날 일정 짜는 법
- 비행기 또는 KTX 시간이 바뀌었을 때 숙소 권역 조정법

### 2. Before / After Case Content

Priority: high

Purpose:

- Increases time on page because users compare two versions.
- Shows expertise through reasoning, not just recommendations.
- Converts well into tool usage after AdSense approval.

Recommended structure:

```txt
Situation -> Basic plan -> Failure point -> Improved plan -> Why it works -> Result checklist
```

Current status:

- `/case-studies/` and `/travel-tips/itinerary-before-after/` already cover this direction.

Needed improvements:

- Add more numeric comparison elements: 이동 횟수, 예상 도보 시간, 식사 대기 리스크, 체크인 여유.
- Add result summaries such as "이동 3회 -> 1회", "식사 후보 0곳 -> 2곳".
- Link each case to one problem-solving article and one template.

### 3. Template Library

Priority: high after the core problem pages are stable

Purpose:

- Creates repeat visits.
- Supports long dwell time.
- Becomes a revenue-friendly area after approval without looking spammy.

Recommended structure:

```txt
Use case -> Template -> How to customize -> Example -> Related guide
```

Current status:

- `/templates/` exists with family trip, rainy day, budget, and hotel comparison templates.

Needed improvements:

- Add a real copyable table or checklist block to every template page.
- Add "when to use this template" and "mistakes to avoid" sections.
- Connect every template to at least 2 articles and the comparison tool.

## Feature Improvement Strategy

### 1. Basic vs Improved Comparison

Current status:

- `/tools/itinerary-comparison/` already has this feature.
- It now includes recommendation reason, improvement effect, and confirmation points.

Why it helps:

- It supports user dwell time.
- It creates a content-to-tool loop without requiring an admin page.
- It is informational enough for approval and can later become a revenue entry point.

### 2. Category Selection

Do not use generic categories like 패션 / 식품 / IT on this site before approval. They are not aligned with Tourpick360's travel niche.

Use travel-intent categories instead:

- 가족여행
- 커플여행
- 부모님 여행
- 비 오는 날
- 축제 여행
- 예산 절약

After approval, a second layer can be added:

- 제주
- 부산
- 강릉
- 전주
- 여수
- 경주
- 서울

### 3. Recommendation Reason

The reason should not be a generic sentence. It should explain the decision logic.

Recommended reason formula:

```txt
Why the basic version fails -> What the improved version reduces -> What the user should check before booking
```

Example:

```txt
가족여행은 이동 횟수와 식사 실패가 피로를 키웁니다. 숙소 주변으로 일정을 묶으면 아이 컨디션 변화에 대응하기 쉽고, 대체 식당을 준비하면 대기 시간이 길어져도 일정이 무너지지 않습니다.
```

## SEO Structure For Google And Naver

### URL Structure

Keep these clusters:

```txt
/domestic/
/domestic/jeju/
/domestic/festivals/
/travel-tips/
/travel-tips/problems/
/case-studies/
/templates/
/tools/itinerary-comparison/
```

Avoid creating thin tag pages before approval.

### Internal Linking

Every new article should link in this order:

1. One parent category hub.
2. Two related problem or regional articles.
3. One template or tool page.

Example:

```txt
Problem article -> Travel Tips hub -> Related regional guide -> Template -> Comparison tool
```

### Metadata

Each article should have:

- Unique title.
- Unique meta description.
- H1 matching the main search intent.
- Article JSON-LD when possible.
- Final checked date.
- Image alt text that describes the article context.

### Naver-Specific Notes

Naver tends to reward clear Korean headings, practical lists, and fresh updates. Keep titles natural in Korean and avoid over-optimized repeated keywords.

Recommended heading pattern:

```txt
H1: 문제 또는 선택 기준
H2: 이런 상황에서 문제가 생깁니다
H2: 먼저 줄일 일정
H2: 숙소와 식사 동선 조정
H2: 체크리스트
H2: 자주 묻는 질문
```

## Approval-After Revenue Strategy

After AdSense approval, add revenue gradually:

### Phase 1

- Add AdSense display ads only in article-safe positions.
- Recommended positions: after intro, after second H2, before FAQ.
- Avoid ads above the first paragraph.

### Phase 2

- Add affiliate or booking links only inside relevant articles.
- Use disclosure text near commercial links.
- Keep informational content stronger than monetization blocks.

### Phase 3

- Expand the comparison tool into a stronger decision tool.
- Add region filters and saved template downloads if needed.
- Add content clusters around high-demand seasonal events.

## Final Recommendation

Do not apply only because page count is over 30. Apply when these are true:

- At least 30 real content pages are visibly useful.
- The main category hubs do not look thin.
- The comparison tool is informational, not sales-heavy.
- Problem-solving, Before / After, and templates are cross-linked.
- The site looks like a domestic travel decision guide, not a mixed-topic monetization site.
