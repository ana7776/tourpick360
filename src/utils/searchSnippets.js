const SITE_NAME = 'Tourpick360';

const titleRules = [
  {
    test: (article) => /취소|환불|규정|cancellation/.test(`${article.slug} ${article.title} ${article.description}`),
    suffix: '취소·환불 체크'
  },
  {
    test: (article) => /group-trip-review|당일|후기/.test(`${article.slug} ${article.title}`),
    suffix: '일정·비용·사진'
  },
  {
    test: (article) => /숙소|hotel|resort/.test(`${article.slug} ${article.title} ${article.description}`),
    suffix: '위치 추천 기준'
  },
  {
    test: (article) => /주차|parking/.test(`${article.slug} ${article.title} ${article.description}`),
    suffix: '주차·동선 해결'
  },
  {
    test: (article) => /비|rainy|indoor/.test(`${article.slug} ${article.title} ${article.description}`),
    suffix: '비 오는 날 대안'
  },
  {
    test: (article) => /예산|budget|정산/.test(`${article.slug} ${article.title} ${article.description}`),
    suffix: '예산표·줄이는 순서'
  },
  {
    test: (article) => /렌터카|rental/.test(`${article.slug} ${article.title} ${article.description}`),
    suffix: '반납·주유 체크'
  }
];

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

export const buildSearchTitle = (article, fallbackSuffix = '여행 가이드') => {
  const baseTitle = compact(article.title);
  const rule = titleRules.find(({ test }) => test(article));
  const suffix = rule?.suffix ?? fallbackSuffix;
  const titleWithBenefit = baseTitle.includes(suffix) ? baseTitle : `${baseTitle} | ${suffix}`;

  return trimTo(`${titleWithBenefit} - ${SITE_NAME}`, 68);
};

export const buildSearchDescription = (article) => {
  const baseDescription = compact(article.description || article.intro);
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
