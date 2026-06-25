import { allJejuArticles } from '../data/jejuApprovalArticles.js';
import { allFestivalArticles } from '../data/festivalApprovalArticles.js';
import { allProblemSolvingArticles } from '../data/problemSolvingArticles.js';

const site = 'https://tourpick360.com';

const staticItems = [
  {
    title: '국내여행 지역별 계절별 가이드',
    href: '/domestic/',
    description: '국내 여행지를 지역별, 계절별, 축제 기준으로 나누어 정리한 Tourpick360 국내여행 허브입니다.'
  },
  {
    title: '숙소 예약 전 확인해야 할 12가지',
    href: '/travel-tips/hotel-booking-checklist/',
    description: '숙소 예약 전 위치, 취소 조건, 주차, 조식, 객실 타입을 점검하는 체크리스트입니다.'
  },
  {
    title: '렌터카 예약 전 확인해야 할 10가지',
    href: '/travel-tips/rental-car-checklist/',
    description: '렌터카 예약 전 보험, 인수 위치, 반납 시간, 주차 동선을 확인하는 체크리스트입니다.'
  },
  {
    title: '국내여행 예산표 짜는 법',
    href: '/travel-tips/travel-budget-plan/',
    description: '국내여행 예산을 숙소, 교통, 식비, 입장료, 예비비로 나누어 계산하는 실전 체크리스트입니다.'
  },
  {
    title: '비 오는 날 대체 일정 준비법',
    href: '/travel-tips/rainy-day-backup-plan/',
    description: '국내여행에서 비가 올 때 숙소 위치, 실내 코스, 이동 방식, 취소 조건을 기준으로 대체 일정을 준비하는 방법입니다.'
  },
  {
    title: '늦은 체크인 일정 해결법',
    href: '/travel-tips/late-checkin-plan/',
    description: '저녁 도착, 늦은 체크인, 다음 날 이동이 있는 국내여행에서 숙소와 첫날 일정을 조정하는 방법입니다.'
  },
  {
    title: '아이 동반 여행 피로 줄이는 법',
    href: '/travel-tips/child-travel-fatigue-solution/',
    description: '아이와 함께 국내여행을 갈 때 이동 피로, 식사 시간, 숙소 위치를 기준으로 일정을 줄이는 방법입니다.'
  },
  {
    title: '무리한 여행 일정 Before / After 사례',
    href: '/travel-tips/itinerary-before-after/',
    description: '국내여행에서 이동이 많은 일정을 숙소 권역과 핵심 코스 중심으로 개선하는 Before / After 사례입니다.'
  },
  {
    title: '여행 템플릿 라이브러리',
    href: '/templates/',
    description: '국내여행 일정표, 가족여행 계획, 비 오는 날 대체 일정에 사용할 수 있는 템플릿 모음입니다.'
  },
  {
    title: '가족여행 일정표 템플릿',
    href: '/templates/family-trip-plan-template/',
    description: '가족 국내여행을 준비할 때 숙소, 이동, 식사, 휴식 시간을 정리하는 일정표 템플릿입니다.'
  },
  {
    title: '비 오는 날 대체 일정 템플릿',
    href: '/templates/rainy-day-itinerary-template/',
    description: '비 예보가 있는 국내여행에서 야외 코스를 실내 코스로 바꾸는 대체 일정 템플릿입니다.'
  },
  {
    title: '여행 일정 기본 vs 개선 버전 비교 도구',
    href: '/tools/itinerary-comparison/',
    description: '여행 유형을 선택하면 기본 일정과 개선 일정을 비교하고 추천 이유를 확인할 수 있는 Tourpick360 도구입니다.'
  },
  {
    title: '여행 Before / After 사례',
    href: '/case-studies/',
    description: '국내여행 일정, 숙소 위치, 날씨 대응을 Before / After 방식으로 개선하는 사례 모음입니다.'
  },
  {
    title: '부산 가족여행 숙소 동선 Before / After',
    href: '/case-studies/busan-family-route-before-after/',
    description: '부산 가족여행에서 여러 권역을 모두 넣은 일정을 숙소 권역 중심으로 개선하는 사례입니다.'
  },
  {
    title: '제주 비 오는 날 일정 Before / After',
    href: '/case-studies/jeju-rainy-day-before-after/',
    description: '제주 여행에서 비가 올 때 야외 중심 일정을 실내 대체 코스와 숙소 주변 동선으로 바꾸는 사례입니다.'
  },
  {
    title: '강릉 1박 2일 일정 Before / After',
    href: '/case-studies/gangneung-weekend-before-after/',
    description: '강릉 KTX 주말여행에서 이동이 많은 일정을 강릉역, 경포, 안목 중심으로 줄이는 Before / After 사례입니다.'
  },
  {
    title: '전주 한옥마을 주차 동선 Before / After',
    href: '/case-studies/jeonju-parking-route-before-after/',
    description: '전주 한옥마을 공영주차장이 만차일 때 식사, 대체 주차장, 도보 루트를 바꾸는 Before / After 사례입니다.'
  },
  {
    title: '경주 도보 여행 동선 Before / After',
    href: '/case-studies/gyeongju-walking-route-before-after/',
    description: '경주 대릉원, 첨성대, 황리단길을 부모님 동반 여행 기준으로 줄이는 Before / After 사례입니다.'
  },
  {
    title: '제주 렌터카 반납일 Before / After',
    href: '/case-studies/jeju-rental-return-before-after/',
    description: '제주 여행 마지막 날 렌터카 반납, 주유, 공항권 식사, 마지막 관광지를 조정하는 Before / After 사례입니다.'
  },
  {
    title: '차 없는 국내여행 숙소 위치 Before / After',
    href: '/case-studies/no-car-hotel-area-before-after/',
    description: '대중교통 국내여행에서 관광지 가까운 숙소보다 역, 식사, 짐 보관 기준으로 숙소를 고르는 Before / After 사례입니다.'
  },
  {
    title: '국내여행 예산표 템플릿',
    href: '/templates/travel-budget-template/',
    description: '숙소, 교통, 식비, 관광비, 예비비를 나누어 국내여행 예산을 계산하는 템플릿입니다.'
  },
  {
    title: '숙소 비교표 템플릿',
    href: '/templates/hotel-comparison-template/',
    description: '국내여행 숙소를 위치, 이동 시간, 취소 조건, 주차, 조식 기준으로 비교하는 템플릿입니다.'
  },
  {
    title: '전주 한옥마을 여행 코스와 주차 동선 가이드',
    href: '/domestic/jeonju/hanok-village-walking-guide/',
    description: '전주 한옥마을을 처음 방문하는 여행자를 위해 경기전, 전동성당, 오목대, 남부시장 동선과 주차, 시간대, 숙소 위치 기준을 정리합니다.'
  },
  {
    title: '부산 가족여행 숙소 권역 고르는 법',
    href: '/domestic/busan/family-hotel-area-guide/',
    description: '부산 가족여행에서 해운대, 광안리, 부산역 권역을 숙소 위치, 대중교통, 식사 접근성 기준으로 비교합니다.'
  },
  {
    title: '강릉 KTX 주말여행 동선과 숙소 위치',
    href: '/domestic/gangneung/ktx-weekend-trip-guide/',
    description: '강릉 KTX 주말여행에서 강릉역, 경포, 안목 권역을 1박 2일 이동 피로도와 숙소 위치 기준으로 정리합니다.'
  },
  {
    title: '서울 비 오는 날 실내 여행 코스와 숙소 권역 고르는 법',
    href: '/domestic/seoul/rainy-day-indoor-route-guide/',
    description: '서울 여행 중 비 예보가 있을 때 종로, 용산, 잠실, 성수, 강남 권역을 기준으로 실내 코스, 숙소 위치, 주차, 예산, 동행 유형별 동선을 조정하는 방법입니다.'
  },
  {
    title: 'Tourpick360 편집 기준',
    href: '/editorial-policy/',
    description: 'Tourpick360의 여행 정보 작성 원칙, 검증 방식, 수정 기준을 안내합니다.'
  }
];

const items = [
  ...staticItems,
  {
    title: '국내 축제 여행 가이드',
    href: '/domestic/festivals/',
    description: '국내 계절 축제 여행에서 숙소 위치, 주차, 이동 동선, 예산, 가족 동반 기준을 정리합니다.'
  },
  ...allProblemSolvingArticles.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.description
  })),
  ...allFestivalArticles.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.description
  })),
  ...allJejuArticles.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.summary
  }))
];
const publishDate = new Date();

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function GET() {
  const pubDate = publishDate.toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tourpick360</title>
    <link>${site}</link>
    <description>국내 계절 축제 여행 가이드</description>
    <language>ko-KR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    ${items.map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${site}${item.href}</link>
      <guid>${site}${item.href}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
