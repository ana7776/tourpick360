import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const requiredFiles = ['robots.txt', 'sitemap-index.xml', 'rss.xml', 'ads.txt'];
const requiredFooterLinks = ['/about/', '/editorial-policy/', '/contact/', '/privacy/', '/terms/', '/disclosure/'];
const adsenseClientId = 'ca-pub-5804969457082424';
const adsTxtSellerLine = 'google.com, pub-5804969457082424, DIRECT, f08c47fec0942fa0';
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

function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
}

function strippedText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function imageTags(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
}

function attributeValue(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? '';
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
    const headings = headingLevels(html);
    const text = strippedText(html);
    const wordCount = text ? text.split(/\s+/).length : 0;
    const images = imageTags(html);

    if (h1Count !== 1) failures.push(`${relative}: expected exactly one H1, found ${h1Count}`);
    for (let index = 1; index < headings.length; index += 1) {
      if (headings[index] - headings[index - 1] > 1) {
        failures.push(`${relative}: heading hierarchy jumps from H${headings[index - 1]} to H${headings[index]}`);
        break;
      }
    }
    if (!title || title.length < 10) failures.push(`${relative}: missing or too-short title`);
    if (!description || description.length < 50) failures.push(`${relative}: missing or too-short meta description`);
    if (!canonical?.startsWith('https://tourpick360.com/')) failures.push(`${relative}: missing canonical URL`);
    for (const [index, tag] of images.entries()) {
      if (!attributeValue(tag, 'alt')) {
        warnings.push(`${relative}: image ${index + 1} is missing useful alt text.`);
      }
    }
    if (/<article\b/i.test(html) && !images.length && !/^(about|contact|disclosure|editorial-policy|privacy|terms)(\/|$)/.test(relative)) {
      warnings.push(`${relative}: article page has no image. Add at least one relevant visual asset when practical.`);
    }
    if (!html.includes(`<meta name="google-adsense-account" content="${adsenseClientId}"`)) {
      failures.push(`${relative}: missing google-adsense-account meta tag`);
    }
    if (!html.includes(`adsbygoogle.js?client=${adsenseClientId}`)) {
      failures.push(`${relative}: missing AdSense script`);
    }
    if (
      wordCount < 250 &&
      !/^(404\.html|about|contact|disclosure|editorial-policy|privacy|terms|en|es|ja|zh-CN)(\/|$)/.test(relative)
    ) {
      warnings.push(`${relative}: short visible body (${wordCount} words). Consider expanding or noindexing before AdSense review.`);
    }
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

  const adsTxt = existsSync(path.join(distDir, 'ads.txt'))
    ? readFileSync(path.join(distDir, 'ads.txt'), 'utf8')
    : '';
  if (!adsTxt.includes(adsTxtSellerLine)) {
    failures.push('ads.txt does not include the expected Google seller line');
  }
}

if (warnings.length) {
  console.warn(`SEO warnings:\n- ${warnings.join('\n- ')}`);
}

if (failures.length) {
  console.error(`SEO check failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('SEO check passed: semantic headings, meta tags, AdSense signals, required files, footer links, robots, and non-numeric URLs look good.');
