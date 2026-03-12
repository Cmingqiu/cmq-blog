# Routes Contract

**Branch**: `001-blog-cms`  
**Created**: 2026-03-12

## Public (Reader) Routes

- `/` 首页：按时间倒序展示已发布文章列表
  - 必须支持标签筛选入口与搜索入口
  - 发布成功后刷新首页应可看到新文章（规格要求）
- `/posts/[id-or-slug]` 文章详情：展示文章内容与评论
  - 评论列表可见；未登录用户看到“登录后评论”的提示与入口

## Author (Blogger/Admin) Routes

- `/editor/new` 新建文章
  - 支持 Markdown 编辑、预览、保存草稿、发布
- `/editor/[id]` 编辑文章（草稿或已发布）
  - 支持继续编辑、预览、保存草稿、（重新）发布

## Cross-cutting

- 主题切换：全站可用，明亮/暗黑；刷新后保持偏好

