# Data Model: Personal Blog CMS

**Branch**: `001-blog-cms`  
**Created**: 2026-03-12  
**Source**: `specs/001-blog-cms/spec.md`

## Entity: Post

**Purpose**: 表示一篇博客文章（草稿或已发布）。

**Core fields**:
- `id`: 唯一标识
- `title`: 标题（必填，非空）
- `bodyMarkdown`: Markdown 正文（必填，非空）
- `status`: `draft` | `published`
- `publishedAt`: 发布时间（仅 `published` 时存在）
- `createdAt` / `updatedAt`

**Relationships**:
- Post ↔ Tag: 多对多
- Post → Comment: 一对多

**Validation rules**:
- 发布前必须满足：`title` 非空、`bodyMarkdown` 非空
- 草稿允许未发布但仍需保存可恢复

**State transitions**:
- `draft` → `published`（发布动作）
- `published` → `published`（再次发布/更新内容：规格允许多次编辑发布；需要保证列表与详情一致性）

## Entity: Tag

**Purpose**: 用于文章分类与筛选。

**Core fields**:
- `id`
- `name`: 标签名（必填，推荐唯一）
- `createdAt`

**Relationships**:
- Tag ↔ Post: 多对多

**Validation rules**:
- 标签名非空

## Entity: Comment

**Purpose**: 文章下的用户评论（需登录后发布）。

**Core fields**:
- `id`
- `postId`
- `authorIdentityId`
- `body`: 评论正文（必填，非空；长度上限在实现阶段定义）
- `status`: `published`（MVP）| `hidden`（可选：后续治理/反垃圾）
- `createdAt`

**Relationships**:
- Comment → Post: 多对一
- Comment → UserIdentity: 多对一

**Validation rules**:
- 未登录不得创建评论
- 评论正文非空

## Entity: UserIdentity

**Purpose**: 评论身份（第三方登录映射）。

**Core fields**:
- `id`
- `provider`: `github` | `google` | `other`
- `providerAccountId`: 第三方账号 id（provider 内唯一）
- `displayName`: 展示名（可选）
- `avatarUrl`: 头像链接（可选）
- `createdAt`

**Relationships**:
- UserIdentity → Comment: 一对多

**Validation rules**:
- `(provider, providerAccountId)` 组合唯一

## Value Object: SearchQuery

**Purpose**: 表示一次搜索/筛选请求（非持久化实体）。

**Fields**:
- `q`: 关键词（允许为空但应给出用户提示/空结果策略）
- `tag`: 可选标签筛选
- `page` / `pageSize`: 分页（可选；MVP 可先固定策略）

