<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  将DOM元素或整个页面捕获为PNG / PDF的Chrome扩展程序
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## 功能

- **元素选取器** — 悬停在任意元素上并点击即可捕获
- **CSS / XPath 选择器** — 通过选择器捕获特定元素
- **视口捕获** — 截取当前可见区域
- **整页捕获** — 滚动拼接截取整个页面
- **导出** — 保存为PNG或PDF，或复制到剪贴板

## 安装方法

### 方法 A — Chrome 网上应用店

在 [Chrome 网上应用店](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda) 中点击 **添加至 Chrome**。

### 方法 B — 手动安装（开发者模式）

1. **克隆仓库**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **打开Chrome扩展程序页面**
   在地址栏输入 `chrome://extensions`。

3. **开启开发者模式**
   点击右上角的 **开发者模式** 开关。

4. **加载扩展程序**
   点击 **加载已解压的扩展程序**，选择克隆的文件夹。

5. **固定扩展程序**（可选）
   点击Chrome工具栏的拼图图标，固定 **DOM Capture** 以便快速访问。

## 使用方法

| 操作 | 方法 |
|------|------|
| 捕获元素 | 点击扩展图标 → **选取元素** → 点击页面上的元素 |
| 通过选择器捕获 | 点击扩展图标 → 输入CSS或XPath选择器 → **捕获** |
| 视口捕获 | 点击扩展图标 → **视口** 标签 → **捕获** |
| 整页捕获 | 点击扩展图标 → **整页** 标签 → **捕获** |
| 下载 | 捕获后点击 **下载**（PNG或PDF） |
| 复制到剪贴板 | 捕获后点击 **复制**（仅PNG） |

## 贡献

欢迎贡献代码！

1. Fork本仓库。
2. 创建功能分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m "feat: describe your change"`
4. 推送分支：`git push origin feat/your-feature`
5. 向 `main` 分支发起Pull Request。

请保持每个PR专注于一个功能或修复。

## 问题反馈

发现了Bug或有功能建议？[提交Issue](../../issues/new) 并包含以下信息：

- Chrome版本（`chrome://version`）
- 扩展程序版本（在 `chrome://extensions` 中查看）
- 复现步骤
- 预期行为与实际行为
- 适用时附上截图或录屏

## 许可证

[MIT](../LICENSE)
