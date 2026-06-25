# Cloudflare Pages Connection Guide

## Current Project

```txt
Project name: tourpick360
Domain: tourpick360.com
Build output: dist
Deploy method: Cloudflare Pages Direct Upload
```

Direct Upload is recommended for this computer because Git is not currently available in the local shell.

## Local Commands

### 1. Build

```bash
npm.cmd run build
```

### 2. Login

브라우저가 열리면 사용자가 직접 Cloudflare 계정으로 로그인한다.

```bash
npm.cmd run cf:login
```

### 3. Create Pages Project

처음 한 번만 실행한다.

```bash
npm.cmd run cf:create
```

If the project already exists, skip this step.

### 4. Deploy

```bash
npm.cmd run cf:deploy
```

Deployment output should provide a `*.pages.dev` URL.

## Dashboard Drag and Drop Alternative

Wrangler 로그인이 번거롭다면 다음 방식도 가능하다.

1. `npm.cmd run build`
2. Cloudflare dashboard 접속
3. Workers & Pages
4. Create application
5. Pages
6. Drag and drop
7. Project name: `tourpick360`
8. `dist` 폴더를 업로드

주의: 업로드 대상은 프로젝트 루트가 아니라 `dist` 폴더다.

## Custom Domain Setup

Cloudflare Pages 프로젝트가 생성된 뒤:

1. Cloudflare dashboard에서 `tourpick360.com` zone 추가
2. Cloudflare가 제시하는 nameserver 2개 확인
3. 가비아 도메인 관리에서 nameserver를 Cloudflare 값으로 변경
4. Workers & Pages > `tourpick360` > Custom domains
5. `tourpick360.com` 추가
6. `www.tourpick360.com` 추가
7. 대표 도메인을 하나로 정하고 나머지는 redirect 처리

Recommended canonical:

```txt
https://tourpick360.com
```

## After Domain Is Active

Check:

```txt
https://tourpick360.com
https://tourpick360.com/robots.txt
https://tourpick360.com/sitemap-index.xml
https://tourpick360.com/rss.xml
```

## Google Search Console

1. Google Search Console 접속
2. Domain property로 `tourpick360.com` 등록
3. Cloudflare DNS에 TXT record 추가
4. 소유권 확인
5. sitemap 제출:

```txt
https://tourpick360.com/sitemap-index.xml
```

6. 주요 URL 색인 요청:

```txt
https://tourpick360.com/
https://tourpick360.com/domestic/
https://tourpick360.com/domestic/jeju/
```

## Naver Search Advisor

1. 네이버 서치어드바이저 접속
2. 사이트 등록
3. 소유 확인
4. robots.txt 확인
5. sitemap 제출:

```txt
https://tourpick360.com/sitemap-index.xml
```

## Important Before AdSense

Do not apply immediately after deployment.

Wait until:

```txt
[x] 최소 20개 이상 정보성 글
[x] 가능하면 30개 이상
[ ] Google 색인 확인
[x] 필수 페이지 정상
[x] sitemap 정상
[x] robots.txt 정상
[ ] 모바일 화면 정상
```
