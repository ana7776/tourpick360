# Tourpick360 Data and API Preparation

## Priority

애드센스 승인 전에는 API 자동 수집보다 직접 검증한 정보성 콘텐츠를 우선한다. API는 승인 이후 축제, 관광지, 이미지, 지도 좌표 업데이트를 효율화하기 위해 연결한다.

## Required Data Fields

### Festival

```txt
festival_name
region
address
start_date
end_date
official_url
phone
image_url
latitude
longitude
parking
public_transport
rain_policy
night_open
family_friendly
last_checked_at
source_name
source_url
editor_note
```

### Destination

```txt
place_name
region
category
address
overview
opening_hours
closed_days
fee
image_url
latitude
longitude
nearby_hotels_area
recommended_season
recommended_traveler
last_checked_at
source_url
```

### Hotel Area Guide

```txt
area_name
recommended_for
not_recommended_for
airport_access
public_transport
parking_difficulty
food_access
rainy_day_score
family_score
budget_range
editor_note
```

## API Candidates

### 1. 한국관광공사 TourAPI

Purpose:

- 관광지 기본 정보
- 행사/축제 정보
- 숙박, 음식점, 여행코스 기본 데이터
- 대표 이미지와 주소

Service to apply:

```txt
한국관광공사_국문 관광정보 서비스_GW
Base URL: https://apis.data.go.kr/B551011/KorService2
```

Useful endpoints:

```txt
/areaCode2
/areaBasedList2
/searchFestival2
/searchKeyword2
/detailCommon2
/detailIntro2
/detailImage2
```

Preparation:

1. 공공데이터포털 회원가입
2. 검색창에서 "한국관광공사_국문 관광정보 서비스_GW" 검색
3. OpenAPI 상세 페이지 진입
4. 활용신청 클릭
5. 개발계정 신청
6. 일반 인증키 발급
7. Decoding 인증키를 서버 환경변수에 저장

Environment variables:

```txt
TOUR_API_SERVICE_KEY=
TOUR_API_BASE_URL=https://apis.data.go.kr/B551011/KorService2
```

Example festival request shape:

```txt
GET /searchFestival2
?serviceKey=...
&MobileOS=ETC
&MobileApp=Tourpick360
&_type=json
&eventStartDate=20260601
&eventEndDate=20260630
&numOfRows=20
&pageNo=1
```

### 2. Kakao Maps or Naver Maps

Purpose:

- 주소를 좌표로 변환
- 지도 표시
- 주변 동선 판단

Kakao preparation:

1. Kakao Developers 가입
2. 내 애플리케이션 생성
3. 플랫폼에 `https://tourpick360.com` 등록
4. JavaScript 키와 REST API 키 확인

Environment variables:

```txt
KAKAO_JS_KEY=
KAKAO_REST_API_KEY=
```

Naver preparation:

1. 네이버 클라우드 플랫폼 가입
2. Maps API 신청
3. Web 서비스 URL 등록
4. Client ID, Client Secret 확인

Environment variables:

```txt
NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=
```

### 3. Google Search Console and Naver Search Advisor

Purpose:

- 사이트 소유권 확인
- sitemap 제출
- 색인 상태 확인

Preparation:

```txt
https://tourpick360.com/sitemap-index.xml
https://tourpick360.com/robots.txt
```

## Cloudflare Pages Build Settings

```txt
Framework: Astro
Build command: npm run build
Build output directory: dist
Node version: 24 or latest available LTS
```

## Before Connecting APIs

```txt
[x] 30개 이상 정보성 글 확보
[x] 축제 분류 페이지 초안 작성
[ ] 데이터 출처 표기 방식 확정
[x] 개인정보처리방침에 광고/쿠키 문구 포함
[ ] API 키를 클라이언트 코드에 직접 노출하지 않기
[ ] 자동 수집 데이터에 에디터 해설 추가
```
