import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const envPath = path.join(root, '.env');
const outDir = path.join(root, 'public', 'images', 'tourapi');
const dataFile = path.join(root, 'src', 'data', 'tourApiImages.js');
const attributionFile = path.join(outDir, 'ATTRIBUTION.json');

const targets = [
  { key: 'seoul', keywords: ['경복궁', '서울 경복궁'], requiredTitle: ['경복궁'] },
  { key: 'busan', keywords: ['해운대해수욕장', '부산 해운대'], requiredTitle: ['해운대'] },
  { key: 'busan_centum', keywords: ['부산 영화의전당', '센텀시티'], requiredTitle: ['영화의전당', '센텀'] },
  { key: 'gangneung', keywords: ['안목해변', '강릉 안목해변', '경포해변', '강문해변', '강릉 커피거리'], requiredTitle: ['안목', '경포', '강문', '커피'] },
  { key: 'gyeongju', keywords: ['대릉원', '경주 대릉원'], requiredTitle: ['대릉원'] },
  { key: 'jeonju', keywords: ['전주 한옥마을'], requiredTitle: ['한옥마을'] },
  { key: 'yeosu', keywords: ['돌산대교', '여수 돌산대교', '여수 밤바다'], requiredTitle: ['돌산', '대교'] },
  { key: 'jeju', keywords: ['성산일출봉', '제주 성산일출봉'], requiredTitle: ['성산'] },
  { key: 'jeju_yongduam', keywords: ['제주 용두암', '용두암'], requiredTitle: ['용두암'] },
  { key: 'jeju_jungmun', keywords: ['천제연폭포', '제주 중문관광단지'], requiredTitle: ['천제연', '중문'] },
  { key: 'jeju_aewol', keywords: ['애월한담해안산책로', '한담해안산책로', '애월해안도로'], requiredTitle: ['한담', '애월'] },
  { key: 'jeju_indoor', keywords: ['제주 아르떼뮤지엄', '제주민속촌', '제주 항공우주박물관'], requiredTitle: ['뮤지엄', '민속촌', '박물관'] },
  { key: 'museum', keywords: ['국립중앙박물관', '서울 국립중앙박물관'], requiredTitle: ['국립중앙박물관'] },
  { key: 'family_trip', keywords: ['서울숲', '어린이대공원', '올림픽공원'], requiredTitle: ['서울숲', '어린이대공원', '올림픽공원'] },
  { key: 'festival_spring', keywords: ['진해군항제', '여의도 봄꽃축제', '구례 산수유꽃축제'], requiredTitle: ['군항제', '봄꽃', '산수유'], contentTypeIds: [15, 12] },
  { key: 'festival_summer', keywords: ['보령머드축제', '부산바다축제', '해운대해수욕장'], requiredTitle: ['머드', '바다', '해운대'], contentTypeIds: [15, 12] },
  { key: 'festival_autumn', keywords: ['전주비빔밥축제', '남도음식문화큰잔치', '전주 한옥마을'], requiredTitle: ['비빔밥', '음식', '한옥마을'], contentTypeIds: [15, 12] },
  { key: 'festival_winter', keywords: ['아침고요수목원 오색별빛정원전', '서울 빛초롱축제', '해운대 빛축제'], requiredTitle: ['빛', '별빛', '수목원'], contentTypeIds: [15, 12] }
];

function parseEnv(text) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        if (index === -1) return [line, ''];
        return [line.slice(0, index), line.slice(index + 1).replace(/^["']|["']$/g, '')];
      })
  );
}

async function readEnv() {
  try {
    return parseEnv(await fs.readFile(envPath, 'utf8'));
  } catch {
    return {};
  }
}

function apiUrl(endpoint, params) {
  const url = new URL(`https://apis.data.go.kr/B551011/KorService2/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  return url;
}

function normalizeItems(payload) {
  const item = payload?.response?.body?.items?.item;
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

async function tourApi(endpoint, params, serviceKey) {
  const url = apiUrl(endpoint, {
    serviceKey,
    MobileOS: 'ETC',
    MobileApp: 'Tourpick360',
    _type: 'json',
    ...params
  });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${endpoint} failed: ${response.status}`);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${endpoint} returned non-JSON response: ${text.slice(0, 120)}`);
  }
}

async function findImage(target, serviceKey) {
  for (const keyword of target.keywords) {
    for (const contentTypeId of target.contentTypeIds || [12]) {
      const search = await tourApi('searchKeyword2', {
        keyword,
        contentTypeId,
        numOfRows: 10,
        pageNo: 1
      }, serviceKey);
      const candidates = normalizeItems(search)
        .filter((item) => item.firstimage || item.firstimage2)
        .map((item) => ({
          ...item,
          score: scoreCandidate(item, target)
        }))
        .sort((a, b) => b.score - a.score);
      const picked = candidates.find((item) => item.score > 0);
      if (!picked?.contentid) continue;

      const detail = await tourApi('detailImage2', {
        contentId: picked.contentid,
        imageYN: 'Y',
        subImageYN: 'Y',
        numOfRows: 10,
        pageNo: 1
      }, serviceKey);
      const common = await tourApi('detailCommon2', {
        contentId: picked.contentid,
        contentTypeId: picked.contenttypeid || contentTypeId,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        areacodeYN: 'Y',
        catcodeYN: 'Y',
        addrinfoYN: 'Y',
        mapinfoYN: 'Y',
        overviewYN: 'Y'
      }, serviceKey);
      const info = normalizeItems(common)[0] || {};
      const images = normalizeItems(detail).map((item) => item.originimgurl || item.imgname).filter(Boolean);
      return {
        title: picked.title,
        contentId: picked.contentid,
        contentTypeId: picked.contenttypeid || contentTypeId,
        address: [info.addr1 || picked.addr1, info.addr2 || picked.addr2].filter(Boolean).join(' '),
        tel: info.tel || '',
        mapx: info.mapx || picked.mapx || '',
        mapy: info.mapy || picked.mapy || '',
        overview: cleanOverview(info.overview || ''),
        sourceUrl: images[0] || picked.firstimage || picked.firstimage2
      };
    }
  }
  return null;
}

function cleanOverview(value) {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function scoreCandidate(item, target) {
  const title = String(item.title || '');
  const address = String(item.addr1 || '');
  const regionByKey = {
    seoul: '서울',
    busan: '부산',
    gangneung: '강릉',
    gyeongju: '경주',
    jeonju: '전주',
    yeosu: '여수',
    jeju: '제주'
  };
  let score = 0;
  for (const word of target.requiredTitle) {
    if (title.includes(word)) score += 10;
  }
  if (address.includes(regionByKey[target.key])) score += 1;
  if (item.firstimage) score += 1;
  return score;
}

async function fetchImageAsset(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`image download failed: ${response.status} ${url}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`not an image: ${contentType} ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const extension = extensionForImage(contentType, buffer, url);
  if (extension === 'jpg' || extension === 'png' || extension === 'webp') {
    return { buffer, extension };
  }
  try {
    return {
      buffer: await sharp(buffer).jpeg({ quality: 84, mozjpeg: true }).toBuffer(),
      extension: 'jpg'
    };
  } catch {
    return { buffer, extension };
  }
}

function extensionForImage(contentType, buffer, url) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'png';
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) return 'bmp';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('bmp')) return 'bmp';
  const match = new URL(url).pathname.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function removeStaleImages(key) {
  await Promise.all(
    ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'JPG', 'JPEG', 'PNG', 'BMP'].map(async (extension) => {
      try {
        await fs.unlink(path.join(outDir, `${key}.${extension}`));
      } catch {
        // Ignore missing generated files.
      }
    })
  );
}

async function main() {
  const env = await readEnv();
  const serviceKey = env.TOUR_API_SERVICE_KEY || env.TOUR_API_DECODING_KEY;
  if (!serviceKey) {
    throw new Error('Missing TOUR_API_SERVICE_KEY in .env. Add the 공공데이터포털 Decoding 인증키 first.');
  }

  await fs.mkdir(outDir, { recursive: true });
  const records = {};
  const attributions = [];

  for (const target of targets) {
    const image = await findImage(target, serviceKey);
    if (!image?.sourceUrl) {
      console.warn(`No image found for ${target.key}`);
      continue;
    }
    await removeStaleImages(target.key);
    const asset = await fetchImageAsset(image.sourceUrl);
    const { extension } = asset;
    const fileName = `${target.key}.${extension}`;
    const publicPath = `/images/tourapi/${fileName}`;
    await fs.writeFile(path.join(outDir, fileName), asset.buffer);
    records[target.key] = {
      src: publicPath,
      alt: `${image.title} 관광 사진`,
      caption: `${image.title} 사진: 한국관광공사 TourAPI`,
      title: image.title,
      contentId: image.contentId,
      contentTypeId: image.contentTypeId,
      address: image.address,
      tel: image.tel,
      mapx: image.mapx,
      mapy: image.mapy,
      overview: image.overview
    };
    attributions.push({
      key: target.key,
      title: image.title,
      contentId: image.contentId,
      contentTypeId: image.contentTypeId,
      address: image.address,
      source: '한국관광공사 TourAPI',
      originalUrl: image.sourceUrl,
      localPath: publicPath
    });
    console.log(`Saved ${target.key}: ${image.title}`);
  }

  await fs.writeFile(
    dataFile,
    `export const tourApiImages = ${JSON.stringify(records, null, 2)};\n\nexport function getTourApiImage(key, fallback) {\n  return tourApiImages[key] ?? fallback;\n}\n\nexport function pickTourApiImage(keys, fallback) {\n  for (const key of keys) {\n    if (tourApiImages[key]) return tourApiImages[key];\n  }\n  return fallback;\n}\n`,
    'utf8'
  );
  await fs.writeFile(attributionFile, `${JSON.stringify(attributions, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
