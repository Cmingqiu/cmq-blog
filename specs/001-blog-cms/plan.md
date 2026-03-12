# Implementation Plan: Personal Blog CMS (Next.js + Self-host)

**Branch**: `001-blog-cms` | **Date**: 2026-03-12 | **Spec**: `D:\my_test\cmq-blog\specs\001-blog-cms\spec.md`
**Input**: Feature specification from `/specs/001-blog-cms/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

构建一个个人博客 CMS：支持 Markdown 写作（预览/草稿/发布）、标签分类、搜索、评论（GitHub + 其他主流账号登录）、
明暗主题切换。采用 Next.js 全栈形态开发并部署到自建服务器，确保“所有功能均有单元测试”且关键页面首屏加载 \(<= 3s\)。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript（Node.js LTS；具体版本在实现阶段锁定）  
**Primary Dependencies**: Next.js App Router（版本在实现阶段锁定；默认不绑定特定 bundler）  
**Storage**: SQLite（本地文件数据库，适配自建服务器与单机部署）  
**Testing**: 单元测试强制；组件交互测试用于关键流程；集成测试按需  
**Target Platform**: 自建服务器（Node.js 运行时；可选容器化部署）  
**Project Type**: Fullstack application（Next.js：页面 + 服务器路由 + 数据访问）  
**Performance Goals**: 关键页面首屏加载 \(<= 3s\)；搜索反馈 \(<= 1s\)（用户感知）  
**Constraints**: 所有功能变更必须配套单元测试；不依赖不稳定外部资源的测试；小步变更可回退  
**Scale/Scope**: 单站点个人博客；读者匿名可读/可搜；评论需登录；博主写作发布需登录

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate 1 - 单元测试强制**：设计必须拆分为可单元测试的模块；每个用户故事都必须明确单元测试范围与策略
- **Gate 2 - 性能预算**：首屏 \(<= 3s\) 需要在架构上具备可验证路径（渲染策略/缓存/资源体积控制）
- **Gate 3 - 简洁直观 UX**：写作→预览→草稿→发布、阅读→标签/搜索→详情、评论登录→发表的主路径必须最短且反馈明确
- **Gate 4 - 小步可回退**：核心能力按用户故事切片交付；任何跨层变更需要明确回退方案
- **Gate 5 - 评审门禁**：PR 必须包含测试说明与（如涉及）性能影响说明

## Project Structure

### Documentation (this feature)

```text
specs/001-blog-cms/
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
src/
├── app/                 # Next.js App Router (routes + layouts)
├── components/          # UI components
├── lib/                 # pure helpers (Markdown, search, validation, etc.)
├── server/              # server-only modules (data access, auth, services)
└── styles/

tests/
├── unit/                # required: unit tests for all stories
└── integration/         # optional: cross-layer tests (only when needed)

specs/                   # feature specs (this repo)
```

**Structure Decision**: 单仓库 Next.js 全栈应用；以 `src/app` 承载路由与页面，
以 `src/server` 隔离 server-only 逻辑，保证核心业务可在 `tests/unit` 中稳定单测。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
