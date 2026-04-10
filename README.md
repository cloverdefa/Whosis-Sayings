# Whosis-Sayings

一個簡易的聊天樣式示範頁面，會定期從句庫隨機選取語句並顯示。適合用來做 UI 示範、測試或作為填充內容來源。

## 重點

- 使用 Vue 3（Composition API） via CDN
- UI 使用 Bulma 與 Font Awesome（CDN 引入）
- 無需建置或安裝：直接開啟 `index.html` 或啟動靜態伺服器即可

## 重要變更

- 2026-04-10：專案已從 Vue 2 升級為 Vue 3（使用 Composition API）
	- 已更新檔案：`index.html`（改為 Vue 3 CDN），`public/main.js`（重構為 Composition API）

## 快速啟動

1. 開啟專案根目錄後，直接在瀏覽器開啟 `index.html`：

	 - 直接雙擊或用瀏覽器開啟檔案（適合單機測試）。

2. 或在開發時啟動簡單靜態伺服器（推薦，以避免跨域或路徑問題）：

```powershell
# 在專案根目錄執行（Windows / PowerShell）
python -m http.server 8000
# 然後在瀏覽器開啟： http://localhost:8000
```

或使用 Node 的 http-server：

```bash
npx http-server -c-1
```

## 檔案說明

- `index.html`：主要 UI 與外部資源（Vue、Bulma、Font Awesome、字型）
- `public/main.js`：應用程式邏輯（已使用 Vue 3 Composition API）
- `public/saying.txt`：句庫，格式範例：`username,內容;username2,內容2;`
- `LICENSE.md`：授權資訊

## 編輯句庫

編輯 `public/saying.txt`，每筆以分號 `;` 分隔，單筆格式為 `username,內容`。儲存後重新載入頁面即可看到變更。

## 貢獻與聯絡

歡迎提交 Issue 或 Pull Request。若需協助我也可以幫你把改動合併或加入進一步的說明。

---

授權：MIT
