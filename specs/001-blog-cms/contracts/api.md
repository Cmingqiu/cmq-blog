# API Contract (Server-Side Interfaces)

**Branch**: `001-blog-cms`  
**Created**: 2026-03-12

## Error/Validation Contract (shared)

**Principles**:
- 输入不合法必须阻止动作并提供可操作提示（指出缺少/不合法字段）
- 服务端错误必须给出稳定的错误码与用户可读信息（避免“神秘失败”）

**Standard shape (conceptual)**:
- `ok`: boolean
- `error`: `{ code: string, message: string, field?: string }` (when `ok=false`)

## Posts

### Create/Save Draft

**Intent**: 保存文章为草稿（可重复保存）。

**Inputs**:
- `title` (optional for draft, but recommended)
- `bodyMarkdown` (optional for draft, but recommended)
- `tags` (optional)

**Behavior**:
- 未登录：拒绝
- 成功：返回 post 标识与当前状态 `draft`

### Publish Post

**Intent**: 发布文章并对读者可见。

**Inputs**:
- `postId`
- `title` (required)
- `bodyMarkdown` (required)
- `tags` (optional)

**Validation errors**:
- 缺少标题：`VALIDATION_REQUIRED_TITLE`
- 缺少正文：`VALIDATION_REQUIRED_BODY`

**Behavior**:
- 成功：状态变为 `published`，并触发首页/详情可见性更新（缓存/再验证策略由实现保证）

## Search

### Search Posts

**Inputs**:
- `q` 关键词（允许为空但应给出提示/空策略）
- `tag` 可选
- `page`/`pageSize` 可选

**Behavior**:
- 返回匹配文章列表与总数（如实现采用分页）
- 无匹配：返回空列表 + 明确无结果状态

## Comments

### Create Comment

**Inputs**:
- `postId`
- `body` (required)

**Validation errors**:
- 未登录：`AUTH_REQUIRED`
- 正文为空：`VALIDATION_REQUIRED_COMMENT`

**Behavior**:
- 成功：评论出现在列表中；刷新页面仍可见

