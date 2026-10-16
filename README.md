# Whosis-Sayings

Whosis-Sayings 是一個以聊天室形式呈現隨機語錄的靜態網頁。頁面載入後立即顯示一則訊息，接著每 10 秒從句庫隨機抽取一則；畫面最多保留最近 30 則。

## 功能

- 使用 Vue 3 Composition API（透過 CDN 載入），不需要建置工具或套件安裝。
- 以左右兩側的訊息泡泡、使用者名稱、頭像和相對時間呈現語錄，並支援窄螢幕版面。
- 使用本地 WebP 頭像；未知帳號或頭像載入失敗時會顯示預設頭像。
- 訊息支援粗體、斜體、刪除線和換行等基本格式；其他 HTML 標籤會以純文字顯示。

## 開始使用

請在專案根目錄啟動靜態 HTTP 伺服器，再以瀏覽器開啟 `http://localhost:8000`。透過 HTTP 載入可讓瀏覽器正常讀取句庫檔案。

```bash
python -m http.server 8000
```

也可以使用 Node.js 的 `http-server`：

```bash
npx http-server -c-1
```

本專案透過 CDN 載入 Vue、Bulma、Font Awesome 與 Rubik 字型，因此瀏覽器需要網路連線才能載入這些外部資源。

## 編輯句庫

修改 `public/saying.txt` 即可新增或更新訊息。每筆資料格式如下：

```text
帳號,訊息內容;
```

以分號 `;` 分隔不同資料；訊息內容可以包含逗號、換行和以下 HTML 格式標籤：`<b>`、`<strong>`、`<i>`、`<em>`、`<del>`、`<br>`。例如：

```text
cloverdefa,大家好！;
samwumobile,<strong>粗體文字</strong>，也可以換行
第二行內容！;
```

逗號後的內容會作為訊息全文，因此訊息本身可以有逗號。若帳號不在使用者清單中，顯示名稱會使用帳號文字，頭像則採用預設圖片。修改句庫後重新載入網頁即可看到更新。

## 專案檔案

```text
.
├── index.html                 # 聊天介面與樣式
├── public/
│   ├── main.js                # Vue 應用程式、句庫載入與訊息呈現
│   ├── saying.txt             # 語錄資料
│   └── icons/                 # 使用者頭像與預設頭像
└── .github/workflows/
    ├── auto-merge.yml         # 指定分支間的 PR 自動合併
    ├── release.yml            # 自動或手動建立 GitHub Release
    └── telegram.yml           # Release 成功後傳送 Telegram 通知
```

## GitHub Actions

- **自動合併**：符合條件的同一儲存庫 PR 會自動合併：`dev` → `test`，以及 `test` → `main`。Draft PR 不會觸發合併。
- **Release**：`test` 合併至 `main` 後，工作流程會依提交內容判斷是否發布及版本類型；也可以在 GitHub Actions 手動選擇 patch、minor 或 major 發布。
- **Telegram 通知**：Release 成功後，工作流程會將版本及提交資訊傳送至設定的 Telegram 群組。

自動合併與 Telegram 通知需在 GitHub 儲存庫設定相應的 Secrets 與權限，詳情請參考 `.github/workflows/` 中的工作流程設定。

## 授權

本專案以 MIT License 授權，詳見 [LICENSE.md](LICENSE.md)。
