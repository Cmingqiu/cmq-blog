# 文章目录与写作页（002-article-toc-editor）

## 阅读页目录

- **入口**：文章详情页 `/posts/[id-or-slug]`，仅展示已发布文章（`status='published'`）。
- **行为**：根据正文 Markdown 中的 H1–H6 自动生成右侧目录；点击目录项平滑滚动到对应标题；滚动时当前标题在目录中高亮；桌面端右侧固定目录，移动端通过「目录」按钮展开/收起。
- **限制**：目录由 `buildTocFromMarkdown` 基于标题行解析生成，与正文渲染顺序一致；不支持在编辑器中手写锚点覆盖。

## 写作页

- **入口**：新建 `/editor/new`，编辑 `/editor/[id]`。
- **布局**：顶部左侧标题输入、右侧「保存草稿」「发布」；下方桌面端为左侧 Markdown 编辑器 + 右侧预览（含目录），移动端为编辑/预览 Tab 切换。
- **预览**：与阅读页共用 `MarkdownContent` 与 TOC 生成逻辑，保证结构一致。Markdown 编辑器使用 `@uiw/react-md-editor`，未加载时回退为普通文本框。
- **安全**：Markdown 渲染使用 `skipHtml`，不渲染原始 HTML；链接经 `defaultUrlTransform` 处理。

## 测试与验收

- 单元测试：`tests/unit/markdown/build-toc.test.ts`、`tests/unit/posts/post-repo-state.test.ts`。
- 按 `specs/002-article-toc-editor/quickstart.md` 启动开发服务器后，手动验证阅读页目录与写作页编辑/预览/草稿/发布流程。
