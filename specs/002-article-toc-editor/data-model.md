# Data Model: 文章阅读与写作页面目录与编辑重构

**Branch**: `002-article-toc-editor`  
**Date**: 2026-03-13  
**Related Spec**: `specs/002-article-toc-editor/spec.md`

本文件描述本功能涉及的核心领域实体、字段与关系，以及与草稿/发布流程和目录生成相关的状态建模。

---

## 1. Article（文章）

**描述**：对外展示或处于草稿状态的一篇文章，包含标题、正文内容以及状态等信息。

**建议字段**（对应 SQLite 表，可在现有文章表基础上扩展）：

- `id` (string/number)：文章唯一标识（如自增 ID 或 UUID）。  
- `title` (string)：文章标题，非空。  
- `slug` (string)：用于 URL 的唯一短标识（可由标题转换生成），需唯一索引。  
- `content_markdown` (string)：文章正文内容（Markdown 字符串）。  
- `status` (string)：文章状态，枚举：`'draft' | 'published'`（后续可扩展 `'archived'` 等）。  
- `author_id` (string/number)：作者标识（若已有用户系统，则关联到用户表；若暂时未建，则可为空或简单记录字符串）。  
- `published_at` (datetime, nullable)：文章发布时间，仅在 `status = 'published'` 时有值。  
- `created_at` (datetime)：创建时间。  
- `updated_at` (datetime)：最近一次保存时间（包括草稿与已发布编辑）。  

**约束与规则**：

- `title` 必须非空，发布前必须通过校验。  
- `slug` 在全局唯一，用于路由查找与 SEO。  
- `status = 'draft'` 的文章默认仅在管理端可见；`status = 'published'` 的文章可在前台阅读页展示。  
- 任意状态更新（包括从草稿发布、已发布后编辑）都需要更新 `updated_at`。  

---

## 2. Draft 视角（草稿）

**描述**：草稿在数据层不单独建表，而是 Article 的一种状态视角。

**建模方式**：

- 草稿 ≈ `Article` 实体中 `status = 'draft'` 的记录。  
- 写作页保存“草稿”时，仅更新对应 Article 行的 `content_markdown`、`title`、`status='draft'`、`updated_at` 等字段，不对外展示。  
- 发布操作将同一条记录的 `status` 更新为 `'published'`，并写入 `published_at`。  

**规则**：

- 同一篇文章在任意时刻只有一个当前版本，由 `status` 与时间字段描述其状态，不做多版本快照。  
- 如未来需要版本历史，可在此基础上扩展历史表，而无需改变当前接口。

---

## 3. TOCItem（目录项）

**描述**：文章中某个标题在目录中的一条记录，主要在前端运行时生成，用于渲染右侧目录与联动滚动，不必持久化到数据库。

**典型结构**（前端 TypeScript 接口）：

- `id` (string)：目录项唯一标识，可由标题文本与层级/顺序组合生成，用于 React key 与 DOM id。  
- `text` (string)：标题显示文本。  
- `level` (number)：标题层级（1–6，对应 H1–H6）。  
- `href` (string)：指向正文中对应位置的锚点（如 `#section-xxx`），用于点击滚动与跳转。  
- `index` (number)：在整篇文章中的顺序索引，用于排序与高亮逻辑。  

**来源与生命周期**：

- 来源于对 `content_markdown` 的解析（AST）或对渲染后 heading DOM 的扫描。  
- 在前端渲染阶段计算得到，保存在组件状态或 memo 中；不写入数据库。  
- 可在写作页面预览侧和阅读页各自独立生成，保证两侧目录结构一致。

---

## 4. 状态与流程概览

### 4.1 写作流程（Article 状态流转）

1. **新建文章草稿**  
   - 创建 Article 记录，`status = 'draft'`，`title`、`content_markdown` 初始值可能为空或简单模板。  
   - 写作页左侧编辑内容，右侧预览即时反映 Markdown 渲染效果和目录结构。  

2. **保存草稿**  
   - 用户点击“草稿”按钮：  
     - 校验标题等基础字段格式（可允许正文为空，但需根据业务需求决定）。  
     - 更新 Article 记录（`title`、`content_markdown`、`status='draft'`、`updated_at`）。  
     - 向用户反馈“草稿已保存”的结果状态。  

3. **发布文章**  
   - 用户点击“发布”按钮：  
     - 校验标题非空、正文有内容等必须条件。  
     - 更新 Article 记录：`status='published'`，写入 `published_at`（若此前为空）、更新 `updated_at`。  
     - 向用户反馈“发布成功”的状态，并确保前台阅读页可正常访问。  

4. **已发布文章再次编辑**  
   - 写作页读取已发布 Article，用户可修改标题与正文。  
   - 保存草稿：可选择仍将 `status` 设置为 `'draft'` 或保留 `'published'`（具体策略可在实现时明确）；本功能范围内推荐保持已发布状态下的编辑仍保持可见，但需要在 UI 中清晰提示变更已生效。  

### 4.2 阅读流程与目录

1. 阅读页根据路由中的 `slug` 或 `id` 加载 Article，前台仅展示 `status='published'` 的记录。  
2. 前端根据 `content_markdown` 解析出标题与正文，生成 `TOCItem[]` 并渲染右侧目录。  
3. 使用 `TOCItem.href` 与正文标题对应的锚点 id 完成点击跳转和平滑滚动；通过监听可见性实现当前阅读位置高亮。  

---

## 5. 与现有模型的关系

- 若仓库中已存在 Article/Posts 相关表结构，本设计优先**在现有结构上最小改动扩展**（例如增加 `status`、`slug`、`published_at` 字段），而非完全重建表。  
- 当前数据模型不引入新的持久化实体，仅增加字段与前端运行时结构（TOCItem），符合“避免不必要复杂度”的原则。

