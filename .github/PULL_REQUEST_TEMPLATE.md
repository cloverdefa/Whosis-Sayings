## Summary

本 PR 整合 `dev` 分支近期累積的功能、介面、內容與 GitHub Actions 工作流程變更，更新 Whosis-Sayings 的聊天樣式示範頁面與專案自動化流程。

主要目的包括：

* 持續更新句庫與使用者發言內容。
* 改善聊天介面的視覺呈現與使用者體驗。
* 完善本地頭像與圖片資源的管理方式。
* 強化 HTML 內容處理與訊息顯示的穩定性。
* 改善 GitHub Actions 的自動合併、Release、版本判定與通知流程。
* 提供手動觸發 Release 與變更分析能力，降低版本發布流程的人工操作成本。

## Changes

* 更新句庫與相關內容，增加新的語錄、觀點及使用者發言。
* 更新聊天介面的文字、頁尾資訊及相關 UI 內容。
* 持續使用 Vue 3 Composition API 維護前端應用程式。
* 改善訊息顯示與聊天介面的樣式及響應式行為。
* 更新及整理使用者頭像與本地圖片資源。
* 增加及更新 WebP 圖示與國旗等專案資源。
* 改善訊息頭像的錯誤處理與備援機制。
* 使用本地圖片取代部分外部 Gravatar 頭像來源。
* 強化訊息 HTML 過濾，降低不受信任內容造成 XSS 的風險。
* 將訊息識別方式調整為唯一遞增 ID，以提升 Vue 列表渲染穩定性。
* 改善相對時間顯示邏輯，讓短時間內的訊息能顯示較精確的分鐘資訊。
* 增加元件卸載時的計時器清理機制，避免不必要的資源持續佔用。
* 更新 GitHub Actions 自動合併流程：

  * 調整 Pull Request 事件觸發條件。
  * 依作者、來源分支及 Draft 狀態判斷是否允許自動合併。
  * 使用 Squash Merge 簡化合併後的提交歷史。
  * 補充自動合併所需的 repository 權限。
* 更新 Telegram 通知 Workflow，簡化通知內容並調整觸發方式。
* 強化 Release Workflow：

  * 支援手動觸發 Release。
  * 根據 Conventional Commits 分析版本變更類型。
  * 增加變更偵測及版本計算邏輯。
  * 增加語意版本 Tag 重複檢查。
  * 優化版本發布流程與通知內容。
* 更新專案 README，補充 Vue 3、快速啟動方式、檔案結構及句庫格式說明。

## Testing

### 測試環境

* GitHub Actions
* 現代桌面瀏覽器
* Python 靜態 HTTP Server
* Node.js `http-server`

### 測試方法

* 確認專案可以直接開啟 `index.html`。
* 使用靜態 HTTP Server 啟動專案並確認頁面可以正常載入。
* 確認 Vue 3 Composition API 應用程式可以正常初始化。
* 確認句庫內容可以正常載入並顯示。
* 確認聊天訊息、使用者名稱、時間資訊及頭像可以正常呈現。
* 確認訊息內容經 HTML 過濾後仍可正常顯示。
* 確認頭像載入失敗時可以使用備援圖片。
* 確認 GitHub Actions Workflow 可以正常執行。
* 確認 Release 流程可以正確分析提交內容並計算版本變更。

### 測試結果

目前 `dev` 分支已成功累積並通過既有的 GitHub Actions 工作流程驗證；本 PR 主要為既有功能與自動化流程的整合與更新。

若未進行完整的所有瀏覽器與實機環境驗證，則以 GitHub Actions 及本地靜態伺服器測試結果作為主要驗證依據。

## Breaking Changes

無。

本次修改主要為既有功能的擴充、重構及自動化流程改善，不要求現有使用者修改使用方式。

專案仍可直接開啟 `index.html` 使用；若透過靜態伺服器執行，也不需要額外的建置流程。

## Related Issues

無。

## Additional Notes

* 本 PR 包含多個歷史提交，涵蓋前端 UI、內容資料、資源管理及 GitHub Actions Workflow。
* Release 流程現在能根據提交內容進行版本判定，因此後續提交訊息應持續遵循 Conventional Commits 規範。
* 由於專案採用 CDN 載入 Vue、Bulma、Font Awesome 等外部資源，離線環境可能無法完整載入所有 UI 功能。
* `public/saying.txt` 為主要句庫來源，後續若只需要更新顯示內容，可以直接修改句庫而不需要修改前端程式碼。
* Release 與自動合併相關 Workflow 涉及 GitHub Repository 權限與 Secrets，Reviewer 應特別確認相關權限設定符合最小權限原則。

<details>
<summary>Checklist</summary>

* [ ] 我已確認這個 PR 的目的與修改內容已清楚說明
* [ ] 我已確認程式碼與設定符合專案規範
* [ ] 我已自行 Review 此次變更
* [ ] 我已完成適當的本機測試
* [ ] 我已確認 GitHub Actions / CI 通過
* [ ] 我已確認 Release / Workflow 相關變更可以正常執行
* [ ] 我已確認前端頁面可以正常載入
* [ ] 我已確認句庫與聊天訊息可以正常顯示
* [ ] 我已確認沒有引入 Breaking Change，或已在上方明確說明
* [ ] 我已確認相關測試已新增或更新（如適用）
* [ ] 我已確認必要的文件已新增或更新（如適用）
* [ ] 我已確認沒有提交不必要的檔案、Debug code 或暫存內容
* [ ] 我已確認變更範圍與 PR 目的相符，沒有混入無關修改
* [ ] 我已確認 Commit Message 符合 Conventional Commits 規範
* [ ] 我已確認沒有洩漏密碼、Token、私密金鑰或其他敏感資訊
* [ ] 我已確認 Reviewer 可以根據 PR 說明理解這次變更

</details>

