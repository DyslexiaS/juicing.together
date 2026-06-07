# CLAUDE.md

## Project
揪喝果汁企業水果餐盒 landing page。
單頁靜態網站，部署在 Cloudflare Pages。
主要轉換：
1. 先用官網試算會議水果盒價格
2. 一鍵複製詢價內容
3. 跳轉 Line 官方帳號完成詢價

## Current stack
- `index.html` — 頁面結構、SEO meta、Schema.org、所有區塊
- `style.css` — 原始樣式檔
- `style.min.css` — 部署載入樣式檔；修改 `style.css` 後要重新壓縮
- `script.js` — 所有前端互動
- `assets/hero/` — Hero 響應式圖片
- `assets/optimized/` — 網站使用的壓縮圖片（優先引用）
- `assets/icons/` — favicon、社群縮圖、品牌/icon 資產
- `_headers` / `_redirects` — Cloudflare Pages 設定
- `robots.txt` / `sitemap.xml` / `llms.txt` / `llm.txt` — SEO / AI crawler 檔案

## Brand / business rules
- 品牌：揪喝果汁
- 主服務：台北企業水果餐盒、會議水果盒、辦公室配送
- CTA：Line 官方帳號 `https://lin.ee/xCwVELfD`
- 會議水果盒價格：
  - 小 `$75`
  - 中 `$105`
  - 大 `$155`
- 現金 / 匯款：每盒折 `$5`
- 塑膠袋：`$1 / 個`
- 需提前三天預訂
- 每日承接上限：約 `300` 份
- 付款：現金 / 匯款
- 收據：可選是 / 否；若需要可填統編

## Calculator behavior
試算器位於「合作流程」後、「FAQ」前。

### Required fields
- 尺寸
- 盒數
- 付款方式
- 是否購買塑膠袋
- 姓名
- 取餐日期
- 取餐時段
- 取貨方式
- 電話
- 收據是/否

### Conditional fields
- 塑膠袋數量：選「是」才輸入
- 地址：選「外送」才必填
- 統編：選「收據是」才輸入

### Output format
複製內容要可直接貼到 Line，保持固定欄位順序。
不要再把長備註文字塞進複製內容，除非使用者要求恢復。

## Editing rules for this repo
- 優先改現有檔案，不新增 framework
- 修改樣式後，記得同步更新 `style.min.css`
- 網站正式引用的是 `style.min.css`，不是 `style.css`
- 新圖片先壓到 `assets/optimized/`，不要直接引用大圖或大型 SVG
- 新增圖片要補 `width` / `height` / `loading` / `decoding`
- Open Graph / Twitter preview 優先使用 JPG/PNG，不要用超大 SVG
- 若改網址 / SEO 文案 / 結構化資料，要同步檢查：
  - `index.html`
  - `robots.txt`
  - `sitemap.xml`
  - `llms.txt`
  - `llm.txt`

## Common tasks
### Rebuild minified CSS
```bash
npx --yes clean-css-cli -o style.min.css style.css
```

### Optimize new images
```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py <source> --name <slug> --widths 372,744
```

Project-local skill:
- `.claude/skills/image-optimization/`
- Trigger when adding/replacing images and wanting `assets/optimized/` outputs

直接 push 到 GitHub，Cloudflare Pages 自動部署。

### Search Console
驗證檔：`google1a2f56daf8a69e53.html`

## UX direction
- B2B、乾淨、可快速完成詢價
- Calculator 要像「報價工具」，不是一般表單
- 優先減少使用者思考成本
- CTA 文案偏直接：試算、複製、Line 詢價

## When updating docs
若修改以下內容，README / CLAUDE.md 也要一起更新：
- 報價規則
- 付款規則
- 收據規則
- CTA / 詢價流程
- SEO 主軸
- 部署方式
