<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  DOM要素またはページ全体をPNG / PDFでキャプチャするChrome拡張機能
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## 機能

- **要素ピッカー** — 任意の要素にホバーしてクリックするだけでキャプチャ
- **CSS / XPath セレクター** — セレクターで特定の要素をキャプチャ
- **領域キャプチャ** — ビューポート上でドラッグして選択した領域をキャプチャ
- **ビューポートキャプチャ** — 現在表示されている領域をスクリーンショット
- **フルページキャプチャ** — スクロールしながらページ全体をスクリーンショット
- **エクスポート** — PNGまたはPDFで保存、またはクリップボードにコピー

## インストール方法

### 方法 A — Chrome ウェブストア

[Chrome ウェブストア](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda)で **Chromeに追加** をクリックしてください。

### 方法 B — 手動インストール（デベロッパーモード）

1. **リポジトリをクローンします**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **Chrome拡張機能ページを開きます**
   アドレスバーに `chrome://extensions` を入力してください。

3. **デベロッパーモードを有効にします**
   右上の **デベロッパーモード** トグルをオンにします。

4. **拡張機能を読み込みます**
   **パッケージ化されていない拡張機能を読み込む** をクリックし、クローンしたフォルダを選択します。

5. **拡張機能をピン留めします**（任意）
   Chromeツールバーのパズルアイコンをクリックし、**DOM Capture** をピン留めすると便利です。

## 使い方

| 操作 | 方法 |
|------|------|
| 要素をキャプチャ | 拡張機能アイコンをクリック → **要素を選択** → ページ上の要素をクリック |
| セレクターでキャプチャ | 拡張機能アイコンをクリック → CSSまたはXPathセレクターを入力 → **キャプチャ** |
| 領域キャプチャ | 拡張機能アイコンをクリック → **領域** タブ → ドラッグして領域を選択 → **キャプチャ** |
| ビューポートキャプチャ | 拡張機能アイコンをクリック → **ビューポート** タブ → **キャプチャ** |
| フルページキャプチャ | 拡張機能アイコンをクリック → **フルページ** タブ → **キャプチャ** |
| ダウンロード | キャプチャ後、**ダウンロード** をクリック（PNGまたはPDF） |
| クリップボードにコピー | キャプチャ後、**コピー** をクリック（PNGのみ） |

## コントリビューション

コントリビューションは大歓迎です！

1. リポジトリをフォークします。
2. フィーチャーブランチを作成します: `git checkout -b feat/your-feature`
3. 変更をコミットします: `git commit -m "feat: describe your change"`
4. ブランチをプッシュします: `git push origin feat/your-feature`
5. `main` に対してPull Requestを開きます。

PRは一つの機能またはバグ修正に集中してください。

## 問題報告

バグを発見したり機能リクエストがある場合は、[Issueを開いて](https://github.com/nkwoo/dom-capture/issues/new)以下の情報をご記入ください：

- Chromeバージョン（`chrome://version`）
- 拡張機能バージョン（`chrome://extensions` で確認）
- 再現手順
- 期待される動作と実際の動作
- 該当する場合はスクリーンショットまたは録画

## ライセンス

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
