# 本機驗收紀錄

- 以 npm 安裝相依套件完成，產生 package-lock.json；安裝回報 0 vulnerabilities。
- npm run build 通過，Vite 7.3.7 產生 dist。
- npm test：4 項通過，涵蓋 46 時段、Day 4 順序、候選關係、資料引用、連結格式、韓國日期跨日。
- Vite 開發伺服器啟動並由瀏覽器開啟；npm run preview 正式預覽通過 `/busan-trip-2027/` 子路徑載入。
- 瀏覽器測試 Day 4 日期切換、韓文 개미집 搜尋、收藏、重新整理後收藏持續存在、收藏篩選與深色切換。
- 375px 與 430px 視窗測試：扣除捲軸後內容寬 360px／415px，scrollWidth 與 clientWidth 相同，未發現水平溢出。
- 已查看窄版與預覽畫面，瀏覽器記錄未回報 JavaScript error。

限制：本次使用 Codex 內建瀏覽器的尺寸模擬，尚未以實體 iPhone Safari 或 Android Chrome 驗收；原生分享需在相應手機驗證。外站連結只驗證 HTTPS 與編碼格式，未逐一查核營業、IG 帳號有效性或官方預約內容。封面照片未提供，以原創插畫預留。GitHub repository 尚未建立、未推送、未上線。

此環境的 node 可直接執行，但 npm 未加入 PATH；測試使用快取的 npm CLI。一般安裝 Node.js（包含 npm）的電腦可直接依 README 執行命令。
