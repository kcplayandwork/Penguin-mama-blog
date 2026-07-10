# 企鵝媽媽 Penguin Mama 部落格

Astro 靜態部落格，內建 SEO（sitemap、RSS、Open Graph、JSON-LD 結構化資料）。

## 📝 如何發布新文章（日常最常用）

1. 在 `src/content/blog/` 新增一個 `.md` 檔，檔名就是網址（用英文，例如 `okinawa-with-kids.md` → `/blog/okinawa-with-kids/`）
2. 檔案開頭照這個格式填：

```markdown
---
title: 文章標題（含讀者會搜尋的關鍵字）
description: 80–120 字的摘要，會顯示在 Google 搜尋結果和首頁卡片上
category: travel        # 三選一：parenting / working / travel
pubDate: 2026-08-01
---

這裡開始用 Markdown 寫內文...
```

3. 存檔後 `git push`，Vercel 會自動重新部署，約一分鐘上線
4. 首頁的「精選文章」永遠自動顯示最新一篇，不用手動改

還沒寫完的文章加上 `draft: true` 就不會發布。

## 🚀 首次部署（只需做一次）

1. 把這個資料夾推上 GitHub（kcplayandwork 帳號）：
   ```bash
   git init && git add -A && git commit -m "init"
   git remote add origin https://github.com/kcplayandwork/penguin-mama-blog.git
   git push -u origin main
   ```
2. 到 [vercel.com](https://vercel.com) → Add New Project → 選這個 repo → 直接 Deploy（Astro 會被自動偵測，不用改設定）

## 🌐 綁定自己的網域

1. 到 Cloudflare Registrar 或 Namecheap 搜尋並購買網域（約 NT$300–500/年）
2. Vercel 專案 → Settings → Domains → 輸入網域 → 照畫面指示到註冊商設定 DNS
3. **重要**：買好網域後，改兩個地方再 push：
   - `astro.config.mjs` 裡的 `site: 'https://你的網域'`
   - `public/robots.txt` 裡的 Sitemap 網址

## 🔍 SEO 待辦清單（部署後）

- [ ] 到 [Google Search Console](https://search.google.com/search-console) 用網域驗證網站
- [ ] 提交 sitemap：網址填 `https://你的網域/sitemap-index.xml`
- [ ] 每篇文章的 title 用讀者會搜尋的字（例：「北海道親子自駕」而不是「我們的旅行」）
- [ ] description 認真寫，它就是 Google 搜尋結果裡的那兩行字
- [ ] 文章之間互相連結（在 Markdown 裡用 `[文字](/blog/另一篇/)`）
- [ ] 固定更新頻率比一次發十篇更有效

已內建、不用再做的：sitemap 自動產生、RSS（/rss.xml）、每頁 canonical / Open Graph / JSON-LD、robots.txt、手機版 RWD。

## 🛠 本機預覽（可選）

```bash
npm install
npm run dev      # http://localhost:4321
```

## 📁 專案結構

```
src/content/blog/     ← 你的文章都放這裡（Markdown）
src/pages/            ← 頁面（首頁、文章頁、分類頁、RSS）
src/layouts/          ← 共用版型（SEO meta 都在這）
src/styles/global.css ← 企鵝設計系統（配色、字型）
public/               ← favicon、robots.txt
```
