# 揪喝果汁 Landing Page

台北企業水果餐盒 / 會議水果盒單頁網站。
主目標：讓 HR、行政、總務、活動企劃先在網站上完成試算，再複製內容到 Line 官方帳號詢價。

## 目前定位
- 服務：企業水果餐盒、會議水果盒、辦公室定期配送、現打果汁、水果禮盒
- 區域：台北市 / 新北市，以中山區、松山區、大同區為核心
- 主要轉換：
  1. 官網試算價格
  2. 複製詢價內容
  3. 跳轉 Line 官方帳號 `https://lin.ee/xCwVELfD`

## 價格與規則
### 會議水果盒
- 小：`$75`
- 中：`$105`
- 大：`$155`

### 折扣與加購
- 現金 / 匯款：**每盒折 `$5`**
- 塑膠袋：`$1 / 個`
- 需提前 **三天** 預訂
- 每日承接上限：約 **300** 份

### 詢價欄位
試算器目前支援：
- 尺寸
- 盒數
- 付款方式
- 塑膠袋
- 姓名
- 取餐日期 / 時段
- 來店取貨 / 外送
- 地址
- 電話
- 收據是 / 否
- 統編（收據選是時）

## 專案檔案
- `index.html`：頁面內容、SEO、Schema、所有區塊
- `style.css`：原始樣式檔
- `style.min.css`：正式載入樣式檔
- `script.js`：前端互動邏輯
- `assets/hero/`：Hero 響應式圖片
- `assets/optimized/`：壓縮後圖片，頁面應優先用這裡
- `assets/icons/`：favicon、社群縮圖與品牌圖示
- `_headers` / `_redirects`：Cloudflare Pages 設定
- `robots.txt` / `sitemap.xml`：SEO 檔案
- `llms.txt` / `llm.txt`：給 AI crawler 的服務摘要
- `google1a2f56daf8a69e53.html`：Google Search Console 驗證
- `CLAUDE.md`：給 Claude/AI 協作使用的專案規則

## 部署
- 平台：Cloudflare Pages
- 網址：`https://juicing-together.pages.dev/`
- 推送到 GitHub 後自動部署

## 維護注意事項
### 1. 樣式修改
正式頁面載入的是 `style.min.css`。
若修改 `style.css`，要重新壓縮：

```bash
npx --yes clean-css-cli -o style.min.css style.css
```

### 2. 圖片資產
- 新圖片先壓縮到 `assets/optimized/`
- 不要直接引用超大 SVG 或原始大圖
- 補上 `width` / `height` / `loading` / `decoding`
- 可用 project-local helper：

```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py <source> --name <slug> --widths 372,744
```

### 3. SEO / 結構化資料
若修改網址、標題、描述、關鍵字、FAQ、付款規則或服務內容，要一起檢查：
- `index.html`
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `llm.txt`

### 4. 試算器邏輯
若調整價格或業務規則，請同步更新：
- HTML 顯示文案
- `script.js` 計算邏輯
- FAQ 文案
- Schema / README / CLAUDE.md

## SEO 主軸
目前主打：
- 台北企業水果餐盒
- 台北會議水果餐盒
- 會議水果盒試算
- 水果餐盒價格試算
- 辦公室水果配送
- HR 員工福利水果
- 公司下午茶水果

## 目前 UX 重點
- Calculator 要像報價工具，不像一般表單
- 降低 HR / 行政詢價摩擦
- 價格透明
- 一鍵複製後直接開啟 Line
