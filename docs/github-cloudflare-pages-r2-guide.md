# Tourpick360 GitHub, Cloudflare Pages, R2 Guide

## Target Architecture

```txt
Local Astro source
  -> GitHub main branch
  -> Cloudflare Pages build
  -> Cloudflare global edge

Remote image URL
  -> scripts/r2-image-pipeline.mjs
  -> sharp WebP quality 80
  -> Cloudflare R2 bucket
  -> public image URL for posts
```

## Initial Directory Structure

```txt
tourpick360/
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
    check-seo-build.mjs
    r2-image-pipeline.mjs
    fetch-tourapi-images.mjs
  docs/
    github-cloudflare-pages-r2-guide.md
```

## SEO and AdSense Checklist

- Use one `<h1>` per page and keep `<h2>` and `<h3>` in logical order.
- Use readable slug URLs such as `/domestic/jeju/family-hotel-area-guide/`, not numeric IDs.
- Keep empty categories out of navigation until they have enough text content.
- Keep the footer links to `/privacy/` and `/contact/` visible on every page.
- Submit `https://tourpick360.com/sitemap-index.xml` to Google Search Console and Naver Search Advisor.
- Keep `robots.txt` open to Googlebot and Naver bot, and include the sitemap URL.
- Before AdSense review, aim for at least 20-30 useful articles with original text, clear author/editorial policy, and no broken pages.

## GitHub Setup

```bash
git init
git branch -M main
git add .
git commit -m "Initial Astro SEO blog"
git remote add origin https://github.com/YOUR_ID/tourpick360.git
git push -u origin main
```

## Cloudflare Pages Setup

1. Cloudflare Dashboard -> Workers & Pages -> Create application -> Pages.
2. Connect to GitHub and select the `tourpick360` repository.
3. Production branch: `main`.
4. Framework preset: `Astro`.
5. Build command: `npm run build`.
6. Build output directory: `dist`.
7. Save and deploy.

After this, every push to `main` triggers an automatic Cloudflare Pages build and global deployment.

## Cloudflare R2 Setup

Create an R2 bucket, then create an R2 API token with object read/write permission for that bucket.

Required environment variables:

```bash
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET=tourpick360-images
R2_PUBLIC_BASE_URL=https://images.tourpick360.com
```

Run the image pipeline:

```bash
npm.cmd run images:r2 -- --url "https://example.com/source.jpg" --prefix "posts/jeju-family-hotel-area-guide" --name "hero"
```

The script returns JSON with the final public WebP URL. Use that URL in article hero images and body images.

## Local Verification

```bash
npm.cmd install
npm.cmd run check:seo
```

`check:seo` builds the Astro site, verifies SEO-critical generated files, checks one H1 per HTML page, confirms required footer links, and flags numeric URL paths.
