# Implementation Plan: 优化博客 UI 与发布体验

**Branch**: `003-blog-ui-refresh` | **Date**: 2026-03-14 | **Spec**: `specs/003-blog-ui-refresh/spec.md`  
**Input**: Feature specification from `/specs/003-blog-ui-refresh/spec.md`

**Note**: 本实现计划由 `/speckit.plan` 命令生成，围绕发布后跳首页、错误与表单反馈、写作布局优化、首页视觉精简与绿色系品牌统一，以及登录头像下拉入口等能力做增量改造。

## Summary

本 Feature 将在现有 Next.js + TypeScript + SQLite 博客基础上，完成以下改动：

- 文章发布成功后自动跳转首页，并保证首页列表能及时展示新文章，避免用户对发布结果不确定。
- 加强写作页的表单校验与接口错误提示，在标题/正文缺失、接口失败或网络异常时给出可理解的即时反馈。
- 调整写作页面在桌面端的布局宽度与预览样式，使其更贴近阅读页，同时将顶部提示文案替换为返回首页箭头按钮。
- 精简首页 UI，移除线条风格及若干辅助入口，替换站点标题为绿色系 logo 与一致的 favicon，突出内容与品牌。
- 为已登录用户在首页顶部右侧提供头像入口及下拉浮层，包含「我的文章」与「退出」，串起个人内容管理主路径。

## Technical Context

**Language/Version**: TypeScript (Node.js LTS) + Next.js App Router（项目既有栈）  
**Primary Dependencies**: Next.js 15、React 19、TailwindCSS、better-sqlite3、shadcn/ui 组件体系、`react-markdown` + `remark-gfm`  
**Storage**: 本地 SQLite，通过 `better-sqlite3` 访问  
**Testing**: npm test（现有测试命令），需为新增/修改逻辑补充单元测试  
**Target Platform**: Web（桌面与移动浏览器），部署于 Node.js 运行环境  
**Project Type**: 内容管理类 Web 应用（博客 CMS）  
**Performance Goals**: 保持首页与写作页首屏加载 \(<= 3s\)；本改动不引入额外大体积依赖或阻塞渲染逻辑  
**Constraints**: 严格对齐宪章：TailwindCSS + shadcn/ui、neutral 视觉基调（避免大面积蓝/绿主色）、可访问性与清晰错误提示；保持改动小步可回退  
**Scale/Scope**: 单仓单应用，改动聚焦首页与写作页 UI、文章发布流与头像菜单，不引入额外子项目或后端服务

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **单元测试强制**：本 Feature 将为发布成功跳转、错误提示、头像下拉行为等关键路径补充或更新测试，确保变更可回归。
- ✅ **简洁直观的用户体验**：首页与写作页改动以减少干扰、突出主路径为目标，所有错误状态必须有可见、可理解且可操作的反馈。
- ✅ **性能预算（首屏 ≤ 3 秒）**：不引入重型前端依赖；绿色系 logo 和 favicon 采用轻量资源；UI 结构调整不增加关键路径阻塞。
- ⚠️ **UI 技术栈与设计规范**：必须继续使用 TailwindCSS + shadcn/ui，并在实现绿色系品牌时控制绿色使用范围，避免违背「neutral 基调、拒绝蓝/绿主色」——在设计与实现阶段需通过样式约束保证绿色主要作为 logo/点缀色而非全局主色。

结论：在遵守上述约束（特别是 logo 绿色使用范围与中性色基调控制）的前提下，当前计划整体符合宪章要求，可进入后续设计与实现规划。

## Project Structure

### Documentation (this feature)

```text
specs/003-blog-ui-refresh/
├── spec.md
├── plan.md              # 本文件（/speckit.plan 输出）
├── research.md          # Phase 0 输出（技术与设计决策）
├── data-model.md        # Phase 1 输出（文章与用户相关模型）
├── quickstart.md        # Phase 1 输出（如何本地运行与验证本 Feature）
├── contracts/           # Phase 1 输出（若需对外接口约定）
└── tasks.md             # Phase 2 输出（/speckit.tasks 生成）
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                 # 首页 UI 与文章列表（本 Feature 关键改动点）
│   ├── write/page.tsx           # 写作页面（发布、表单校验、布局相关改动）
│   └── api/
│       └── posts/route.ts       # 文章相关 API（发布错误与成功返回）
├── lib/
│   ├── article/                 # 文章领域逻辑与 DTO
│   └── markdown/                # markdown 渲染与 TOC 等
└── server/
    ├── auth/                    # 登录状态与头像所需用户信息
    └── db/                      # SQLite schema 与迁移

tests/
├── unit/                        # 文章发布、错误提示、头像菜单等单元测试
└── integration/                 # 首页与写作主流程的端到端/集成测试（若适用）
```

**Structure Decision**: 使用单一 Next.js 应用结构，在现有 `src/app` 路由与 `src/lib`、`src/server` 目录内做局部改造，不引入新的 package 或子应用；文档与设计产出集中在 `specs/003-blog-ui-refresh/` 目录，方便后续追踪与回溯。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
