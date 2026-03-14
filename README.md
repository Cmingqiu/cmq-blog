# CMQ Blog CMS（个人博客系统）

个人博客 CMS，支持 Markdown 写作、标签分类、搜索、评论（GitHub / Google 登录），并提供明亮 / 暗黑主题切换。  
项目强调 **代码质量、单元测试覆盖** 以及 **首屏性能（<= 3s）**。

---

## 功能一览

- **Markdown 写作**
  - 支持标题 + Markdown 正文编辑
  - 支持预览（与发布展示使用同一渲染管线）
  - 支持保存草稿、再次打开继续编辑
  - 发布后首页刷新即可看到新文章
- **标签分类 & 搜索**
  - 首页展示按时间倒序的已发布文章列表
  - 按标签过滤文章列表
  - 关键词搜索（标题 + 正文），无结果时有明确空状态
  - 搜索条件、标签过滤通过 URL 参数保持，返回时上下文不丢失
- **评论系统**
  - 文章详情页下方展示评论列表
  - 未登录用户可浏览评论，尝试提交时提示需要登录
  - 使用 GitHub / Google 登录后可发表评论，刷新页面评论仍可见
- **明亮 / 暗黑主题**
  - 全站可切换明亮 / 暗黑主题
  - 主题偏好通过 cookie 持久化，刷新或下次访问仍生效
  - 暗黑模式下 Markdown 内容（代码块、引用等）仍保持良好可读性

---

## 技术栈

- **框架**
  - Next.js 15（App Router，`src/app`）
  - React 19
  - TypeScript
- **认证 / 鉴权**
  - Auth.js / NextAuth（GitHub + Google Provider）
- **数据层**
  - SQLite（`better-sqlite3`）
  - 轻量 migrations（`src/server/db/schema.ts` + `migrate.ts`）
  - 仓储层（Post / Tag / Comment / UserIdentity repos）
- **Markdown & UI**
  - `react-markdown` + `remark-gfm`
  - 自定义 Markdown 渲染组件 `MarkdownContent`
  - 简洁直观的 Editor / Search / TagFilter / Comments / ThemeToggle 组件
- **测试 / 质量**
  - Vitest（单元测试、少量 integration 测试）
  - ESLint 9（Flat config，`eslint.config.mjs`）
  - GitHub Actions CI：`npm test` + `npm run lint` + `npm run build`
- **文章目录与写作页**（`specs/002-article-toc-editor`）：阅读页右侧 TOC、写作页 Markdown 编辑器与预览；依赖见 `package.json`（含可选 `@uiw/react-md-editor`）
- **其他**
  - Node.js 20+
  - 自建服务器部署（非 Vercel）

---

## 项目结构（核心部分）

```text
.
├── src/
│   ├── app/                 # Next.js App Router 路由 & 页面
│   │   ├── page.tsx         # 首页（列表 + 搜索 + 标签 + 主题切换）
│   │   ├── layout.tsx       # 全局布局（主题 & Auth Provider）
│   │   ├── editor/          # 写作页（新建 / 编辑）
│   │   ├── posts/           # 文章详情页
│   │   └── api/             # API 路由（posts / comments / auth）
│   ├── components/          # UI 组件（Editor / Search / Tags / Comments / Theme / Auth）
│   ├── server/              # 仅服务器可用模块（db / repos / auth / domain / search / comments）
│   └── lib/                 # 通用库（validation / markdown / search state / theme）
├── specs/001-blog-cms/      # 本功能的 spec / plan / research / data-model / tasks
├── tests/                   # 单元 & 集成测试
├── docs/deploy/self-host.md # 自建服务器部署说明
└── ...
```

---

## 本地运行

### 1. 环境准备

- 安装 **Node.js 20+**
- 克隆仓库后，在项目根目录执行依赖安装：

```bash
npm install
```

### 2. 配置环境变量

参考根目录的 `.env.example` 创建 `.env`：

```bash
cp .env.example .env
```

关键变量（根据需要填写）：

- `SQLITE_PATH`：SQLite 数据库文件路径，默认 `./data/app.db`
- `AUTH_SECRET`：Auth.js 会话密钥（必须是随机字符串）
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`

### 3. 初始化 & 开发模式

```bash
# 运行单元测试（确保基础逻辑正确）
npm test

# 代码检查
npm run lint

# 启动开发服务器（默认 http://localhost:3000）
npm run dev
```

开发时主要页面：

- 首页：`/`
- 新建文章：`/editor/new`
- 编辑文章：`/editor/[id]`
- 文章详情：`/posts/[id-or-slug]`

---

## 构建与自建服务器部署

### 1. 生产构建

```bash
npm run build
```

构建完成后，生成生产可运行的 `.next` 目录。

### 2. 启动生产服务

```bash
npm run start
```

在自建服务器上部署时，典型流程如下：

1. 在服务器上拉取代码或同步构建产物
2. 安装依赖：`npm ci`
3. 配置 `.env`（与本地一致，注意生产密钥安全）
4. 运行一次 `npm run build`
5. 使用进程管理工具（如 pm2 / systemd）运行 `npm run start`

更详细的部署说明（包含目录布局与环境建议）见：

- `docs/deploy/self-host.md`

---

## 测试策略（概览）

- **单元测试**
  - Markdown 渲染管线安全性（禁止原始 HTML 渲染）
  - 发布校验（标题 / 正文必填）
  - 仓储层状态变迁（草稿 → 发布）
  - 搜索查询 & 标签过滤 & 状态序列化
  - 评论鉴权 & 正文校验 & 顺序
  - 主题偏好归一化与 cookie 序列化
- **集成测试**
  - 发布文章后出现在“已发布列表”
  - 创建评论后在同一 post 评论列表中可见

所有变更必须配套单元测试并通过 `npm test`，这是项目宪章的硬性要求。  

