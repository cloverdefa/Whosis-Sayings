# Repository Guidelines

## Project Structure & Module Organization
- Root: `index.html`（Vue 2 + Bulma UI，載入 CDN）。
- Assets: `public/main.js`（核心邏輯）、`public/saying.txt`（句庫，`username,內容;`）。
- CI: `.github/workflows/`（自動合併、Telegram 推播）。

## Build, Test, and Development Commands
- 本專案為純前端靜態頁面，無建置步驟。
- 本地預覽：`python3 -m http.server 8080` → 開啟 `http://localhost:8080/`。
- 檔案結構需保持：`index.html` 透過 `fetch('public/saying.txt')` 讀取句庫。

## Coding Style & Naming Conventions
- 語言：JavaScript (ES2015+)；縮排 2 空格、字串使用單引號、以分號結尾。
- 檔名：靜態資源採 `kebab-case`（如：`saying.txt`）。
- Vue 結構：維持 `data`, `methods` 鍵順序；方法命名使用 `camelCase`（如：`addRandomMessage`）。
- 依現有風格撰寫；如需導入 Lint/Format，優先考慮 ESLint + Prettier（另開 PR）。

## Testing Guidelines
- 目前無自動化測試。提交前請進行手動驗證：
  - 首屏顯示 1 則訊息；每 10 秒新增 1 則；最多 30 則並自動捲動。
  - 響應式視窗下氣泡與頭像尺寸正確、時間顯示合理（`剛剛`/分鐘）。
- 若新增自動化測試，建議使用 Playwright 或 Vitest，放於 `tests/`，命名 `*.spec.js`。

## Commit & Pull Request Guidelines
- 採用 Conventional Commits：`feat|fix|docs|style|refactor|chore: 說明`（可中英）。
  - 範例：`feat: 改善聊天介面與訊息處理`、`refactor: 調整樣式與滾動行為`。
- PR 要求：
  - 說明變更、動機與影響；UI 變更附 Before/After 截圖。
  - 連結關聯 Issue；小步提交、每個 commit 聚焦單一主題。
  - 注意：推送到 `main` 會觸發 Telegram 通知（勿包含敏感資訊）。

## Security & Configuration Tips
- 不要提交任何金鑰或 Token；GitHub Actions 使用 `secrets` 管理。
- 依賴 CDN（Vue/Bulma/Font Awesome）：如需鎖定版本或離線部署，請改為自託管並固定版本。
