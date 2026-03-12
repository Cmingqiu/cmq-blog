# Research: Personal Blog CMS (Next.js + Self-host)

**Branch**: `001-blog-cms`  
**Created**: 2026-03-12  
**Purpose**: Resolve Technical Context unknowns and capture decisions with rationale and alternatives.

## Decision 1: Framework & Routing

**Decision**: 使用 Next.js App Router 作为全栈框架（页面 + Route Handlers + Server Actions 视需要使用）。  
**Rationale**: App Router 支持服务端渲染与数据缓存/再验证能力，适合“首页/详情首屏 \(<= 3s\)”目标；同仓全栈
开发与自建服务器部署路径清晰。  
**Alternatives considered**:
- Next.js Pages Router：生态成熟但新特性与缓存模型不如 App Router 一致
- 纯前后端分离：部署/鉴权/缓存链路更复杂，不符合“简洁直观 + 小步交付”

## Decision 2: Deployment Target

**Decision**: 部署到自建服务器（自托管 Node.js 运行时；可选容器化），用分环境部署做阶段验收。  
**Rationale**: 满足“部署到自己的服务器”的约束；仍可通过缓存、静态资源优化等手段达成首屏 \(<= 3s\)。  
**Alternatives considered**:
- Vercel：不满足部署约束

## Decision 3: Authentication for Comments (Social Login)

**Decision**: 评论登录使用 Auth.js（NextAuth）在 Next.js App Router 中集成，Provider 至少包含 GitHub + Google。  
**Rationale**: 规格要求“GitHub + 其他主流账号”；Auth.js 适配多 Provider，能统一会话与回调逻辑。  
**Alternatives considered**:
- 自实现 OAuth：安全风险与维护成本高
- 仅 GitHub：不满足规格

## Decision 4: Data Storage

**Decision**: 使用 SQLite 持久化 Post/Tag/Comment/UserIdentity。  
**Rationale**: 满足“自建服务器 + 简化运维”的诉求；SQLite 对单机部署友好且依然支持索引/关系约束，
可覆盖标签/搜索与评论一致性需求。  
**Alternatives considered**:
- 文件存储：草稿/发布一致性、查询与搜索成本较高
- 纯 KV：标签/搜索/关系处理复杂
- Postgres：能力更强但引入运维与部署复杂度，不作为当前默认

## Decision 5: Search Strategy (MVP → Iteration)

**Decision**: MVP 使用“标题+正文关键词”的数据库侧检索（精确/模糊匹配 + 分页），后续再升级全文检索能力。  
**Rationale**: 先满足“可用且可测”的检索；避免过早引入外部搜索服务导致测试不稳定。  
**Alternatives considered**:
- 直接引入外部搜索（例如托管搜索服务）：依赖外部可用性，单测更难隔离

## Decision 6: Markdown Rendering

**Decision**: Markdown 渲染在服务端完成（预览与发布展示走同一渲染管线），并对潜在不安全内容进行清理。  
**Rationale**: 规格强调“预览与发布一致”；服务端渲染便于一致性、可缓存、可测；内容安全是评论/内容系统底线。  
**Alternatives considered**:
- 客户端渲染：一致性与性能/SEO 风险更高

## Decision 7: Testing Strategy (Non‑negotiable)

**Decision**: 单元测试作为硬门禁，覆盖所有用户故事的核心逻辑；组件交互测试用于关键表单/流程；集成测试仅在跨层风险高时补充。  
**Rationale**: 宪章要求“所有功能变更必须包含单元测试且可重复运行”，因此测试设计必须避免依赖不稳定外部服务。  
**Alternatives considered**:
- 只做 E2E：反馈慢、定位难，且不满足“单元测试强制”

## Decision 8: Performance Strategy (First load <= 3s)

**Decision**: 关键页面采用服务端优先渲染 + 缓存/再验证策略；静态资源使用 Next.js 内建优化（字体自托管、图片优化等）。  
**Rationale**: 首屏目标需要控制关键渲染路径与资源体积；Next.js 提供缓存/再验证与资源优化手段，适配自托管部署。  
**Alternatives considered**:
- 全量 CSR：首屏与 SEO 风险更高

## Implementation Notes (to be used in Phase 1 design)

- Next.js 数据缓存/再验证：对“首页文章列表”采用可再验证缓存；发布文章后触发相关缓存失效/更新。
- 环境变量：服务端通过 `process.env.*` 读取；区分 dev/staging/prod（由部署流程提供环境标识）。
- Provider 配置：GitHub/Google 需要各自的 client id/secret 与统一的 AUTH_SECRET。

