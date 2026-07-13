// 發文用的圖片處理工具
// 用法：node scripts/process-images.mjs <來源資料夾> <文章 slug>
// 會把來源資料夾內的圖片轉成 webp、限制寬度、壓縮，輸出到 public/images/<slug>/
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const [, , srcDir, slug] = process.argv;

if (!srcDir || !slug) {
  console.error('用法：node scripts/process-images.mjs <來源資料夾> <文章 slug>');
  process.exit(1);
}

const MAX_WIDTH = 1600;
const QUALITY = 82;
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);

const outDir = path.join('public', 'images', slug);
mkdirSync(outDir, { recursive: true });

const files = readdirSync(srcDir)
  .filter((f) => exts.has(path.extname(f).toLowerCase()))
  .sort();

if (files.length === 0) {
  console.error(`在 ${srcDir} 找不到圖片檔`);
  process.exit(1);
}

for (const [i, file] of files.entries()) {
  const outName = `${slug}-${i + 1}.webp`;
  const outPath = path.join(outDir, outName);
  await sharp(path.join(srcDir, file))
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  console.log(`${file} → ${outPath}`);
}
