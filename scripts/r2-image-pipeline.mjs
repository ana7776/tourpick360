import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const requiredEnv = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET',
  'R2_PUBLIC_BASE_URL'
];

function requireConfig() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing R2 environment variables: ${missing.join(', ')}`);
  }
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s.-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function extensionFromContentType(contentType) {
  if (contentType?.includes('png')) return 'png';
  if (contentType?.includes('webp')) return 'webp';
  if (contentType?.includes('gif')) return 'gif';
  return 'jpg';
}

async function downloadImage(imageUrl, workDir) {
  const response = await fetch(imageUrl, {
    headers: {
      'user-agent': 'Tourpick360 image optimizer/1.0 (+https://tourpick360.com)'
    }
  });

  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`URL did not return an image content-type: ${contentType || 'unknown'}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 12);
  const sourcePath = path.join(workDir, `source-${hash}.${extensionFromContentType(contentType)}`);
  await writeFile(sourcePath, buffer);
  return { sourcePath, hash };
}

async function optimizeToWebp(sourcePath, outputPath) {
  const image = sharp(sourcePath, { animated: false }).rotate();
  const metadata = await image.metadata();

  await image
    .resize({
      width: 1600,
      withoutEnlargement: true
    })
    .webp({
      quality: 80,
      effort: 5
    })
    .toFile(outputPath);

  return metadata;
}

async function uploadToR2({ filePath, key }) {
  const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  });

  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: await readFile(filePath),
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable'
  }));

  return `${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`;
}

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value.startsWith('--')) {
      args.set(value.slice(2), argv[index + 1]);
      index += 1;
    }
  }
  return args;
}

async function main() {
  requireConfig();

  const args = parseArgs(process.argv.slice(2));
  const imageUrl = args.get('url');
  if (!imageUrl) {
    throw new Error('Usage: npm.cmd run images:r2 -- --url "https://example.com/image.jpg" --prefix posts/post-title --name hero');
  }

  const prefix = slugify(args.get('prefix') ?? 'uploads');
  const requestedName = slugify(args.get('name') ?? path.basename(new URL(imageUrl).pathname, path.extname(new URL(imageUrl).pathname)) ?? 'image');
  const workDir = path.join(process.cwd(), '.tmp', 'r2-images');

  await mkdir(workDir, { recursive: true });
  const { sourcePath, hash } = await downloadImage(imageUrl, workDir);
  const webpName = `${requestedName || 'image'}-${hash}.webp`;
  const outputPath = path.join(workDir, webpName);
  const metadata = await optimizeToWebp(sourcePath, outputPath);
  const key = `${prefix}/${webpName}`;
  const publicUrl = await uploadToR2({ filePath: outputPath, key });

  await rm(sourcePath, { force: true });

  console.log(JSON.stringify({
    url: publicUrl,
    key,
    source: imageUrl,
    width: metadata.width,
    height: metadata.height,
    format: 'webp',
    quality: 80
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
