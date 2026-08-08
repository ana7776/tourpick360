import { jejuHotelAreaGuide } from './jejuHotelAreaGuide.js';

export const jejuApprovalArticles = [jejuHotelAreaGuide];

export const allJejuArticles = [
  {
    title: '제주 가족여행 숙소 지역별 선택 기준',
    href: '/domestic/jeju/family-hotel-area-guide/',
    category: '제주 숙소',
    summary: '공항권, 애월, 중문, 성산의 장단점을 가족 여행 기준으로 비교합니다.'
  },
  {
    title: '제주 2박 3일 렌터카 동선 기본안',
    href: '/domestic/jeju/2n3d-rental-car-itinerary/',
    category: '제주 코스',
    summary: '첫 제주 여행자가 무리 없이 따라갈 수 있는 2박 3일 동선입니다.'
  },
  ...jejuApprovalArticles.map((article) => ({
    title: article.title,
    href: `/domestic/jeju/${article.slug}/`,
    category: article.category,
    summary: article.description
  }))
];
