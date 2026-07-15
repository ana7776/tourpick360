# Tourpick360 색인 신청 정리

업데이트: 2026-07-01

이 문서는 Google Search Console, Naver Search Advisor, Bing Webmaster Tools에 제출할 sitemap과 수동 색인 요청 우선순위를 정리한 체크리스트입니다.

## 1. 제출할 사이트맵

가장 먼저 아래 sitemap index를 제출합니다.

```text
https://tourpick360.com/sitemap-index.xml
```

직접 상태 확인용 URL입니다. 색인 요청 URL로 넣기보다 상태 점검용으로 사용합니다.

```text
https://tourpick360.com/sitemap-0.xml
https://tourpick360.com/robots.txt
https://tourpick360.com/rss.xml
https://tourpick360.com/ads.txt
```

현재 배포 기준 상태입니다.

```text
robots.txt: 200 OK, User-agent: * Allow: /
sitemap-index.xml: 200 OK, sitemap-0.xml 포함
sitemap-0.xml: 200 OK, URL 102개 포함
rss.xml: 200 OK
ads.txt: 200 OK, pub-5804969457082424 정상
canonical host: https://tourpick360.com
www host: https://tourpick360.com 으로 301 통일
```

## 2. 수동 색인 요청 1순위

사이트 구조와 신뢰 신호를 먼저 잡는 URL입니다. sitemap 제출 후 가장 먼저 URL 검사를 돌립니다.

```text
https://tourpick360.com/
https://tourpick360.com/domestic/
https://tourpick360.com/domestic/festivals/
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

## 3. 수동 색인 요청 2순위

신규/보강 콘텐츠와 내부 링크 허브 역할을 하는 글입니다.

```text
https://tourpick360.com/domestic/bicycle/
https://tourpick360.com/domestic/bicycle-routes-guide/
https://tourpick360.com/domestic/festivals/geoje-hydrangea-windhill-sinseondae-course/
https://tourpick360.com/domestic/festivals/gochang-bluefarm-lavender-yeonggwang-drive/
https://tourpick360.com/domestic/geochang/y-shaped-suspension-bridge-guide/
https://tourpick360.com/domestic/goheung/ssookseom-walking-course-guide/
https://tourpick360.com/domestic/hapcheon/haeinsa-temple-guide/
https://tourpick360.com/domestic/jeonju/hanok-village-walking-guide/
https://tourpick360.com/domestic/jeonju/hanok-village-nearby-trip-guide/
```

## 4. 수동 색인 요청 3순위

검색 유입과 AdSense 심사에서 본문 가치가 분명한 문제 해결형/템플릿 페이지입니다.

```text
https://tourpick360.com/travel-tips/itinerary-before-after/
https://tourpick360.com/travel-tips/hotel-booking-checklist/
https://tourpick360.com/travel-tips/rainy-day-backup-plan/
https://tourpick360.com/travel-tips/rental-car-checklist/
https://tourpick360.com/travel-tips/travel-budget-plan/
https://tourpick360.com/templates/family-trip-plan-template/
https://tourpick360.com/templates/hotel-comparison-template/
https://tourpick360.com/templates/rainy-day-itinerary-template/
https://tourpick360.com/templates/travel-budget-template/
```

## 5. 수동 색인 요청 4순위

대표 여행지 가이드입니다.

```text
https://tourpick360.com/domestic/jeju/
https://tourpick360.com/domestic/jeju/2n3d-rental-car-itinerary/
https://tourpick360.com/domestic/jeju/family-hotel-area-guide/
https://tourpick360.com/domestic/jeju/airport-area-hotel-checklist/
https://tourpick360.com/domestic/jeju/rainy-day-indoor-jeju-hotel-area/
https://tourpick360.com/domestic/busan/family-hotel-area-guide/
https://tourpick360.com/domestic/busan/rainy-day-family-route/
https://tourpick360.com/domestic/gangneung/ktx-weekend-trip-guide/
https://tourpick360.com/domestic/gangneung/no-car-weekend-course/
https://tourpick360.com/domestic/gyeongju/walking-route-hotel-area-guide/
https://tourpick360.com/domestic/seoul/purpose-area-hotel-guide/
https://tourpick360.com/domestic/seoul/rainy-day-indoor-route-guide/
https://tourpick360.com/domestic/yeosu/night-view-hotel-route-guide/
```

## 6. 수동 색인 요청 5순위

문제 해결형 글은 sitemap 발견을 기다려도 되지만, 여유가 있으면 아래부터 순서대로 요청합니다.

```text
https://tourpick360.com/travel-tips/problems/rainy-trip-route-change/
https://tourpick360.com/travel-tips/problems/parking-full-travel-route-fix/
https://tourpick360.com/travel-tips/problems/jeju-rental-car-return-last-day-plan/
https://tourpick360.com/travel-tips/problems/busan-rainy-day-indoor-family-course/
https://tourpick360.com/travel-tips/problems/gangneung-late-ktx-hotel-area/
https://tourpick360.com/travel-tips/problems/jeonju-hanok-parking-alternative-route/
https://tourpick360.com/travel-tips/problems/no-car-trip-hotel-area-choice/
https://tourpick360.com/travel-tips/problems/summer-beach-hotel-area-alternative/
https://tourpick360.com/travel-tips/problems/family-trip-schedule-delays/
https://tourpick360.com/travel-tips/problems/hotel-cancellation-policy-check/
https://tourpick360.com/travel-tips/problems/late-arrival-first-day-plan/
https://tourpick360.com/travel-tips/problems/festival-hotel-sold-out-alternative/
https://tourpick360.com/travel-tips/problems/trip-budget-overrun-fix/
https://tourpick360.com/travel-tips/problems/luggage-before-checkin-plan/
https://tourpick360.com/travel-tips/problems/parents-trip-walking-distance-reduction/
```

## 7. 제외할 URL

아래 URL은 수동 색인 요청 대상이 아닙니다.

```text
https://tourpick360.com/404.html
https://tourpick360.com/api/bicycle-routes.json
https://tourpick360.com/robots.txt
https://tourpick360.com/rss.xml
https://tourpick360.com/ads.txt
https://tourpick360.com/sitemap-index.xml
https://tourpick360.com/sitemap-0.xml
```

`404.html`은 `noindex, follow` 대상이고, JSON/API/XML/TXT 파일은 문서 색인 대상이 아니라 상태 확인 또는 제출용 파일입니다.

## 8. 신청 순서

1. Google Search Console에서 `https://tourpick360.com/sitemap-index.xml` 제출
2. Naver Search Advisor에서 사이트 소유 확인 후 같은 sitemap 제출
3. Google URL 검사에서 1순위 URL 13개 수동 색인 요청
4. 2순위 신규/보강 콘텐츠 요청
5. 하루 요청 제한이 남으면 3순위와 4순위 순서로 요청
6. 3일 뒤 `site:tourpick360.com` 검색과 Search Console 페이지 색인 보고서 확인
7. 발견됨/크롤링됨 상태인데 색인 제외가 많으면 해당 URL의 본문 품질, 내부 링크, canonical을 다시 점검

## 9. 빠른 복사용 묶음

하루에 10개만 요청할 때는 아래만 먼저 넣습니다.

```text
https://tourpick360.com/
https://tourpick360.com/domestic/
https://tourpick360.com/domestic/festivals/
https://tourpick360.com/travel-tips/
https://tourpick360.com/domestic/bicycle/
https://tourpick360.com/domestic/bicycle-routes-guide/
https://tourpick360.com/domestic/festivals/geoje-hydrangea-windhill-sinseondae-course/
https://tourpick360.com/domestic/festivals/gochang-bluefarm-lavender-yeonggwang-drive/
https://tourpick360.com/templates/
https://tourpick360.com/tools/itinerary-comparison/
```
