# 企鵝媽媽部落格 — 發文 SOP

使用者只會提供「主題 + 重點/大綱」與「一個裝照片的資料夾路徑」。收到後照下面流程走完，不用每次都問。

## 1. 收集輸入
- 主題、重點/大綱：使用者直接在對話裡給
- 照片：使用者會告訴一個電腦上的資料夾路徑

## 2. 決定 slug 與分類
- 用英文幫文章取一個 kebab-case 的 slug（例如 `okinawa-with-kids`），檔名和圖片資料夾都用這個
- 分類三選一：`parenting`（親子生活）/ `working`（職場爸媽）/ `travel`（旅遊手記），根據主題判斷；不確定就選最貼近的，不用特地問

## 3. 處理圖片
```bash
node scripts/process-images.mjs "<使用者給的資料夾路徑>" <slug>
```
- 會自動轉 webp、壓縮、限制寬度 1600px，輸出到 `public/images/<slug>/<slug>-1.webp`、`-2.webp`...
- 寫文章時視內容需要，用 `![替代文字](/images/<slug>/<slug>-1.webp)` 插入到合適段落，不用每張都塞，挑跟內容搭的

## 4. 寫文章
- 新增 `src/content/blog/<slug>.md`
- Frontmatter 照 `src/content.config.ts` 的 schema：
  ```yaml
  title: 依主題和重點下的標題（含讀者會搜尋的關鍵字）
  description: 80–120 字摘要
  category: parenting | working | travel
  pubDate: 今天日期，格式 YYYY-MM-DD
  draft: true   # 一律先設 true，見下方「5. 發布流程」
  ```
- 內文語氣：參考首頁「關於企鵝媽媽」的自我介紹（自嘲老阿姨、M7 MBA、七大洲、金融業職業媽媽、蒙特梭利、企鵝寶寶新副本）—— 帶點幽默自嘲，但內容紮實、有觀察和留白，不要空洞雞湯
- 只有使用者給的重點/大綱要擴寫成完整文章，不要無中生有掰不存在的細節（時間地點人物等事實類細節如果沒提供就寫得模糊一點，或留白讓使用者自己補）

## 5. 發布流程
1. `git add` 新文章的 `.md` 和 `public/images/<slug>/` 底下的圖片
2. commit + push 到 `main`（draft: true 不會出現在正式網站上，可以直接 push，不會誤上線）
3. 推上去之後：
   - 把完整文章內容貼在對話裡給使用者看一次
   - 提醒使用者：可以到 [Decap CMS 後台](https://penguinmama.blog/admin/) 找到這篇（會混在文章列表裡），確認沒問題後把「草稿」勾選拿掉、存檔，就會正式上線
4. 不用自己把 draft 改成 false 上線——使用者說她會自己審過再改

## 已知限制
- draft: true 的文章不會產生任何頁面（Astro 靜態建置時會濾掉），所以沒辦法用網址直接預覽，只能看貼在對話裡的內容，或使用者自己跑 `npm run dev` 在本機看
