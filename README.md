# 揪喝果汁 Landing Page

這是一個單頁式形象與詢價網站，定位是「台北企業健康水果補給」。目標客群為企業內負責員工福利、行政採購與活動安排的人，包括 HR、行政、總務與活動企劃。網站主打健康、新鮮、可長期配合的多人水果餐盒，並延伸提供水果禮盒與健康新鮮果汁。

## 網站定位

- TA：企業內負責員工福利、行政採購、會議茶水與活動安排的 HR、行政、總務與活動企劃。
- 核心需求：可長期配合、品質穩定、健康新鮮、適合多人享用、配送準時、企業可開收據。
- 提供服務：企業多人水果餐盒、辦公室定期水果配送、水果禮盒、活動水果配送、當季水果現榨果汁。
- 主要轉換：引導訪客加入 Line 官方帳號或撥打電話詢價。

## SEO 利基關鍵字

台北競品多集中在「會議水果、現切水果、下午茶水果、雙北當日配送、月結、電子發票、冷鏈配送」等大方向。本站優先搶更精準、較接近採購決策的長尾詞：

- 台北中山區企業水果餐盒
- 台北企業水果餐盒
- 台北企業水果盒
- 中山區辦公室水果配送
- HR 員工福利水果
- 行政辦公室水果配送
- 會議水果盒
- 會議水果餐盒台北
- 會議茶水水果餐盒
- 台北會議水果餐盒
- 公司下午茶水果
- 現切水果餐盒
- 松山區辦公室水果配送
- 大同區企業水果餐盒
- 企業水果餐盒試訂
- 企業水果餐盒開收據

## 檔案結構

- `index.html`：首頁內容、SEO meta、Open Graph、Schema.org 結構化資料、所有頁面區塊。
- `style.css`：網站版面、色彩、響應式設計、動畫與服務卡視覺權重。
- `style.min.css`：部署時載入的壓縮 CSS，由 `style.css` 產生，用來降低 Lighthouse 的 CSS payload。
- `script.js`：捲動顯示動畫、固定導覽列、手機選單、FAQ 展開收合、Line 浮動按鈕控制。
- `assets/icons/`：網站使用的水果、品牌圖示與服務圖片資產。
- `assets/hero/`：首頁首屏 Hero 圖片的 AVIF/WebP 響應式版本，供 LCP 圖片優先載入。
- `assets/optimized/`：服務卡、特色圖示與裝飾水果的壓縮後圖片版本，避免部署過大的原始素材。
- `_headers`：Cloudflare Pages 回應標頭設定，讓圖片等靜態資產使用長快取，HTML/CSS/JS 使用短快取。
- `robots.txt`：搜尋引擎爬取設定。
- `sitemap.xml`：搜尋引擎 Sitemap。
- `llms.txt`：提供給 AI/LLM 讀取的網站服務摘要，協助理解服務定位、服務項目、服務區域與聯絡方式。
- `llm.txt`：`llms.txt` 的備用入口，避免使用者或爬蟲輸入單數檔名時找不到內容。

## 首頁區塊

- Hero：第一屏主打企業健康水果補給，強調健康、新鮮與送進辦公室。
- 為什麼選擇揪喝：說明 HR、行政、活動企劃在意的穩定、衛生、配送與請款。
- 服務方案：呈現企業多人水果餐盒、當季水果現榨果汁、水果禮盒與活動配送。
- 社會證明：用企業客戶情境強化信任。
- 合作流程：從 Line 詢價、確認餐盒、請款方式到定期配送。
- FAQ：回答最少訂購量、配送範圍、試訂、付款與收據問題。
- CTA：再次引導加入 Line 詢問企業水果餐盒。

## 維護方式

直接編輯 `index.html` 可調整文案、連結與 SEO 內容；調整視覺樣式請編輯 `style.css`，修改後需重新產生 `style.min.css`；互動行為請編輯 `script.js`。若更換正式網域，請同步更新 `index.html` 的 canonical、Open Graph URL、`robots.txt` 與 `sitemap.xml`。

若服務內容、配送範圍、電話、Line 或定位關鍵字有變動，也需要同步更新 `llms.txt` 與 `llm.txt`，讓 AI 搜尋與摘要工具讀到一致資訊。

## 效能維護重點

首頁首屏圖片使用 `assets/hero/` 內的本地 AVIF/WebP 多尺寸版本，`index.html` 透過 preload、`picture`、`srcset`、`sizes` 與 `fetchpriority="high"` 載入，避免依賴第三方圖片拖慢 LCP。若未來更換 Hero 圖，請同步輸出 640、960、1280、1600 寬度的 AVIF/WebP 版本，並保留圖片的 `width`、`height`。

網站已移除 Google Fonts 阻塞載入，改用系統中文字型堆疊。若未來需要品牌字體，建議自架子集化字型並使用 `font-display: swap`，避免重新造成 FCP/LCP 延遲。

服務卡與裝飾圖請優先放入 `assets/optimized/`，依實際顯示尺寸輸出壓縮版本與 responsive `srcset`。例如 why-us 水果盤提供 280px/490px 版本，避免小尺寸顯示時下載 560px 圖片。不要直接在頁面引用大型 SVG、原始照片或 512px 以上的 icon；新增圖片時也請補上 `width`、`height`、`loading` 與 `decoding` 屬性。

Cloudflare Pages 會讀取 `_headers`：預設使用 5 分鐘短快取，`assets/*` 使用 30 天快取，`robots.txt` 與 `sitemap.xml` 使用 1 小時快取。若未來導入含 hash 的檔名，才適合把圖片快取改成一年並加上 `immutable`。

更新樣式後可執行 `npx --yes clean-css-cli -o style.min.css style.css` 重新壓縮 CSS，首頁會載入 `style.min.css`。
