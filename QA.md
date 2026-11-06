# V4.0 本機改版驗收

日期：2026-11-06。未執行 git push、正式部署或修改線上網站。

## 修改範圍

- package.json、package-lock.json：加入 Leaflet 1.9.4。
- public/data/itinerary.json：只新增 Day 1 彈性換錢與原交通卡內的地鐵教學／站點參照。
- public/data/places.json：換錢候選、交通站點、12 筆具來源的代表座標及來源欄位。
- public/data/restaurants.json、restaurant-groups.json：青春牛小腸加入西面午餐第 4 備選。
- src/main.js：共用每日行程呈現、#overview、地圖／清單整合、IG 搜尋入口。
- src/styles.css：手機、固定跳轉導覽、五色、深色模式、地圖與清單樣式。
- src/checklists.js：裝置端購物 CRUD 與行前清單。
- src/interactive-map.js：Leaflet + OpenStreetMap、五天篩選、雙語資訊、圖層、候選角色與相鄰標記合併。
- src/utils/journey.js：共用行程參照、五色與座標判定。
- tests/data.test.js、tests/fixtures/：V3.6 保護快照與 7 項回歸測試。
- scripts/browser-qa.mjs：無頭 Edge 互動測試；需可用的 Playwright 與 Edge。
- QA.md、DATA_REVIEW.md、README.md：本次驗收與限制說明。

## 驗證結果

- npm test：7／7 通過。
- npm run build：通過，保留 /busan-trip-2027/ base。
- 本機 HTTP 回應 200；六個 hash 路由重新載入可開啟。
- 無頭 Edge：46 張呈現卡片（47 筆資料，Day 5 退房與車輛出發合併，沿用原呈現方式）、五天完整內容、多卡同時展開、快速跳轉。
- 購物新增／編輯名稱與分類／勾選／刪除、重新整理保存；行前準備勾選保存。
- 五個單日篩選、預設全部、雙語資訊窗、韓文剪貼簿、當日行程連結。
- 活動區域圖層開關、相鄰地點合併、深色模式。
- 320、390、768、1440 px 總覽無水平溢出；手機與桌面截圖已產生。
- 原行程全部既有欄位、順序與時段與 V3.6 快照相同；餐廳角色相同，只新增指定備選。
- 瀏覽器 QA 腳本也涵蓋收藏保存、原生分享參數、複製網址備援、localStorage 寫入失敗提示。

## 20 項需求對照

| 項目 | 結果 |
| --- | --- |
| 1–3 完整總覽、跳轉、收合 | 已完成與瀏覽器驗證 |
| 4–5 購物／行前清單保存 | 已完成與瀏覽器驗證 |
| 6–7 五色地圖與單日篩選 | 已完成；共用地點以多色顯示 |
| 8–10 雙語、複製、外部地圖 | 已完成；無韓文資料顯示待確認 |
| 11 每日路線 | 已完成示意線機制；只連有來源的行程點，缺座標處斷開；單一位置不代表完整路線 |
| 12 活動區域 | 已完成可關閉的局部半透明範圍，排除機場與交通站點；少於兩點不畫 |
| 13 兩個換錢候選 | 已完成；兩者座標未核實，保留於 Day 1 待確認清單 |
| 14 地鐵流程 | 已完成；時間、費用為來源估計，2027 年與轉乘計費仍需確認 |
| 15 青春牛小腸 | 已完成第四備選；每日、總覽、美食與地圖待確認清單同步 |
| 16 無虛構座標 | 所有非空座標具來源；未核實店家不放點 |
| 17 共用資料 | 所有頁面使用同一批 JSON 與參照 |
| 18 原功能 | 資料回歸、六路由、收藏、分享、深色模式納入驗證 |
| 19 手機／桌面 | Chromium/Edge 手機尺寸模擬與桌面；未在實體 iPhone Safari／Android Chrome 測試 |
| 20 正式建置 | npm run build 通過 |

## 待確認與部署判斷

- Money Box 與 Money Planet 未有可信的精確座標，沒有為了滿足「兩個標記」而猜測位置。Money Box 使用指定參考地址；不同公開來源營業時間有差異。
- Money Planet 實際海雲台分店、台幣支援、地址與營業；青春牛小腸韓文、分店與地址均待確認。
- 既有餐廳、Spa Haesurang 等未核實位置仍在地圖待確認清單；地圖不是完整逐店定位。
- 住宿地址、出口、步行距離／時間、電梯未填猜測資料。
- 票價與車程附來源、估計及 2027 可能調整提醒。原計程車時段沒有改動，地鐵可能超出原時段。
- OpenStreetMap 圖磚需要網路，失敗時仍提供地點清單與外部地圖連結。
- 技術上可進入部署前審閱；不是所有旅遊資料皆已核實。待使用者確認後才可推送／部署。

## 重跑

一般環境執行 npm test 與 npm run build。瀏覽器測試先執行 npm run dev，再執行 node scripts/browser-qa.mjs；如 Playwright 不在專案依賴，透過 PLAYWRIGHT_MODULE 指定其模組目錄。此環境使用內建 Playwright 與本機 Edge，沒有加入產品開發依賴。

截圖：artifacts/overview-desktop.png、artifacts/overview-mobile-dark.png、artifacts/map-mobile-dark.png。
