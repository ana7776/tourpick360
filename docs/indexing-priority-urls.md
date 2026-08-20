# Tourpick360 색인 신청 정리

업데이트: 2026-08-20 (최종 · 중복 통합, 방문 후기 재분류, 방문일 표기 반영)
기준: `npm run build` 결과의 `dist/sitemap-0.xml` (색인 대상 68개 URL)

이 문서는 Google Search Console, Naver Search Advisor, Bing Webmaster Tools에 제출할 sitemap과 수동 색인 요청 우선순위를 정리한 체크리스트입니다. 아래 URL은 전부 빌드 결과에 실제로 존재하는 페이지이며, 삭제·통합된 주소는 7번 항목으로 따로 분리했습니다.

## 1. 제출할 사이트맵

가장 먼저 아래 sitemap index를 제출합니다.

```text
https://tourpick360.com/sitemap-index.xml
```

아래는 색인 요청 대상이 아니라 상태 점검용 URL입니다.

```text
https://tourpick360.com/sitemap-0.xml
https://tourpick360.com/robots.txt
https://tourpick360.com/rss.xml
https://tourpick360.com/ads.txt
```

빌드 기준 상태입니다.

```text
빌드 페이지: 70개 (색인 대상 68개 + /search/ noindex + 404)
sitemap-0.xml: URL 68개, 전부 실제 빌드 페이지와 일치
robots.txt: User-agent: * Allow: /, sitemap 경로 명시
ads.txt: pub-5804969457082424
canonical host: https://tourpick360.com
www / http: https://tourpick360.com 으로 301 통일
내부 링크 깨짐 0건, 이미지 누락 0건
BreadcrumbList 구조화 데이터: 67개 페이지 (홈, /search/ 제외)
개인정보처리방침: 제3자 광고 쿠키 고지 포함
실제 방문 후기: 12편 (전부 방문일 표기, 사진 전량 직접 촬영), 공식자료 기반: 42편
사진 저작권: CC BY·CC BY-SA 사용분 저작자 표시 완료
```

## 2. 1순위 - 사이트 구조와 신뢰 신호 (14개)

sitemap 제출 후 가장 먼저 URL 검사를 돌립니다. 심사자와 크롤러가 사이트 성격을 판단하는 페이지입니다.

```text
https://tourpick360.com/
https://tourpick360.com/domestic/
https://tourpick360.com/domestic/festivals/
https://tourpick360.com/domestic/jeju/
https://tourpick360.com/travel-tips/
https://tourpick360.com/case-studies/
https://tourpick360.com/templates/
https://tourpick360.com/tools/itinerary-comparison/
https://tourpick360.com/about/
https://tourpick360.com/editorial-policy/
https://tourpick360.com/contact/
https://tourpick360.com/privacy/
https://tourpick360.com/terms/
https://tourpick360.com/disclosure/
```

## 3. 2순위 - 직접 방문 후기 (12개)

운영자가 실제로 다녀온 뒤 작성한 글이며, 본문 사진은 전부 현장에서 직접 촬영한 것입니다. 사이트에서 대체 불가능한 1차 자료라 가장 먼저 색인되어야 합니다. 각 페이지 제목 아래 `실제 방문 후기` 배지에 방문일이 함께 표시됩니다.

### 3-1. 정산표까지 공개한 단체 여행 4편 (최우선)

총 입금액, 항목별 지출, 1인 부담액이 본문에 그대로 실려 있어 증거 밀도가 가장 높습니다. 색인 요청은 이 4편부터 넣습니다.

```text
https://tourpick360.com/domestic/festivals/muju-wine-cave-jeoksangsan-valley-group-trip-review/
https://tourpick360.com/domestic/festivals/buyeo-lotus-chilgapsan-group-trip-review/
https://tourpick360.com/domestic/festivals/geoje-hydrangea-windhill-sinseondae-course/
https://tourpick360.com/domestic/festivals/gochang-bluefarm-lavender-yeonggwang-drive/
```

| 글 | 방문일 | 규모 |
|---|---|---|
| 무주 머루와인동굴·적상산 | 2026-07-12 (일) | 14명 |
| 부여 궁남지·칠갑산 출렁다리 | 2026-07-05 (일) | 10명 |
| 거제 수국공원·바람의언덕 | 2026-06-28 (일) | 15명 |
| 고창 청농원·영광 백수해안도로 | 2026-06-21 (일) | 15명 |

### 3-2. 정산 없이 다녀온 8편

```text
https://tourpick360.com/domestic/festivals/jeonju-veteran-kalguksu-chutan1438-deokjin-park-night-course/
https://tourpick360.com/domestic/festivals/imsil-n-rose-festival-guide/
https://tourpick360.com/domestic/festivals/gokseong-rose-festival-guide/
https://tourpick360.com/domestic/geochang/y-shaped-suspension-bridge-guide/
https://tourpick360.com/domestic/jeonju/hanok-village-walking-guide/
https://tourpick360.com/domestic/hapcheon/haeinsa-temple-guide/
https://tourpick360.com/domestic/goheung/ssookseom-walking-course-guide/
https://tourpick360.com/domestic/yeosu/night-view-hotel-route-guide/
```

| 글 | 방문일 | 비고 |
|---|---|---|
| 전주 베테랑칼국수·덕진공원 야경 | 2026-07-22 / 07-17 | 7명, 각자 계산 |
| 임실N장미축제 | 2026-05-29 (금) | 사진 EXIF로 확인된 날짜 |
| 곡성 세계장미축제 | 2026-05-17 (일) | 축제 개막 전 장미정원 방문 (본문에 명시) |
| 거창 Y자형 출렁다리 | 2026-04-26 (일) | 합천과 같은 날 |
| 전주 한옥마을 도보 | 2026-06-16 (화) | 지인 동행 |
| 합천 해인사 | 2026-04-26 (일) | 거창과 같은 날 |
| 고흥 쑥섬 | 2026-06-07 (일) | |
| 여수 장도·웅천·낭도 | 2026-05-31 (일) | |

## 4. 3순위 - 축제 여행 가이드 (13개)

핵심 니치인 국내 계절 축제 클러스터입니다. 위 방문 후기와 같은 허브(`/domestic/festivals/`) 아래 묶여 있습니다.

```text
https://tourpick360.com/domestic/festivals/seasonal-festival-travel-guide/
https://tourpick360.com/domestic/festivals/festival-travel-by-companion/
https://tourpick360.com/domestic/festivals/festival-booking-budget-guide/
https://tourpick360.com/domestic/festivals/rainy-season-festival-travel-plan/
https://tourpick360.com/domestic/festivals/early-summer-night-festival-heat-plan/
https://tourpick360.com/domestic/festivals/summer-family-festival-rest-plan/
https://tourpick360.com/domestic/festivals/autumn-parents-festival-overnight-choice/
https://tourpick360.com/domestic/festivals/friday-night-arrival-festival-weekend-plan/
https://tourpick360.com/domestic/festivals/friends-festival-room-budget-plan/
https://tourpick360.com/domestic/festivals/long-drive-festival-overnight-area/
https://tourpick360.com/domestic/festivals/public-transport-festival-daytrip-overnight/
https://tourpick360.com/domestic/festivals/train-arrival-luggage-festival-route/
https://tourpick360.com/domestic/festivals/pet-friendly-festival-travel-checklist/
```

## 5. 4순위 - 지역 가이드 (14개)

지역별 숙소 권역과 동선 비교 글입니다. 제주는 통합 가이드 3개로 유지합니다.

```text
https://tourpick360.com/domestic/jeju/jeju-hotel-area-guide/
https://tourpick360.com/domestic/jeju/family-hotel-area-guide/
https://tourpick360.com/domestic/jeju/2n3d-rental-car-itinerary/
https://tourpick360.com/domestic/busan/family-hotel-area-guide/
https://tourpick360.com/domestic/busan/rainy-day-family-route/
https://tourpick360.com/domestic/busan/history-walking-route-guide/
https://tourpick360.com/domestic/gangneung/ktx-weekend-trip-guide/
https://tourpick360.com/domestic/gangneung/no-car-weekend-course/
https://tourpick360.com/domestic/gangneung/attraction-area-guide/
https://tourpick360.com/domestic/seoul/purpose-area-hotel-guide/
https://tourpick360.com/domestic/seoul/rainy-day-indoor-route-guide/
https://tourpick360.com/domestic/gyeongju/walking-route-hotel-area-guide/
https://tourpick360.com/domestic/jeonju/hanok-village-nearby-trip-guide/
https://tourpick360.com/domestic/geoje/attraction-area-guide/
```

## 6. 5순위 - 여행 준비와 문제 해결 (15개)

sitemap 발견을 기다려도 되지만, 하루 요청 한도가 남으면 아래 순서로 넣습니다. 아래 6개 준비 가이드는 2026-08-20 통합에서 문제 해결 글의 내용을 흡수해 더 깊어졌으므로, 통합 전 색인된 상태라면 다시 요청해 갱신본이 반영되게 합니다.

```text
https://tourpick360.com/travel-tips/rainy-day-backup-plan/
https://tourpick360.com/travel-tips/late-checkin-plan/
https://tourpick360.com/travel-tips/travel-budget-plan/
https://tourpick360.com/travel-tips/hotel-booking-checklist/
https://tourpick360.com/travel-tips/rental-car-checklist/
https://tourpick360.com/travel-tips/child-travel-fatigue-solution/
https://tourpick360.com/travel-tips/problems/parking-full-travel-route-fix/
https://tourpick360.com/travel-tips/problems/festival-hotel-sold-out-alternative/
https://tourpick360.com/travel-tips/problems/hotel-cancellation-policy-check/
https://tourpick360.com/travel-tips/problems/no-car-trip-hotel-area-choice/
https://tourpick360.com/travel-tips/problems/summer-beach-hotel-area-alternative/
https://tourpick360.com/travel-tips/problems/jeju-rental-car-return-last-day-plan/
https://tourpick360.com/travel-tips/problems/parents-trip-walking-distance-reduction/
https://tourpick360.com/travel-tips/problems/luggage-before-checkin-plan/
https://tourpick360.com/travel-tips/problems/family-trip-schedule-delays/
```

## 7. 색인 요청하면 안 되는 URL

### 7-1. 통합·삭제되어 301 리디렉션만 남은 주소

아래 주소는 현재 페이지가 없고 301로만 응답합니다. **색인 요청 대상이 아닙니다.** Search Console 페이지 색인 보고서에서 "페이지에 리디렉션이 있음"으로 잡히는 것이 정상 상태입니다. 이전 버전 문서(2026-07-01)에는 이 중 9개가 색인 요청 목록에 들어가 있었으므로, 그 목록을 그대로 쓰면 안 됩니다. 목록 아래쪽 6건은 2026-08-20 중복 통합으로 사라진 문제 해결 글이며, 내용은 각 리디렉션 대상 글에 흡수되어 있습니다.

```text
/domestic/bicycle/                                    -> /domestic/
/domestic/bicycle-routes-guide/                       -> /domestic/
/api/bicycle-routes.json                              -> /domestic/
/domestic/jeju/airport-area-hotel-checklist/          -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/aewol-hotel-pros-cons/                 -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/jungmun-family-resort-guide/           -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/seongsan-hotel-route-guide/            -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/no-rental-car-jeju-hotel-area/         -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/jeju-3n4d-split-hotel-plan/            -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/rainy-day-indoor-jeju-hotel-area/      -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/parents-jeju-hotel-area-guide/         -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/couple-jeju-hotel-choice/              -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/jeju/budget-jeju-trip-hotel-plan/           -> /domestic/jeju/jeju-hotel-area-guide/
/domestic/festivals/spring-flower-festival-hotel-area/   -> /domestic/festivals/seasonal-festival-travel-guide/
/domestic/festivals/summer-beach-festival-checklist/     -> /domestic/festivals/seasonal-festival-travel-guide/
/domestic/festivals/autumn-food-festival-route/          -> /domestic/festivals/seasonal-festival-travel-guide/
/domestic/festivals/winter-light-festival-hotel-area/    -> /domestic/festivals/seasonal-festival-travel-guide/
/domestic/festivals/parents-walking-festival-guide/      -> /domestic/festivals/festival-travel-by-companion/
/domestic/festivals/family-spring-festival-choice/       -> /domestic/festivals/festival-travel-by-companion/
/domestic/festivals/couple-night-festival-route/         -> /domestic/festivals/festival-travel-by-companion/
/domestic/festivals/festival-travel-budget-plan/         -> /domestic/festivals/festival-booking-budget-guide/
/domestic/festivals/festival-hotel-booking-checklist/    -> /domestic/festivals/festival-booking-budget-guide/
/domestic/festivals/rainy-day-indoor-festival-backup/    -> /domestic/festivals/festival-booking-budget-guide/
/case-studies/busan-family-route-before-after/        -> /case-studies/
/case-studies/gangneung-weekend-before-after/         -> /case-studies/
/case-studies/gyeongju-walking-route-before-after/    -> /case-studies/
/case-studies/jeju-rainy-day-before-after/            -> /case-studies/
/case-studies/jeju-rental-return-before-after/        -> /case-studies/
/case-studies/jeonju-parking-route-before-after/      -> /case-studies/
/case-studies/no-car-hotel-area-before-after/         -> /case-studies/
/templates/family-trip-plan-template/                 -> /templates/
/templates/hotel-comparison-template/                 -> /templates/
/templates/rainy-day-itinerary-template/              -> /templates/
/templates/travel-budget-template/                    -> /templates/
/travel-tips/itinerary-before-after/                  -> /case-studies/
/travel-tips/problems/rainy-trip-route-change/                -> /travel-tips/rainy-day-backup-plan/
/travel-tips/problems/busan-rainy-day-indoor-family-course/   -> /domestic/busan/rainy-day-family-route/
/travel-tips/problems/late-arrival-first-day-plan/            -> /travel-tips/late-checkin-plan/
/travel-tips/problems/gangneung-late-ktx-hotel-area/          -> /domestic/gangneung/ktx-weekend-trip-guide/
/travel-tips/problems/trip-budget-overrun-fix/                -> /travel-tips/travel-budget-plan/
/travel-tips/problems/jeonju-hanok-parking-alternative-route/ -> /travel-tips/problems/parking-full-travel-route-fix/
/en/ , /ja/ , /es/ , /zh-CN/ 및 하위 bicycle-routes 8건  -> / 또는 /domestic/
```

### 7-2. 문서 색인 대상이 아닌 파일과 페이지

```text
https://tourpick360.com/search/          (noindex, follow - 사이트 내부 검색 폼)
https://tourpick360.com/404.html         (noindex, follow)
https://tourpick360.com/robots.txt
https://tourpick360.com/rss.xml
https://tourpick360.com/ads.txt
https://tourpick360.com/sitemap-index.xml
https://tourpick360.com/sitemap-0.xml
```

## 8. 신청 순서

1. Google Search Console에서 `https://tourpick360.com/sitemap-index.xml` 제출
2. Naver Search Advisor, Bing Webmaster Tools에 사이트 소유 확인 후 같은 sitemap 제출
3. Google URL 검사에서 1순위 14개 수동 색인 요청
4. 2순위 방문 후기 12개 요청 (정산표 있는 4편 우선)
5. 하루 요청 한도가 남으면 3순위 → 4순위 → 5순위 순서로 요청
6. 3일 뒤 `site:tourpick360.com` 검색과 Search Console 페이지 색인 보고서 확인
7. 보고서의 "찾을 수 없음(404)" 항목이 0건인지 확인한다. 7-1의 주소는 "리디렉션이 있음"으로 잡혀야 정상이며, 404로 잡히면 `public/_redirects` 배포가 누락된 것이다
8. "발견됨 - 현재 색인되지 않음"이 많으면 해당 URL의 본문 분량, 내부 링크 수, canonical을 다시 점검
9. 2026-08-20 통합으로 사라진 6개 URL이 색인에 남아 있다면 강제로 삭제 요청하지 말고 301이 반영될 때까지 둔다. 리디렉션은 색인 신호를 통합 대상 글로 넘기므로, 삭제 요청은 그 신호까지 함께 버리게 된다

## 9. 빠른 복사용 묶음 (하루 10개 한도)

```text
https://tourpick360.com/
https://tourpick360.com/domestic/festivals/
https://tourpick360.com/domestic/
https://tourpick360.com/travel-tips/
https://tourpick360.com/domestic/festivals/imsil-n-rose-festival-guide/
https://tourpick360.com/domestic/festivals/gochang-bluefarm-lavender-yeonggwang-drive/
https://tourpick360.com/domestic/festivals/geoje-hydrangea-windhill-sinseondae-course/
https://tourpick360.com/domestic/festivals/buyeo-lotus-chilgapsan-group-trip-review/
https://tourpick360.com/domestic/festivals/muju-wine-cave-jeoksangsan-valley-group-trip-review/
https://tourpick360.com/domestic/festivals/jeonju-veteran-kalguksu-chutan1438-deokjin-park-night-course/
```

## 10. 이 문서 갱신 방법

URL이 바뀌면 문서를 손으로 고치지 말고 아래 순서로 대조한다.

```bash
npm run build
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | sed 's|</\?loc>||g' | sort
```

출력된 목록과 2~6번 항목의 합계가 일치해야 한다. 페이지를 삭제하거나 통합했다면 `public/_redirects`에 301을 먼저 추가하고, 그 주소를 7-1로 옮긴다.
