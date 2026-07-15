// 建置前自動幫每篇文章產生專屬的社群分享圖（og:image）
// 跟網站主視覺一致的暖手繪風：奶油黃底 + 圓角吊牌卡片 + Noto Sans TC 黑體 + 企鵝印章
// 用 Satori 排版 + resvg 轉 PNG，字型用本地的 Noto Sans TC OTF（不依賴建置時網路連線）
// 用法：node scripts/generate-og-images.mjs（package.json 的 "prebuild" 會自動跑）
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const W = 1200;
const H = 630;
const OUTER_BG = '#F2ECBE';
const CARD_BG = '#FBF8F2';
const INK = '#9A3B3B';
const TITLE_COLOR = '#5C2020';
const GOLD = '#C08261';
const BRAND_COLOR = '#3A2820';
const URL_COLOR = '#8B6F5C';
const MARGIN = 40;
const CARD_PADDING = 56;

const CATEGORIES = {
  parenting: '企鵝寶寶副本',
  working: '副本裡的大人',
  travel: '親子行李箱',
  solo: '一個人的行李箱',
};

const fontsDir = path.join(import.meta.dirname, 'fonts');
const fonts = [
  { name: 'Noto Sans TC', data: readFileSync(path.join(fontsDir, 'NotoSansTC-Regular.otf')), weight: 400, style: 'normal' },
  { name: 'Noto Sans TC', data: readFileSync(path.join(fontsDir, 'NotoSansTC-Medium.otf')), weight: 500, style: 'normal' },
  { name: 'Noto Sans TC', data: readFileSync(path.join(fontsDir, 'NotoSansTC-Bold.otf')), weight: 700, style: 'normal' },
];

const stampDataUri = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), 'public', 'penguin-logo-red.png')
).toString('base64')}`;

// 標題盡量平衡分行，最多三行；太長就縮小字級、多塞一點字
function wrapTitle(title) {
  const wrap = (maxCharsPerLine) => {
    const len = title.length;
    const lineCount = Math.max(1, Math.ceil(len / maxCharsPerLine));
    const perLine = Math.ceil(len / lineCount);
    const lines = [];
    for (let i = 0; i < len; i += perLine) lines.push(title.slice(i, i + perLine));
    return lines;
  };

  let fontSize = 56;
  let lines = wrap(15);
  if (lines.length > 3) {
    fontSize = 48;
    lines = wrap(18);
  }
  if (lines.length > 3) {
    const head = lines.slice(0, 2);
    const rest = lines.slice(2).join('');
    lines = [...head, rest.length > 18 ? `${rest.slice(0, 17)}…` : rest];
  }
  return { lines, fontSize };
}

function h(type, props = {}, ...children) {
  const flat = children.flat();
  const p = { ...props };
  if (flat.length === 1) p.children = flat[0];
  else if (flat.length > 1) p.children = flat;
  return { type, props: p };
}

function buildTree({ label, title, brandLine1, brandLine2 }) {
  const { lines, fontSize } = wrapTitle(title);

  return h(
    'div',
    {
      style: {
        width: `${W}px`,
        height: `${H}px`,
        display: 'flex',
        backgroundColor: OUTER_BG,
        padding: `${MARGIN}px`,
        fontFamily: 'Noto Sans TC',
      },
    },
    h(
      'div',
      {
        style: {
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: CARD_BG,
          borderRadius: '24px',
          padding: `${CARD_PADDING}px`,
        },
      },
      // 分類標籤
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
        h('div', { style: { width: '14px', height: '14px', borderRadius: '50%', backgroundColor: INK } }),
        h(
          'div',
          { style: { fontSize: '22px', fontWeight: 500, color: INK, letterSpacing: '0.15em' } },
          label
        )
      ),
      // 標題（置中撐開剩餘空間）
      h(
        'div',
        { style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '900px' } },
        ...lines.map((line) =>
          h(
            'div',
            { style: { fontSize: `${fontSize}px`, fontWeight: 700, lineHeight: 1.5, color: TITLE_COLOR } },
            line
          )
        )
      ),
      // 分隔線 + 品牌區
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column' } },
        h('div', { style: { width: '40px', height: '3px', backgroundColor: GOLD, marginBottom: '18px' } }),
        h('div', { style: { fontSize: '22px', fontWeight: 500, color: BRAND_COLOR, marginBottom: '6px' } }, brandLine1),
        h('div', { style: { fontSize: '16px', fontWeight: 400, color: URL_COLOR } }, brandLine2)
      ),
      // 企鵝印章（卡片右下角）
      h('img', {
        src: stampDataUri,
        width: 80,
        height: 80,
        style: { position: 'absolute', right: `${CARD_PADDING - 16}px`, bottom: `${CARD_PADDING - 16}px` },
      })
    )
  );
}

async function renderPng(props) {
  const svg = await satori(buildTree(props), { width: W, height: H, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
  return png;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let [, key, value] = m;
    value = value.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return meta;
}

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'og');
  mkdirSync(outDir, { recursive: true });

  // 首頁／分類頁／關於我共用的預設圖
  const defaultPng = await renderPng({
    label: '副本人生進行中',
    title: '企鵝媽媽的行李箱',
    brandLine1: '親子 · 職場 · 旅行 · 副本人生',
    brandLine2: 'penguinmama.blog',
  });
  writeFileSync(path.join(outDir, 'default.png'), defaultPng);
  console.log('generated public/og/default.png');

  // 每篇文章各自的分享圖
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const raw = readFileSync(path.join(blogDir, file), 'utf-8');
    const meta = parseFrontmatter(raw);
    if (!meta || meta.draft === 'true') continue;

    const slug = file.replace(/\.md$/, '');
    const label = CATEGORIES[meta.category] ?? '企鵝媽媽的行李箱';
    try {
      const png = await renderPng({
        label,
        title: meta.title,
        brandLine1: '企鵝媽媽的行李箱',
        brandLine2: 'penguinmama.blog',
      });
      writeFileSync(path.join(outDir, `${slug}.png`), png);
      console.log(`generated public/og/${slug}.png`);
    } catch (err) {
      console.error(`OG 圖產生失敗（${slug}），該篇文章分享時會 fallback 用 /penguin-logo-red.png：`, err.message);
    }
  }
}

main().catch((err) => {
  console.error('OG 圖產生失敗，網站仍會照舊用 /penguin-logo-red.png 當 fallback：', err);
  // 不要讓整個建置失敗——見 BaseLayout.astro 的 fallback 邏輯
});
