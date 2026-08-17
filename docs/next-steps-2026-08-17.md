# 다음 작업 정리 (2026-08-17 기준)

서치콘솔 데이터(성능 8/9~8/15, 색인 커버리지 ~8/14)와 애드센스 승인 지침서를
기준으로 점검한 결과와 남은 작업이다.

## 1. 지금 상태

작업 브랜치: `claude/continue-previous-work-4ntvkt`

main에 아직 반영되지 않은 커밋 5개:

```txt
8c1d7a5 검색결과에서 잘려 나가던 제목 뒷부분을 정리
040ee69 실제 방문 후기와 공식자료 기반 가이드를 글마다 구분 표시
0542398 비교 도구 10개 유형을 서버 렌더링으로 전환
9063c4b 삭제된 다국어 페이지 8건에 리디렉션 추가
e37c524 메인에 직접 방문 후기 섹션 추가하고 중복 슬러그 정리
```

즉 **운영 사이트에는 이 5개 작업이 아직 없다.** 아래 1순위 작업이 여기서 나온다.

## 2. 서치콘솔 판독 결과

### 색인 (8/14)

| 항목 | 수치 |
| --- | --- |
| 색인 생성됨 | 70 |
| 색인 생성 안 됨 | 61 |

7월 중순 100 → 89 → 76 → 70으로 줄었지만, 색인 안 된 61건의 내역이 정확히 나뉜다.

```txt
리디렉션이 포함된 페이지      39
찾을 수 없음(404)             11
크롤링됨 - 색인 생성 안 됨      4
발견됨 - 색인 생성 안 됨        7
```

39건은 얇은 글을 통합하며 건 301 리디렉션이라 **의도한 결과다.** 원본이 색인에서
빠지는 것이 정상이므로 이 숫자를 문제로 보고 되돌리지 않는다.

### 성능 (8/9~8/15)

노출 237회, 클릭 2회, 평균 게재순위 11위. 기기별로는 데스크톱 196노출 2클릭,
모바일 41노출 0클릭이다.

| 페이지 | 노출 | 순위 | 클릭 |
| --- | --- | --- | --- |
| /domestic/gangneung/attraction-area-guide/ | 53 | 7.2 | 1 |
| /domestic/jeonju/hanok-village-walking-guide/ | 35 | 8.1 | 0 |
| /domestic/geoje/attraction-area-guide/ | 34 | 8.5 | 0 |
| /domestic/jeonju/hanok-village-nearby-trip-guide/ | 22 | 11.0 | 0 |
| /domestic/seoul/purpose-area-hotel-guide/ | 13 | 48.3 | 0 |

검색어는 `서울 숙소 위치`(7노출, 48위), `서울 숙소 위치 추천`(6노출, 48.7위),
`전주 한옥마을 코스`(3노출, 4위), `장미축제 곡성`, `거창 y자형 출렁다리`,
`곡성 축제` 순이다.

## 3. 남은 작업 (우선순위 순)

### 1순위. 브랜치를 main에 반영해 404 11건 중 8건 해소

`9063c4b`가 추가한 다국어 리디렉션 8건이 브랜치에만 있다. 페이지는 이미 삭제됐는데
리디렉션이 배포되지 않아 그대로 404가 되고 있다.

```txt
/en/  /ja/  /es/  /zh-CN/
/en/bicycle-routes/  /ja/bicycle-routes/  /es/bicycle-routes/  /zh-CN/bicycle-routes/
```

코드 수정 없이 배포만으로 해결된다. 배포 뒤 서치콘솔에서 404 항목 유효성 검사를
다시 시작하고, 남는 3건의 실제 URL을 확인해야 한다. (엑셀 내보내기에는 URL 목록이
없어 화면에서 직접 봐야 한다.)

### 2순위. 얇은 글 3건 보강

지침서 8.3 얇은 콘텐츠 기준과 로드맵의 본문 1,500자 기준에 미달한다.

| 페이지 | 본문 | 보강 방향 |
| --- | --- | --- |
| /domestic/seoul/purpose-area-hotel-guide/ | 1,164자 | 주력 검색어 `서울 숙소 위치`가 48위. H2 4개가 각 한 문단뿐이고 종로·명동·홍대·강남 같은 권역명이 본문에 거의 없다. 권역별 환승 구조와 늦은 시간 복귀 기준을 구체적으로 넣는다. |
| /domestic/gyeongju/walking-route-hotel-area-guide/ | 1,263자 | 도보 시간·거리 수치 없이 서술만 있다. 황리단길·대릉원·첨성대·월정교 사이 실제 도보 시간을 넣는다. |
| /travel-tips/rental-car-checklist/ | 1,100자 | 체크리스트인데 항목이 얕다. 인수·반납 시간, 보험 구분, 주유 조건을 단계로 정리한다. |

주의: 이 세 글은 `SourceBadge` 기본값인 공식자료 기반 가이드다. 확인되지 않은
요금이나 소요 시간을 지어내지 않는다. 판단 기준과 권역 구조 위주로 보강한다.

### 3순위. sitemap lastmod 정직화

`astro.config.mjs`가 빌드 시각을 74개 URL 전체의 `lastmod`로 넣는다.

```js
const publishDate = new Date();
// ...
sitemap({ lastmod: publishDate, ... })
```

배포할 때마다 모든 글이 수정된 것으로 표시돼 구글이 날짜를 신뢰하지 않게 된다.
운영 지침의 "기존 글 업데이트일 유지"와도 어긋난다. 글마다 이미 본문에 최종 확인일이
있으므로, 그 값을 페이지별 `lastmod`로 넘기는 방식으로 바꾼다.

### 4순위. 인바운드 링크가 1개뿐인 글 정리

내부 링크가 1개인 글이 15건, 2개인 글이 8건이다. 지침서 3.4 기준으로 고립까지는
아니지만 연결이 약하다. 아래 15건부터 허브·관련 글에서 연결한다.

```txt
/domestic/busan/history-walking-route-guide/
/domestic/festivals/autumn-parents-festival-overnight-choice/
/domestic/festivals/friday-night-arrival-festival-weekend-plan/
/domestic/festivals/friends-festival-room-budget-plan/
/domestic/festivals/gokseong-rose-festival-guide/
/domestic/festivals/imsil-n-rose-festival-guide/
/domestic/festivals/pet-friendly-festival-travel-checklist/
/domestic/festivals/train-arrival-luggage-festival-route/
/domestic/goheung/ssookseom-walking-course-guide/
/domestic/seoul/rainy-day-indoor-route-guide/
/travel-tips/problems/busan-rainy-day-indoor-family-course/
/travel-tips/problems/gangneung-late-ktx-hotel-area/
/travel-tips/problems/summer-beach-hotel-area-alternative/
```

`곡성 축제`, `장미축제 곡성` 검색어가 이미 잡히는 곡성 장미축제 글이 인바운드 1개인
점은 특히 아깝다.

### 판단 보류. 상위 노출 페이지의 제목 표현

강릉·거제 명소 가이드가 7~8위인데 클릭이 0이다. 제목의 `권역별`이 검색자가 쓰는
말이 아니라 `가볼만한곳` 계열 표현으로 바꾸는 안을 검토했으나, 이미 잡은 순위를
흔들 수 있어 보류했다. 8/17 제목 수정 결과를 2~3주 지켜본 뒤 판단한다.

## 4. 이번에 끝낸 작업

`8c1d7a5` 검색결과 제목 잘림 수정.

제목 생성 규칙(`src/utils/searchSnippets.js`)이 글마다 `| 위치 추천 기준`,
`| 일정·비용·사진` 같은 범용 라벨을 끼워 넣어 제목이 45~68자였다. 구글 한국어
검색결과는 한글 33자 부근에서 잘리므로 라벨은 보이지도 않으면서 실제 설명이 들어갈
자리를 뺏고 있었다. 같은 라벨이 32개 글에 반복돼 글 사이를 구분해 주지도 못했다.

- 라벨 규칙 삭제. 글 제목이 그대로 검색결과 제목이 된다.
- 글자 수 대신 표시 폭으로 계산한다. 한글·전각을 두 배로 세고 폭 66(한글 33자)을 넘지 않게 한다.
- 사이트명은 남는 폭이 있을 때만 붙인다.
- 설명문도 같은 기준. 이미 노출 구간을 채운 글에는 범용 문장을 덧붙이지 않는다.
- 사이트명이 중간에 잘리던 하드코딩 제목 3건(`/templates/`, `/case-studies/`,
  `/travel-tips/child-travel-fatigue-solution/`)을 줄였다.

## 5. 다시 확인하지 않아도 되는 항목

지침서 10.1 신청 전 20문항 기준으로 이번에 통과를 확인했다.

```txt
깨진 내부 링크        0건
고립 페이지           0건 (검색 페이지는 의도적 noindex)
alt 없는 이미지       0건
제휴 링크             0건 (외부 링크는 전부 관광공사·지자체·공식 홈페이지)
광고 자리만 있는 박스  없음
중복 제목·설명        0건
신뢰 페이지           about, contact, privacy, terms, disclosure, editorial-policy 6종 정상
robots.txt            전체 허용, 사이트맵 2종 명시
ads.txt               게시자 ID 일치
사이트맵              74 URL 정상
```

소개·문의 페이지는 운영자 실명과 실제 이메일, 직접 다녀온 경험 서술이 들어가 있어
지침서 3.2 기준을 만족한다.

## 6. 점검을 다시 돌리는 방법

```bash
npm ci
npm run build
node scripts/check-seo-build.mjs
```

깨진 링크·고립 페이지·본문 길이·제목 폭 감사는 `dist`를 훑는 임시 스크립트로 돌렸다.
필요하면 `scripts/`에 정식 스크립트로 옮긴다.
