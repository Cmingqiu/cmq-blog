# Implementation Plan: 文章阅读与写作页面目录与编辑重构

**Branch**: `002-article-toc-editor` \| **Date**: 2026-03-13 \| **Spec**: `specs/002-article-toc-editor/spec.md`  
**Input**: Feature specification from `specs/002-article-toc-editor/spec.md`

## Summary

本功能在现有 CMQ Blog CMS 的基础上，为文章详情页增加右侧基于标题自动生成的目录（支持高亮当前阅读位置与点击平滑滚动），并重构写文章页面：顶部左侧为可编辑标题、顶部右侧提供“草稿/发布”操作，下方采用左侧富文本编辑器 + 右侧实时预览的布局，桌面与移动端均需良好体验。技术上基于现有 Next.js + React + Tailwind 栈，继续使用 SQLite 作为存储，内容仍以 Markdown 为主，左侧采用主流 Markdown 富文本编辑库与自定义组件实现编辑，右侧复用现有 Markdown 渲染能力并增加目录生成与滚动联动逻辑。

## Technical Context

**Language/Version**: TypeScript (Node.js LTS)，Next.js 15，React 19  
**Primary Dependencies**: Next.js App Router、React、TailwindCSS、better-sqlite3、`react-markdown` + `remark-gfm`、计划引入的 Markdown 富文本编辑库（如 `@uiw/react-md-editor`）、shadcn/ui 组件体系（按宪章要求逐步引入或复用现有包装）  
**Storage**: 本地 SQLite 数据库，经由 `better-sqlite3` 访问  
**Testing**: Vitest（单元测试 & 简单集成测试），配合 Next.js 组件测试模式；ESLint 用于静态检查  
**Target Platform**: Node.js 运行环境（本地与云端，如 Vercel 等）+ 现代桌面与移动浏览器  
**Project Type**: Web 应用（Next.js 驱动的博客 CMS，含管理端与前台展示）  
**Performance Goals**: 满足宪章中“首屏加载 ≤ 3s”的总体预算；本功能内交互需保证目录点击至滚动完成通常 < 1s、写作页面预览刷新在常见输入频率下感知延迟不明显（控制在数百毫秒级别）；目录计算与预览渲染应在中长文场景下仍保持流畅  
**Constraints**: 遵循“质量与可维护性优先”“单元测试强制”原则，避免为单一功能引入过重框架或复杂架构；UI 必须基于 TailwindCSS + shadcn/ui 的设计体系，视觉基调保持 neutral；富文本编辑与目录逻辑应支持未来扩展（如更多格式或权限流）但不预先过度抽象  
**Scale/Scope**: 面向个人或小团队博客 CMS，读者规模在万级以内，写作者数量相对有限；文章数量可在数千篇量级；功能范围限定在“文章阅读页目录 + 写文章页面布局/交互重构”，不包含多角色审核流、多版本对比等大功能。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **UI 技术栈**：计划继续使用 TailwindCSS，并在本功能中优先选用/引入 shadcn/ui 组件或风格一致的封装组件，用于按钮、输入、布局等基础 UI，符合“TailwindCSS + shadcn/ui（neutral 基调）”的强制要求。  
- **用户体验**：阅读端通过右侧目录与平滑滚动减少长文定位成本，写作端简化为单页标题+正文+预览的直观布局，状态与错误反馈需清晰（例如草稿/发布成功、校验失败提示），符合“简洁直观的用户体验”。  
- **性能预算**：目录生成基于已有 Markdown 内容的结构化解析或 DOM 扫描，避免在客户端进行高复杂度运算；预览采用增量更新或合理频率刷新，保障不会阻塞输入，整体策略在设计与实现阶段会显式对照“首屏 ≤ 3s”与交互延迟要求。  
- **单元测试**：目录生成逻辑、滚动定位函数、写作页面核心交互（标题编辑、草稿/发布触发与状态流转）将配套 Vitest 测试用例，并纳入验收标准；不以“暂时不好测”为由跳过测试。

当前规划未发现与宪章原则直接冲突之处；如在后续设计/实现中需要偏离（例如为了某类富文本库的限制而破坏 UX 或性能预算），必须在 Complexity Tracking 中记录并在评审时讨论。

## Project Structure

### Documentation (this feature)

```text
specs/002-article-toc-editor/
├── plan.md              # 本文件（/speckit.plan 输出）
├── research.md          # Phase 0 输出：技术选型与决策记录
├── data-model.md        # Phase 1 输出：领域实体与状态建模
├── quickstart.md        # Phase 1 输出：本功能的开发/验收上手指引
├── contracts/           # Phase 1 输出：对外接口契约（当前为内部 UI 功能，可为空壳说明）
└── tasks.md             # Phase 2 输出（/speckit.tasks 生成，非本命令创建）
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js App Router 页面（含文章阅读页、写作页等）
├── components/          # 复用的 UI 组件（基于 TailwindCSS + shadcn/ui）
├── lib/
│   ├── markdown/        # Markdown 渲染与解析工具（已有 MarkdownContent 等）
│   ├── db/              # SQLite 访问与数据模型封装
│   └── theme/           # 主题与偏好设置（如深浅色）
└── ...                  # 其他与本功能无直接关系的模块

tests/
├── unit/                # 目录生成、滚动函数、组件单元测试
└── integration/         # 文章阅读/写作关键流程的集成测试（按需要补充）
```

**Structure Decision**: 继续采用单体 Next.js 应用结构，在现有 `src/app` 与 `src/lib` 基础上，为文章阅读与写作相关逻辑增加/扩展对应 route 段与 UI 组件；数据访问集中在 `lib/db` 一类模块内，通过单元与集成测试覆盖关键路径，无需拆分独立 backend/frontend 项目或额外子包。

## Complexity Tracking

> **仅在未来若有违反宪章的设计时使用，目前无需填写**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
|           |            |                                       |

# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

<!--
  Constitution alignment (UI):
  - UI MUST use TailwindCSS + shadcn/ui by default (neutral base, avoid blue/green primary look)
  - Must follow Web Interface Guidelines (a11y, focus-visible, form semantics, URL state, dark mode)
-->

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
