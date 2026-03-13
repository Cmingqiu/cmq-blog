# Quickstart: 文章阅读与写作页面目录与编辑重构

**Branch**: `002-article-toc-editor`  
**Spec**: `specs/002-article-toc-editor/spec.md`  
**Plan**: `specs/002-article-toc-editor/plan.md`

本指引帮助开发者快速了解如何在本仓库中开发、运行与验收“文章阅读页目录 + 写作页重构”功能。

---

## 1. 环境准备

1. 安装 Node.js（推荐 LTS 版本）。  
2. 在仓库根目录安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 在浏览器中访问本地地址（通常为 `http://localhost:3000`），找到文章阅读页和写作页对应的路由（例如 `/posts/[slug]` 与 `/admin/posts/new` 或类似路径，具体以实际路由为准）。

---

## 2. 代码落点建议

- **文章阅读页目录**  
  - 入口：`src/app/...` 中文章详情页的 route（通常包含 `slug` 或 `id` 参数）。  
  - 公共逻辑：在 `src/lib/markdown` 或新的 `src/lib/article` 模块中添加 Markdown 解析和 TOC 生成工具（例如 `buildTocFromMarkdown(markdown: string): TocItem[]`）。  
  - UI 组件：在 `src/components` 下创建目录组件（如 `ArticleToc`），基于 TailwindCSS + shadcn/ui（List、ScrollArea 等）实现树状目录与高亮状态。

- **写文章页面重构**  
  - 入口：`src/app/...` 下的文章编辑/新建页面 route。  
  - 布局：采用顶部工具条（标题输入 + 草稿/发布按钮）+ 下方左右两栏（左侧编辑器、右侧预览）的布局组件。  
  - 编辑器：在 `src/components` 下创建包装好的 Markdown 编辑器组件（如 `MarkdownEditor`），内部集成选定的第三方编辑器库。  
  - 预览：复用或扩展 `MarkdownContent` 组件，增加可选的目录显示与滚动联动逻辑，以便在写作页预览中看到文章结构。

---

## 3. 运行与调试

1. 启动开发服务器后，在浏览器中打开写文章页面：  
   - 验证顶部标题输入区与草稿/发布按钮是否按规格显示。  
   - 在左侧编辑器输入 Markdown 内容，确认右侧预览实时更新、格式正确。  
2. 打开任意已发布文章的阅读页：  
   - 确认右侧出现基于标题生成的目录，点击目录项能平滑滚动到对应位置。  
   - 滚动正文时，观察目录中高亮项是否随当前阅读位置变化。

如遇问题，可在浏览器开发者工具中查看网络请求、控制台日志与样式冲突；必要时为 TOC 计算与滚动逻辑添加单元测试辅助调试。

---

## 4. 测试与验收

1. 运行全部单元测试：

```bash
npm test
```

2. 对本功能建议新增的测试包括（放在 `tests/unit` 或 `tests/integration` 下）：
   - 目录生成函数在不同 Markdown 标题组合下输出正确的层级与文本。  
   - 滚动定位逻辑在给定当前标题时能计算出正确的高亮项。  
   - 写作页面在保存草稿/发布时触发正确的状态更新与错误提示。  

3. 按 `specs/002-article-toc-editor/spec.md` 中的 User Stories 和 Success Criteria 进行手动验收，确保：  
   - 阅读页目录在长文场景下仍然可用；  
   - 写作页在桌面与移动端均具备良好体验；  
   - 关键交互有清晰的用户反馈。

---

## 5. 注意事项

- 遵循项目宪章：所有新增逻辑必须有相应单元测试，UI 需使用 TailwindCSS + shadcn/ui 体系，避免与现有风格冲突。  
- 避免过度工程化：在不影响可维护性的前提下，优先选择简单直接的实现方案，并在需要扩展时通过后续 feature 迭代实现。  
- 如需调整规格范围（例如引入版本历史或复杂权限），请先更新对应 `spec.md` 与 `data-model.md`，再进入新的规划与实现流程。

