import {
  beautifulBicycleRoutes100,
  bicycleCategories,
  bicycleOfficialSource,
  bicyclePlannerSteps,
  bicycleRoutePicks,
  bicycleRouteRegions,
  nationalBicycleRouteGroups
} from '../../data/bicycleTravel.js';

export function GET() {
  return new Response(JSON.stringify({
    meta: {
      title: 'Tourpick360 자전거 여행길 카테고리 API',
      description: '공식 자전거길 안내를 여행자 관점으로 재분류한 카테고리, 추천 코스, 계획 단계를 제공합니다.',
      source: bicycleOfficialSource,
      licenseNote: '공식 페이지 원문을 복제하지 않고 Tourpick360의 여행 계획 기준으로 재구성한 데이터입니다.'
    },
    categories: bicycleCategories,
    beautifulRoutes100: beautifulBicycleRoutes100,
    routeRegions: bicycleRouteRegions,
    nationalRouteGroups: nationalBicycleRouteGroups,
    plannerSteps: bicyclePlannerSteps,
    routePicks: bicycleRoutePicks
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
