# Research: 文章阅读与写作页面目录与编辑重构

**Branch**: `002-article-toc-editor`  
**Date**: 2026-03-13  
**Related Spec**: `specs/002-article-toc-editor/spec.md`

本文件用于记录本功能在技术选型与实现方式上的关键决策、理由与备选方案，作为后续实现与评审的依据。

---

## 决策 1：内容格式与编辑模型（Markdown vs. 其它富文本格式）

- **Decision**: 继续以 **Markdown 字符串** 作为文章内容的主存储格式，写作页左侧使用支持 Markdown 的富文本/所见即所得编辑器，右侧使用现有 `MarkdownContent` 组件进行预览与目录生成。
- **Rationale**:
  - 现有前台渲染已经使用 `react-markdown` + `remark-gfm`，Markdown 生态成熟，改动成本低。
  - Markdown 与技术/博客类内容契合度高，便于作者通过简单语法表达层级与格式。
  - 保持后端与存储层简单（单字段字符串），避免引入复杂 HTML/JSON 文档结构带来的迁移成本。
- **Alternatives considered**:
  - **HTML 富文本存储**：编辑器与渲染更灵活，但需要额外的 XSS 防护与清洗，且与现有 Markdown 渲染管线不一致。
  - **基于 ProseMirror/Slate 的结构化 JSON 文档**：为未来复杂排版提供空间，但实现复杂度高且与当前项目规模不匹配。

---

## 决策 2：Markdown 编辑器库选择

- **Decision**: 选用 **主流的 React Markdown 编辑器库**（如 `@uiw/react-md-editor` 或类似方案），并在其基础上包一层本项目自己的编辑组件，未来可按需替换实现。
- **Rationale**:
  - 此类库提供成熟的 Markdown 编辑体验（工具栏、快捷键、语法高亮等），大幅减少自维护工作量。
  - 通过本地封装组件隔离第三方依赖，可在不破坏调用方的前提下替换底层库。
  - 与现有 `MarkdownContent` 组件能自然衔接（编辑结果即 Markdown 字符串）。
- **Alternatives considered**:
  - **纯 `<textarea>` + 手写快捷键**：实现简单但体验较弱，功能扩展成本高。
  - **富文本 HTML 编辑器（如 TipTap）**：体验更接近 Word，但与 Markdown 渲染链路不一致，需要内容格式转换。

---

## 决策 3：目录（TOC）生成策略

- **Decision**: 基于 **Markdown AST 或渲染后的 DOM 中的标题节点** 生成目录，优先采用与 `react-markdown` 集成良好的方案（例如使用 remark 插件或渲染时收集 heading 节点）。
- **Rationale**:
  - 使用 AST 可以在不依赖真实 DOM 的情况下得到结构化标题信息，便于测试与 SSR。
  - 与 `react-markdown` 的插件机制配合，可以避免重复解析 Markdown 文本。
  - 标题层级（H1–H6）在 AST 中自然可得，适合映射到目录缩进结构。
- **Alternatives considered**:
  - **运行时扫描 DOM（querySelectorAll('h1,h2,...')）**：实现简单，但依赖浏览器环境且对 SSR 不友好，测试难度更高。
  - **手动在编辑时维护目录数据结构**：需要在编辑器侧维护额外状态，逻辑更复杂且易与真实内容脱节。

---

## 决策 4：目录与正文的滚动联动方式

- **Decision**: 使用 **`IntersectionObserver` + 平滑滚动** 实现当前标题高亮与点击滚动，配合节流/去抖处理避免滚动事件抖动。
- **Rationale**:
  - `IntersectionObserver` 能在性能可控的前提下跟踪各标题在视窗中的可见性，是现代浏览器推荐方案。
  - 平滑滚动（如 `window.scrollTo({ behavior: 'smooth' })` 或容器内滚动）提供良好体验，符合“直观”的 UX 要求。
  - 易于编写单元测试与集成测试（可通过模拟滚动或可视区域判断当前高亮项）。
- **Alternatives considered**:
  - **纯滚动事件监听（`scroll`）+ 手动计算 offset**：实现灵活但更容易出错且性能开销相对更高。
  - **不做自动高亮，仅在点击时滚动**：实现简单但与规格中“联动高亮”目标不符。

---

## 决策 5：写作页面布局与响应式策略

- **Decision**: 桌面端采用 **顶部工具条 + 下方左右两栏布局**；移动端在较窄视口下切换为 **单列内容 + Tab/折叠切换编辑/预览/目录视图**。
- **Rationale**:
  - 桌面端保证标题、草稿/发布按钮与编辑/预览同时可见，提高创作效率。
  - 移动端受限于屏幕宽度，左右两栏会过于拥挤，将预览与目录放在 Tab 或折叠面板中是更常见且可用的模式。
  - 与规格中“移动端也要可用”的要求一致，并保留清晰的扩展空间（后续可引入更多视图）。
- **Alternatives considered**:
  - **移动端完全隐藏预览/目录**：开发简单，但与“写作时感知阅读体验”的目标不符。
  - **移动端仍强行左右布局**：可用性差，阅读和输入区域均过小。

---

## 决策 6：草稿与发布的状态建模

- **Decision**: 使用 **单一 Article 实体 + 状态字段（如 `status: 'draft' | 'published'`）** 表达草稿与已发布文章，而非单独的 Draft 表。
- **Rationale**:
  - 规格中草稿与已发布的差别主要体现在可见性与流程，不需要完全独立的存储结构即可满足需求。
  - 单表结构简化了查询与权限判断（同一行根据 status 决定是否对外展示）。
  - 便于后续在同一实体内扩展状态（例如 `archived`、`scheduled`）。
- **Alternatives considered**:
  - **单独 Draft 表 + Article 表**：适合复杂工作流（多版本、多人协作、审批）但与当前范围不匹配，增加实现与迁移成本。
  - **多版本历史表**：仅在引入审计/历史追溯需求时才有意义，当前不需要。

