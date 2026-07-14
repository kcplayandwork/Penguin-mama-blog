// 產生預設的社群分享圖（og:image），依分類給不同視覺，不用罐頭圖庫照
// 用法：node scripts/generate-og-images.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const W = 1200;
const H = 630;
const INK = '#9A3B3B';
const SNOW = '#FBF8F2';
const ICE = '#F2ECBE';
const GOLD = '#C08261';
const HARBOR = '#4A6B80';

const pages = {
  default: { label: '企鵝媽媽的行李箱', sub: '副本人生進行中・暫無業配，請安心服用' },
  parenting: { label: '企鵝寶寶副本', sub: '陪一隻小企鵝長大的日常觀察' },
  working: { label: '副本裡的大人', sub: '職場觀察、人生碎碎念' },
  travel: { label: '親子行李箱', sub: '帶著企鵝寶寶走過的地方' },
  solo: { label: '一個人的行李箱', sub: '副本開啟前，那個走過七大洲的女孩' },
};

function svgFor({ label, sub }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${SNOW}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${INK}"/>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${INK}"/>
  <circle cx="150" cy="150" r="110" fill="none" stroke="${INK}" stroke-width="3"/>
  <circle cx="150" cy="150" r="90" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="6 8"/>
  <g transform="translate(150,150)">
    <ellipse cx="0" cy="10" rx="46" ry="58" fill="${INK}"/>
    <ellipse cx="0" cy="18" rx="30" ry="42" fill="${SNOW}"/>
    <circle cx="0" cy="-40" r="30" fill="${INK}"/>
    <circle cx="0" cy="-36" r="19" fill="${SNOW}"/>
    <circle cx="-7" cy="-38" r="3" fill="${INK}"/>
    <circle cx="7" cy="-38" r="3" fill="${INK}"/>
  </g>
  <rect x="330" y="230" width="6" height="170" fill="${GOLD}" opacity=".6"/>
  <text x="370" y="290" font-family="Noto Sans TC, sans-serif" font-size="30" letter-spacing="6" fill="${HARBOR}">PENGUIN MAMA</text>
  <text x="370" y="360" font-family="Noto Sans TC, sans-serif" font-size="64" font-weight="700" fill="${INK}">${label}</text>
  <text x="370" y="410" font-family="Noto Sans TC, sans-serif" font-size="28" fill="${HARBOR}">${sub}</text>
  <text x="370" y="470" font-family="Noto Sans TC, sans-serif" font-size="24" fill="${GOLD}">penguinmama.blog</text>
</svg>`;
}

mkdirSync('public/og', { recursive: true });

for (const [key, meta] of Object.entries(pages)) {
  const svg = Buffer.from(svgFor(meta));
  const outPath = `public/og/${key}.png`;
  await sharp(svg).png().toFile(outPath);
  console.log(`generated ${outPath}`);
}
