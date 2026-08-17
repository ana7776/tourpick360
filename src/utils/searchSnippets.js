const SITE_NAME = 'Tourpick360';

// 검색결과 제목은 글자 수가 아니라 픽셀 폭으로 잘린다. 한글과 전각 기호는
// 라틴 문자의 약 두 배 폭을 차지하므로 폭 단위로 계산해야 실제 노출 길이와 맞는다.
const WIDE_CHAR = /[ᄀ-ᇿ㄰-㆏가-힯⺀-鿿　-〿！-｠]/;

// 데스크톱 검색결과 제목 영역이 대략 이 폭에서 잘린다. 한글 기준 33자 정도다.
const TITLE_WIDTH_BUDGET = 66;

// 사이트명은 제목 맨 뒤에 오기 때문에 폭이 모자라면 가장 먼저 잘려 나간다.
// 잘린 사이트명은 읽는 사람에게 아무 정보도 주지 못하므로, 남는 폭이 있을 때만 붙인다.
const BRAND_SUFFIX = ` - ${SITE_NAME}`;

// 설명문이 검색결과에 보이는 구간도 비슷하게 폭으로 결정된다. 한글 기준 80자 정도다.
const DESCRIPTION_WIDTH_BUDGET = 160;

const descriptionRules = [
  {
    test: (article) => /숙소|hotel|resort/.test(`${article.slug} ${article.title} ${article.description}`),
    extra: '숙소 권역, 이동 시간, 식사 접근성, 주차 기준을 한 번에 비교합니다.'
  },
  {
    test: (article) => /축제|festival|여행/.test(`${article.slug} ${article.title} ${article.description}`),
    extra: '방문 전 확인할 일정, 동선, 비용, 대체 코스까지 정리했습니다.'
  },
  {
    test: (article) => /문제|해결|취소|만차|비/.test(`${article.slug} ${article.title} ${article.description}`),
    extra: '문제 상황별 판단 기준과 바로 바꿀 수 있는 일정 순서를 안내합니다.'
  }
];

const compact = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

const trimTo = (value, maxLength) => {
  const text = compact(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
};

const displayWidth = (text) =>
  [...text].reduce((total, char) => total + (WIDE_CHAR.test(char) ? 2 : 1), 0);

export const buildSearchTitle = (article) => {
  const baseTitle = compact(article.title);

  return displayWidth(baseTitle + BRAND_SUFFIX) <= TITLE_WIDTH_BUDGET
    ? baseTitle + BRAND_SUFFIX
    : baseTitle;
};

export const buildSearchDescription = (article) => {
  const baseDescription = compact(article.description || article.intro);

  // 설명문도 폭 기준으로 잘리므로, 이미 노출 구간을 채운 글에 범용 문장을 덧붙이면
  // 잘려서 보이지도 않고 글마다 같은 문장이 반복될 뿐이다. 여유가 있을 때만 붙인다.
  if (displayWidth(baseDescription) >= DESCRIPTION_WIDTH_BUDGET) {
    return trimTo(baseDescription, 155);
  }

  const rule = descriptionRules.find(({ test }) => test(article));
  const withBenefit = rule && !baseDescription.includes(rule.extra)
    ? `${baseDescription} ${rule.extra}`
    : baseDescription;

  return trimTo(withBenefit, 155);
};

export const buildBreadcrumbJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const buildFaqJsonLd = (faqs) => {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const mainEntity = faqs
    .map((faq) => {
      const [question, answer] = Array.isArray(faq) ? faq : [faq.question, faq.answer];
      if (!question || !answer) return null;

      return {
        '@type': 'Question',
        name: compact(question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: compact(answer)
        }
      };
    })
    .filter(Boolean)
    .slice(0, 6);

  if (mainEntity.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  };
};
