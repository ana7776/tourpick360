# Tourpick360 색인 신청 정리

업데이트: 2026-08-16 (배포 커밋 `040ee69` 기준)

이 문서는 Search Console에 제출할 sitemap과 수동 색인 요청 우선순위를 정리한 체크리스트입니다.
**모든 URL은 현재 빌드 결과물에 실제로 존재하는 페이지인지 검증했습니다.**

이전 버전 문서에는 그 사이 통합·삭제되어 301 리디렉션되는 URL 10건이 남아 있었습니다
(`/domestic/bicycle/`, `/templates/*-template/`, `/travel-tips/itinerary-before-after/`,
`/domestic/jeju/airport-area-hotel-checklist/` 등). 리디렉션되는 주소에 색인을 요청하면
하루 할당량만 소모되므로 이번에 전부 제거했습니다.

## 1. 먼저 할 일: 사이트맵 재제출

```text
https://tourpick360.com/sitemap-index.xml
```

사이트맵의 `lastmod`는 빌드 시각으로 갱신되므로, 재제출만 해도 변경된 페이지 전체가
재크롤 대상에 들어갑니다. 아래는 색인 요청 대상이 아니라 상태 점검용입니다.

```text
https://tourpick360.com/robots.txt
https://tourpick360.com/ads.txt
https://tourpick360.com/rss.xml
```

## 2. 1순위 — 이번 배포로 내용이 실제로 바뀐 페이지 (8건)

하루 할당량이 제한적이므로 이 8건을 가장 먼저 요청합니다.
전부 본문이 눈에 띄게 달라진 페이지입니다.

```text
https://tourpick360.com/
https://tourpick360.com/domestic/festivals/buyeo-lotus-chilgapsan-group-trip-review/
https://tourpick360.com/domestic/festivals/geoje-hydrangea-windhill-sinseondae-course/
https://tourpick360.com/domestic/festivals/gochang-bluefarm-lavender-yeonggwang-drive/
https://tourpick360.com/domestic/festivals/jeonju-veteran-kalguksu-chutan1438-deokjin-park-night-course/
https://tourpick360.com/domestic/festivals/muju-wine-cave-jeoksangsan-valley-group-trip-review/
https://tourpick360.com/tools/itinerary-comparison/
https://tourpick360.com/editorial-policy/
```

- 홈: '직접 다녀온 여행 후기' 섹션 신설, 최신 글 목록 갱신
- 방문 후기 5건: '실제 방문 후기' 표시와 방문일 추가
- 비교 도구: 10개 유형을 서버 렌더링으로 전환 (본문 314 → 1,576 단어)
- 편집 기준: 실제 방문/공식자료 기반 구분 기준 명시

## 3. 2순위 — 표시가 추가된 나머지 글 (55건)

'공식자료 기반 가이드' 배지가 붙은 글입니다. 본문 자체는 그대로이므로
**수동 요청보다 사이트맵 재크롤에 맡기는 편이 낫습니다.** 특정 글이 오래
갱신되지 않을 때만 골라서 요청하세요.

```text
https://tourpick360.com/domestic/busan/family-hotel-area-guide/
https://tourpick360.com/domestic/busan/history-walking-route-guide/
https://tourpick360.com/domestic/busan/rainy-day-family-route/
https://tourpick360.com/domestic/festivals/autumn-parents-festival-overnight-choice/
https://tourpick360.com/domestic/festivals/early-summer-night-festival-heat-plan/
https://tourpick360.com/domestic/festivals/festival-booking-budget-guide/
https://tourpick360.com/domestic/festivals/festival-travel-by-companion/
https://tourpick360.com/domestic/festivals/friday-night-arrival-festival-weekend-plan/
https://tourpick360.com/domestic/festivals/friends-festival-room-budget-plan/
https://tourpick360.com/domestic/festivals/gokseong-rose-festival-guide/
https://tourpick360.com/domestic/festivals/imsil-n-rose-festival-guide/
https://tourpick360.com/domestic/festivals/long-drive-festival-overnight-area/
https://tourpick360.com/domestic/festivals/pet-friendly-festival-travel-checklist/
https://tourpick360.com/domestic/festivals/public-transport-festival-daytrip-overnight/
https://tourpick360.com/domestic/festivals/rainy-season-festival-travel-plan/
https://tourpick360.com/domestic/festivals/seasonal-festival-travel-guide/
https://tourpick360.com/domestic/festivals/summer-family-festival-rest-plan/
https://tourpick360.com/domestic/festivals/train-arrival-luggage-festival-route/
https://tourpick360.com/domestic/gangneung/attraction-area-guide/
https://tourpick360.com/domestic/gangneung/ktx-weekend-trip-guide/
https://tourpick360.com/domestic/gangneung/no-car-weekend-course/
https://tourpick360.com/domestic/geochang/y-shaped-suspension-bridge-guide/
https://tourpick360.com/domestic/geoje/attraction-area-guide/
https://tourpick360.com/domestic/goheung/ssookseom-walking-course-guide/
https://tourpick360.com/domestic/gyeongju/walking-route-hotel-area-guide/
https://tourpick360.com/domestic/hapcheon/haeinsa-temple-guide/
https://tourpick360.com/domestic/jeju/2n3d-rental-car-itinerary/
https://tourpick360.com/domestic/jeju/family-hotel-area-guide/
https://tourpick360.com/domestic/jeju/jeju-hotel-area-guide/
https://tourpick360.com/domestic/jeonju/hanok-village-nearby-trip-guide/
https://tourpick360.com/domestic/jeonju/hanok-village-walking-guide/
https://tourpick360.com/domestic/seoul/purpose-area-hotel-guide/
https://tourpick360.com/domestic/seoul/rainy-day-indoor-route-guide/
https://tourpick360.com/domestic/yeosu/night-view-hotel-route-guide/
https://tourpick360.com/travel-tips/child-travel-fatigue-solution/
https://tourpick360.com/travel-tips/hotel-booking-checklist/
https://tourpick360.com/travel-tips/late-checkin-plan/
https://tourpick360.com/travel-tips/problems/busan-rainy-day-indoor-family-course/
https://tourpick360.com/travel-tips/problems/family-trip-schedule-delays/
https://tourpick360.com/travel-tips/problems/festival-hotel-sold-out-alternative/
https://tourpick360.com/travel-tips/problems/gangneung-late-ktx-hotel-area/
https://tourpick360.com/travel-tips/problems/hotel-cancellation-policy-check/
https://tourpick360.com/travel-tips/problems/jeju-rental-car-return-last-day-plan/
https://tourpick360.com/travel-tips/problems/jeonju-hanok-parking-alternative-route/
https://tourpick360.com/travel-tips/problems/late-arrival-first-day-plan/
https://tourpick360.com/travel-tips/problems/luggage-before-checkin-plan/
https://tourpick360.com/travel-tips/problems/no-car-trip-hotel-area-choice/
https://tourpick360.com/travel-tips/problems/parents-trip-walking-distance-reduction/
https://tourpick360.com/travel-tips/problems/parking-full-travel-route-fix/
https://tourpick360.com/travel-tips/problems/rainy-trip-route-change/
https://tourpick360.com/travel-tips/problems/summer-beach-hotel-area-alternative/
https://tourpick360.com/travel-tips/problems/trip-budget-overrun-fix/
https://tourpick360.com/travel-tips/rainy-day-backup-plan/
https://tourpick360.com/travel-tips/rental-car-checklist/
https://tourpick360.com/travel-tips/travel-budget-plan/
```

## 4. 3순위 — 허브·정책 페이지 (11건)

이번 배포에서 본문이 바뀌지 않았습니다. 색인 상태가 정상이면 요청하지 않아도 됩니다.

```text
https://tourpick360.com/about/
https://tourpick360.com/case-studies/
https://tourpick360.com/contact/
https://tourpick360.com/disclosure/
https://tourpick360.com/domestic/
https://tourpick360.com/domestic/festivals/
https://tourpick360.com/domestic/jeju/
https://tourpick360.com/privacy/
https://tourpick360.com/templates/
https://tourpick360.com/terms/
https://tourpick360.com/travel-tips/
```

## 5. 색인 요청하면 안 되는 URL

아래는 301 리디렉션 대상입니다. 색인 요청 대상이 아니며, 재크롤되면
Search Console의 '리디렉션이 포함된 페이지' 항목으로 정리됩니다.

```text
https://tourpick360.com/en/
https://tourpick360.com/ja/
https://tourpick360.com/es/
https://tourpick360.com/zh-CN/
https://tourpick360.com/en/bicycle-routes/
https://tourpick360.com/ja/bicycle-routes/
https://tourpick360.com/es/bicycle-routes/
https://tourpick360.com/zh-CN/bicycle-routes/
```

`www.tourpick360.com` 주소와 `http://` 주소도 모두 대표 주소로 301되므로 요청하지 않습니다.
`/search/`는 `noindex`이고, `/404.html`, sitemap·robots·ads 파일도 문서 색인 대상이 아닙니다.

## 6. 진행 순서

1. Search Console에서 `sitemap-index.xml` 재제출
2. URL 검사에서 2번 항목의 8건을 순서대로 색인 요청
3. 3~4일 뒤 '페이지 색인 생성' 보고서에서 아래를 확인
   - '찾을 수 없음(404)' 10건이 줄었는지 (다국어 8건 리디렉션 처리 반영)
   - 1순위 8건이 '색인 생성됨'으로 바뀌었는지
4. 실제 방문 정보를 채운 글이 생기면 그 글만 추가로 색인 요청

## 7. 현재 사이트 규모

- 색인 대상 페이지: 74건 (`/search/` 제외)
- 실제 방문 후기: 5건
- 공식자료 기반 가이드: 55건
- 허브·정책 페이지: 14건
