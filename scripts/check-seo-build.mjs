import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const requiredFiles = ['robots.txt', 'sitemap-index.xml', 'rss.xml', 'ads.txt'];
const requiredFooterLinks = ['/privacy/', '/contact/'];
const failures = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    return statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function readHtml(file) {
  return readFileSync(file, 'utf8');
}

if (!existsSync(distDir)) {
  failures.push('dist directory does not exist. Run npm.cmd run build first.');
} else {
  for (const file of requiredFiles) {
    if (!existsSync(path.join(distDir, file))) {
      failures.push(`Missing required output: dist/${file}`);
    }
  }

  const htmlFiles = walk(distDir).filter((file) => {
    const relative = path.relative(distDir, file).replaceAll('\\', '/');
    return file.endsWith('.html') && !/^naver[a-z0-9]+\.html$/i.test(relative);
  });
  if (htmlFiles.length < 20) {
    warnings.push(`Only ${htmlFiles.length} HTML pages found. AdSense approval is easier with 20-30 substantial indexed pages.`);
  }

  for (const file of htmlFiles) {
    const html = readHtml(file);
    const relative = path.relative(distDir, file).replaceAll('\\', '/');
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim();
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]?.trim();

    if (h1Count !== 1) failures.push(`${relative}: expected exactly one H1, found ${h1Count}`);
    if (!title || title.length < 10) failures.push(`${relative}: missing or too-short title`);
    if (!description || description.length < 50) failures.push(`${relative}: missing or too-short meta description`);
    if (!canonical?.startsWith('https://tourpick360.com/')) failures.push(`${relative}: missing canonical URL`);
  }

  const homeHtml = readHtml(path.join(distDir, 'index.html'));
  for (const href of requiredFooterLinks) {
    if (!homeHtml.includes(`href="${href}"`)) {
      failures.push(`Home footer is missing required link: ${href}`);
    }
  }

  const badNumericPostUrls = htmlFiles
    .map((file) => path.relative(distDir, file).replaceAll('\\', '/'))
    .filter((relative) => /(^|\/)\d+\/index\.html$/.test(relative));
  if (badNumericPostUrls.length) {
    failures.push(`Numeric URL paths found: ${badNumericPostUrls.join(', ')}`);
  }

  const robots = existsSync(path.join(distDir, 'robots.txt'))
    ? readFileSync(path.join(distDir, 'robots.txt'), 'utf8')
    : '';
  if (!robots.includes('Sitemap: https://tourpick360.com/sitemap-index.xml')) {
    failures.push('robots.txt does not reference sitemap-index.xml');
  }
}

if (warnings.length) {
  console.warn(`SEO warnings:\n- ${warnings.join('\n- ')}`);
}

if (failures.length) {
  console.error(`SEO check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('SEO check passed: semantic H1 count, meta tags, required files, footer links, robots, and non-numeric URLs look good.');
