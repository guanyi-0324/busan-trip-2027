# 2027 釜山五天四夜自由行

V3.5 原行程的手機旅行手帳。Vite + HTML + CSS + Vanilla JavaScript ES Modules；內容由 `public/data/` JSON 載入，無後端、帳號或付費地圖 API。

## 本機啟動

安裝 Node.js 22.12+（含 npm），在此目錄開啟終端機：

```sh
npm install
npm run dev
```

開啟終端機顯示的網址，預設為 `http://127.0.0.1:5173/busan-trip-2027/`。

```sh
npm test
npm run build
npm run preview
```

正式產物位於 `dist/`。不要直接雙擊 index.html，JSON 載入需要 HTTP 伺服器。旅遊期間依韓國日期選擇當日，其他日期預設 Day 1。

## 更新內容

- `public/data/trip.json`：航班、住宿、提醒、封面設定。
- `public/data/itinerary.json`：原始 46 個時段；Day 5 退房與出發在畫面合併，原始資料仍保留。
- `public/data/restaurants.json`：30 筆餐廳、咖啡廳、攤販及未指定店家的用餐選項。
- `public/data/restaurant-groups.json`：各時段的 preferred / alternative / equal / emergency 關係。
- `public/data/places.json`：19 個景點、預約、備案與提醒。

時間、名稱、價格等請修改 JSON。新增活動時使用唯一 id，透過 placeId 或 restaurantGroupId 引用資料；不要更動既有 id 以免收藏失效。`null` 會顯示待確認。新增店家請先核實，不要將搜尋結果視為地址。

餐廳和景點皆保留 instagramType；目前使用者提供的 IG 連結標為 hashtag 或 unverified，不冒充官方帳號。未提供的 IG 顯示「IG 待補」。地圖使用店名搜尋，不保證搜尋命中正確分店。

`scripts/generate-data.mjs` 為原始匯入工具，日常更新直接編輯 JSON，請勿重跑匯入以免覆蓋修改。

## 換上照片

目前封面是專案原創 CSS 海岸插畫，明確標示照片待補。把自有或已授權照片放在 `public/images/cover.jpg`，將 trip.json 的 coverImage 設為 `images/cover.jpg`。載入失敗自動回到插畫。請勿使用未授權 IG 照片。Google Fonts 失敗會回退系統字型。

## GitHub Pages 發布

已建立儲存庫：https://github.com/guanyi-0324/busan-trip-2027 。Pages 使用 GitHub Actions 自動部署，網站網址：https://guanyi-0324.github.io/busan-trip-2027/ 。下列建立步驟供其他帳戶重新部署時參考，此專案不需重建。

1. 登入 GitHub，建立名稱為 `busan-trip-2027` 的空白 repository。不要加入私人證件或住宿訂單。
2. 在專案目錄執行（替換 YOUR_USERNAME）：

```sh
git init -b main
git add .
git commit -m "Build Busan travel journal"
git remote add origin https://github.com/YOUR_USERNAME/busan-trip-2027.git
git push -u origin main
```

3. Repository → Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。
4. Actions 中執行 Deploy travel journal to GitHub Pages；若第一次推送時尚未設定 Pages，可選 Run workflow 重新執行。
5. 部署成功後網址為 `https://YOUR_USERNAME.github.io/busan-trip-2027/`。此處 YOUR_USERNAME 必須使用你自己的名稱。

Vite base 已設為 `/busan-trip-2027/`，資料、JS、CSS、favicon 都支援子路徑。若 repository 改名，請同步更新 vite.config.js 的 base。工作流程會執行 npm ci、資料測試、建置與 Pages 部署。

## 分享到 LINE 與再次更新

開啟發布後網址，按「分享」選 LINE；不支援原生分享則複製網址，貼到群組。本機 localhost 網址不能讓其他人的手機直接開啟。分享資訊包含標題與描述，未設定公開封面照片前不提供 og:image。

編輯 JSON → `npm test` → `npm run build` → git add / commit / push 到 main，Actions 會重新部署。收藏是瀏覽器 localStorage，不會同步旅伴；無法儲存時仍可使用網站。

## 驗收與限制

自動測試檢查行程數量、3/13 順序、候選狀態、引用、地圖 URL 與韓國跨日時區。網址格式檢查不等於店家、IG 或預約頁內容查核。所有營業、價格、票價、地址、航班與 2027 場次均須依 DATA_REVIEW.md 再核實。

## V4.0 本機改版

新增 #overview、五色 Leaflet 地圖與裝置端清單，全部使用 public/data 的共用資料。完整驗收、檔案清單及未核實資料見 QA.md 與 DATA_REVIEW.md。本次尚未推送或部署，須使用者確認。

請直接維護 JSON；scripts/generate-data.mjs 是早期 V3 資料產生器，重新執行會覆蓋後續手動更新，不適用 V4 日常維護。tests/fixtures 是僅供回歸驗證的 V3.6 快照，不會載入網站。
