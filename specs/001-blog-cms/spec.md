# Feature Specification: Personal Blog CMS (Markdown + Tags + Search + Comments)

**Feature Branch**: `001-blog-cms`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "我要做一个个人博客系统，支持Markdown写作，有标签分类功能，支持搜索，有评论系统，评论可使用github登录或其他主流账户；支持明亮和暗黑皮肤；写完之后可以预览，保存草稿；并且提交到服务端保存；在首页刷新就可以看到新的博客；"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Markdown 写作：草稿/预览/发布（Priority: P1）

作为博主，我希望能用 Markdown 写文章，支持保存草稿、预览效果，并能发布到服务端保存，
这样首页刷新后读者能立即看到最新文章。

**Why this priority**: 这是博客系统的核心价值；没有写作与发布就没有内容与后续功能。

**Independent Test**: 在全新站点中，完成“新建文章 → 写 Markdown → 预览 → 保存草稿 →
发布 → 回到首页刷新看到文章”的闭环即可验收。

**Acceptance Scenarios**:

1. **Given** 我是已登录的博主且进入写作页，**When** 我输入标题与 Markdown 正文并点击“预览”，
   **Then** 我能看到与发布后展示一致的渲染效果，并能返回继续编辑且内容不丢失
2. **Given** 我正在编辑文章，**When** 我点击“保存草稿”，**Then** 系统提示保存成功，
   草稿在再次进入编辑时可被加载并继续修改
3. **Given** 我有一篇草稿，**When** 我点击“发布”，**Then** 系统提示发布成功，
   且我返回首页并刷新后能在列表中看到该新文章
4. **Given** 发布时输入不完整（例如缺少标题或正文），**When** 我点击“发布”，
   **Then** 系统阻止发布并给出可操作的错误提示（指出缺少项）

---

### User Story 2 - 阅读与发现：标签分类与搜索（Priority: P2）

作为读者，我希望能在首页浏览文章，并通过标签分类与搜索快速找到感兴趣的内容，
这样我不需要逐页翻找。

**Why this priority**: 有内容后，读者需要高效发现与检索；这直接影响站点可用性与留存。

**Independent Test**: 在已存在多篇文章（含不同标签与关键词）的情况下，读者能通过“标签筛选”
与“搜索”分别找到预期文章，且结果可复现。

**Acceptance Scenarios**:

1. **Given** 首页存在带标签的文章列表，**When** 我点击某个标签，**Then** 列表仅显示包含该标签的文章
2. **Given** 我输入关键词进行搜索，**When** 我提交搜索，**Then** 结果列表仅包含匹配关键词的文章，
   且未匹配时显示明确的“无结果”状态与返回路径
3. **Given** 我正在标签筛选结果中，**When** 我清除筛选或返回首页，**Then** 我能回到完整文章列表
4. **Given** 我从搜索结果进入文章详情，**When** 我返回，**Then** 搜索条件与结果仍保持（不丢失上下文）

---

### User Story 3 - 评论系统：社交账号登录后发表评论（Priority: P3）

作为读者，我希望在文章下方发表评论，并能使用 GitHub 或其他主流账号登录后再评论，
这样评论身份可信且避免匿名垃圾信息。

**Why this priority**: 评论提升互动，但不应阻塞核心写作/阅读流程，因此排在 P3。

**Independent Test**: 在任意文章详情页，完成“登录 → 发表评论 → 刷新页面仍可见”的闭环，
并验证未登录状态的限制提示。

**Acceptance Scenarios**:

1. **Given** 我未登录且在文章详情页，**When** 我尝试发表评论，**Then** 系统提示需要登录并提供登录入口
2. **Given** 我通过 GitHub 登录成功，**When** 我提交一条评论，**Then** 评论出现在评论列表中并显示作者信息
3. **Given** 我已登录，**When** 我刷新页面，**Then** 我刚发布的评论仍可见且顺序一致
4. **Given** 评论内容为空或超过限制，**When** 我提交评论，**Then** 系统阻止提交并给出明确原因

---

[Add more user stories as needed, each with an assigned priority]

### User Story 4 - 体验偏好：明亮/暗黑皮肤切换（Priority: P3）

作为读者或博主，我希望可以在明亮与暗黑皮肤之间切换，并在下次访问时保持偏好，
这样在不同环境下阅读更舒适。

**Why this priority**: 提升体验但不影响核心功能；与评论同为体验增强项。

**Independent Test**: 在任意页面切换主题后刷新页面，仍保持所选主题；且不影响内容可读性。

**Acceptance Scenarios**:

1. **Given** 我在站点任意页面，**When** 我切换到暗黑皮肤，**Then** 页面立即切换并保持可读性
2. **Given** 我已切换主题，**When** 我刷新页面或重新打开站点，**Then** 主题偏好仍被保留并生效

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Markdown 内容包含代码块、表格、图片链接时的渲染与预览一致性如何保证？
- 草稿保存成功后网络中断，再次发布/保存会发生什么？用户能否恢复到最近一次保存内容？
- 搜索关键词为空、过长、包含特殊字符时如何处理并给出用户可理解的反馈？
- 同一篇文章被多次编辑与发布时，首页列表与详情页内容一致性如何保证？
- 评论系统遇到登录失败/授权取消/会话过期时如何提示并允许重试？
- 在暗黑主题下图片/代码块/引用块是否可读？对比度不足时如何处理？

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  Constitution alignment: Every implemented requirement MUST be covered by unit tests.
-->

### Functional Requirements

- **FR-001**: 系统 MUST 提供 Markdown 写作界面，支持输入标题、正文与标签
- **FR-002**: 系统 MUST 支持文章“预览”功能，预览渲染与发布后展示保持一致
- **FR-003**: 系统 MUST 支持将文章保存为草稿，并可再次进入继续编辑
- **FR-004**: 系统 MUST 支持将文章发布并持久化到服务端，发布成功后首页刷新可见
- **FR-005**: 系统 MUST 支持按标签对文章进行分类与筛选
- **FR-006**: 系统 MUST 提供搜索功能，用于根据关键词检索文章并展示结果/空结果状态
- **FR-007**: 系统 MUST 在文章详情页提供评论列表展示
- **FR-008**: 系统 MUST 支持用户使用 GitHub 登录后发表评论
- **FR-009**: 系统 MUST 支持至少一种除 GitHub 外的主流账号登录后发表评论（见 Assumptions）
- **FR-010**: 系统 MUST 支持明亮与暗黑皮肤切换，并持久化用户偏好
- **FR-011**: 系统 MUST 对关键输入做校验并提供可操作的错误提示（例如缺少标题/正文、评论为空）

*Example of marking unclear requirements:*

- （本规格避免实现细节；登录方式与存储方案在计划阶段确定。）

### Key Entities *(include if feature involves data)*

- **Post**: 文章；包含标题、Markdown 正文、渲染结果（可选）、状态（草稿/已发布）、
  标签集合、创建/更新时间、发布时刻
- **Tag**: 标签；用于分类与筛选；与 Post 为多对多关系
- **SearchQuery**: 搜索请求；包含关键词与筛选条件（如标签），以及分页（如适用）
- **Comment**: 评论；包含所属文章、作者标识、正文、创建时间、状态（可选：已发布/已隐藏）
- **UserIdentity**: 评论身份；包含第三方登录提供方（GitHub/其他）与对应用户标识、展示名（如适用）

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 博主可在 3 分钟内完成“新建文章 → 预览 → 保存草稿 → 发布”的闭环（首次使用亦可完成）
- **SC-002**: 关键页面（例如首页/文章详情）首次可交互时间在常见网络与设备条件下 \(<= 3s\)
- **SC-003**: 搜索在 1 秒内给出结果或“无结果”状态反馈（以用户感知为准）
- **SC-004**: 读者能在不登录的情况下完成阅读与搜索；仅在发表评论时需要登录

## Assumptions

- 站点存在“博主/管理员”与“读者”两类角色；写作/发布仅对博主开放，阅读/搜索对所有访问者开放。
- 评论必须登录后才能发布；未登录用户可浏览评论列表。
- “其他主流账户”默认包含至少一个提供方（例如 Google）；若后续业务要求不同，将在计划阶段调整。
- 文章发布后默认立即对外可见并出现在首页列表顶部（按时间倒序）。
