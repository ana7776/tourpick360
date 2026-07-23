import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

const EXCLUDE = [
  '/404/',
  '/privacy/',
  '/terms/',
  '/disclosure/',
  '/editorial-policy/',
  '/contact/'
];

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, out);
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

function toUrlPath(filePath) {
  const rel = relative(DIST, filePath).split(sep).slice(0, -1).join('/');
  return rel ? `/${rel}/` : '/';
}

const files = await walk(DIST);
const records = [];

for (const file of files) {
  const url = toUrlPath(file);
  if (EXCLUDE.includes(url)) continue;

  const html = await readFile(file, 'utf8');

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i
  );

  let title = titleMatch ? decodeEntities(titleMatch[1]).trim() : '';
  title = title.replace(/\s*[-|]\s*Tourpick360\s*$/, '').trim();

  const description = descMatch ? decodeEntities(descMatch[1]).trim() : '';

  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  const bodyText = stripTags(mainMatch ? mainMatch[0] : html).slice(0, 1200);

  if (!title) continue;

  records.push({
    url,
    title,
    description,
    text: bodyText
  });
}

records.sort((a, b) => a.url.localeCompare(b.url));

await writeFile(
  join(DIST, 'search-index.json'),
  JSON.stringify(records),
  'utf8'
);

const bytes = (await stat(join(DIST, 'search-index.json'))).size;
console.log(
  `[search-index] ${records.length}개 페이지 색인 생성 완료 (${Math.round(bytes / 1024)}KB)`
);
