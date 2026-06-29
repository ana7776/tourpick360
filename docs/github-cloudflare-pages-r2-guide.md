# Tourpick360 GitHub, Cloudflare Pages, R2 자동화 가이드

## 목표 아키텍처

```txt
로컬 Astro 소스
  -> GitHub main 브랜치 push
  -> Cloudflare Pages 자동 빌드
  -> Cloudflare 글로벌 엣지 배포

외부 이미지 URL
  -> Node.js 스크립트가 이미지 다운로드
  -> sharp로 WebP 변환 및 quality 80 압축
  -> AWS SDK S3 호환 API로 Cloudflare R2 업로드
  -> 게시글에서 사용할 최종 공개 이미지 URL 반환
```

## 초기 디렉토리 구조

```txt
tourpick360/
  .env.example
  .gitignore
  astro.config.mjs
  package.json
  public/
    robots.txt
    ads.txt
    _headers
    _redirects
    images/
  src/
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      privacy.astro
      contact.astro
      rss.xml.js
      domestic/
      travel-tips/
      case-studies/
      templates/
      tools/
    components/
    data/
  scripts/
    r2-image-pipeline.mjs
    check-seo-build.mjs
    fetch-tourapi-images.mjs
  docs/
    github-cloudflare-pages-r2-guide.md
```

## 필수 패키지

현재 프로젝트 기준 `package.json`에 아래 의존성이 있어야 합니다.

```json
{
  "type": "module",
  "scripts": {
    "build": "astro build",
    "images:r2": "node scripts/r2-image-pipeline.mjs",
    "cf:deploy": "npm run build && wrangler pages deploy dist --project-name=tourpick360 --branch=main"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.716.0",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "wrangler": "^4.98.0"
  }
}
```

## GitHub 연동

```bash
git init
git branch -M main
git add .
git commit -m "Initial Astro SEO blog"
git remote add origin https://github.com/YOUR_ID/tourpick360.git
git push -u origin main
```

이후 로컬 변경사항은 아래 흐름으로 배포합니다.

```bash
git add .
git commit -m "Update site"
git push origin main
```

`main` 브랜치에 push되면 Cloudflare Pages가 GitHub 웹훅을 받아 자동으로 빌드와 배포를 시작합니다.

## Cloudflare Pages 설정

1. Cloudflare Dashboard -> Workers & Pages -> Create application -> Pages로 이동합니다.
2. GitHub 계정을 연결하고 `tourpick360` 저장소를 선택합니다.
3. Production branch는 `main`으로 설정합니다.
4. Framework preset은 `Astro`를 선택합니다.
5. Build command는 `npm run build`로 설정합니다.
6. Build output directory는 `dist`로 설정합니다.
7. Save and Deploy를 누릅니다.

Cloudflare Pages 배포 환경 변수에는 사이트 빌드에 필요한 공개 값만 넣습니다. R2 업로드 키처럼 민감한 값은 로컬 `.env` 또는 별도 CI secret으로 관리합니다.

## Cloudflare R2 설정

1. Cloudflare Dashboard -> R2 -> Create bucket에서 `tourpick360-images` 버킷을 생성합니다.
2. R2 -> Manage R2 API Tokens에서 Object Read & Write 권한의 토큰을 생성합니다.
3. R2 버킷 공개 접근을 설정하거나, 커스텀 도메인 예: `https://images.tourpick360.com`을 연결합니다.
4. 로컬 `.env` 파일에 아래 값을 저장합니다.

`.env.example`

```bash
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET=tourpick360-images
R2_PUBLIC_BASE_URL=https://images.tourpick360.com
```

`.env`는 절대 Git에 커밋하지 않습니다. 현재 `.gitignore`에 `.env`가 포함되어 있어야 합니다.

## R2 이미지 업로드 자동화 실행

```bash
npm.cmd run images:r2 -- --url "https://example.com/source.jpg" --prefix "posts/jeju-family-hotel-area-guide" --name "hero"
```

반환 예시:

```json
{
  "url": "https://images.tourpick360.com/posts/jeju-family-hotel-area-guide/hero-abc123def456.webp",
  "key": "posts/jeju-family-hotel-area-guide/hero-abc123def456.webp",
  "source": "https://example.com/source.jpg",
  "width": 2400,
  "height": 1600,
  "format": "webp",
  "quality": 80
}
```

로컬 변환 파일을 확인하고 싶으면 `--keep-local`을 추가합니다.

```bash
npm.cmd run images:r2 -- --url "https://example.com/source.jpg" --prefix "posts/sample" --name "hero" --keep-local
```

업로드된 WebP URL은 Astro 페이지나 Markdown/MDX 콘텐츠에서 이미지 주소로 사용합니다.

## 로컬 검증

```bash
npm.cmd install
npm.cmd run check:seo
```

`check:seo`는 Astro 빌드를 수행하고 SEO 관련 생성 파일, H1 개수, 필수 푸터 링크, 숫자형 URL 경로 등을 점검합니다.

## SEO와 AdSense 기본 체크리스트

- 페이지마다 `<h1>`은 하나만 사용하고 `<h2>`, `<h3>` 계층을 자연스럽게 유지합니다.
- `/domestic/jeju/family-hotel-area-guide/`처럼 읽을 수 있는 slug URL을 사용합니다.
- 내용이 부족한 빈 카테고리는 내비게이션에 노출하지 않습니다.
- 모든 페이지 하단에 `/privacy/`, `/contact/` 링크를 유지합니다.
- `https://tourpick360.com/sitemap-index.xml`을 Google Search Console과 Naver Search Advisor에 제출합니다.
- `robots.txt`는 Googlebot과 Naver bot을 허용하고 sitemap URL을 포함합니다.
- AdSense 심사 전에는 원문성이 있는 글, 명확한 운영자 정보, 깨진 페이지 없는 구조를 우선 확보합니다.
