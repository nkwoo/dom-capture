<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  將DOM元素或整個頁面擷取為PNG / PDF的Chrome擴充功能
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## 功能

- **元素選取器** — 滑鼠懸停在任意元素上並點擊即可擷取
- **CSS / XPath 選擇器** — 透過選擇器擷取特定元素
- **視口擷取** — 截取目前可見區域
- **整頁擷取** — 捲動拼接截取整個頁面
- **匯出** — 儲存為PNG或PDF，或複製到剪貼簿

## 安裝方式

### 方式 A — Chrome 線上應用程式商店

在 [Chrome 線上應用程式商店](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda) 中點擊 **新增至 Chrome**。

### 方式 B — 手動安裝（開發人員模式）

1. **複製儲存庫**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **開啟Chrome擴充功能頁面**
   在網址列輸入 `chrome://extensions`。

3. **開啟開發人員模式**
   點擊右上角的 **開發人員模式** 切換開關。

4. **載入擴充功能**
   點擊 **載入未封裝項目**，選取複製的資料夾。

5. **釘選擴充功能**（選用）
   點擊Chrome工具列的拼圖圖示，釘選 **DOM Capture** 以便快速存取。

## 使用方式

| 操作 | 方法 |
|------|------|
| 擷取元素 | 點擊擴充功能圖示 → **選取元素** → 點擊頁面上的元素 |
| 透過選擇器擷取 | 點擊擴充功能圖示 → 輸入CSS或XPath選擇器 → **擷取** |
| 視口擷取 | 點擊擴充功能圖示 → **視口** 標籤 → **擷取** |
| 整頁擷取 | 點擊擴充功能圖示 → **整頁** 標籤 → **擷取** |
| 下載 | 擷取後點擊 **下載**（PNG或PDF） |
| 複製到剪貼簿 | 擷取後點擊 **複製**（僅PNG） |

## 貢獻

歡迎貢獻！

1. Fork本儲存庫。
2. 建立功能分支：`git checkout -b feat/your-feature`
3. 提交變更：`git commit -m "feat: describe your change"`
4. 推送分支：`git push origin feat/your-feature`
5. 向 `main` 分支開啟Pull Request。

請讓每個PR專注於一個功能或修復。

## 問題回報

發現了Bug或有功能建議？[提交Issue](https://github.com/nkwoo/dom-capture/issues/new) 並包含以下資訊：

- Chrome版本（`chrome://version`）
- 擴充功能版本（在 `chrome://extensions` 中查看）
- 重現步驟
- 預期行為與實際行為
- 適用時附上截圖或錄影

## 授權

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
