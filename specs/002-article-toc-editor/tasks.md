# Tasks: 文章阅读与写作页面目录与编辑重构

**Input**: Design documents from `specs/002-article-toc-editor/`  
**Prerequisites**: `plan.md`、`spec.md`、`research.md`、`data-model.md`、`quickstart.md`

**Tests**: 所有功能性改动都必须包含单元测试。根据风险和范围，必要时补充集成测试。

**Organization**: 任务按 User Story 分组，保证每个故事都可以独立实现和测试。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件、无直接依赖）
- **[Story]**: 任务所属的用户故事（例如 US1, US2, US3）
- 每个任务描述中必须包含明确的文件路径

---

## Phase 1: Setup（共享基础环境）

**Purpose**: 确保本地开发环境与测试环境可用，仓库结构清晰。

- [ ] T001 确认并完善项目依赖安装说明，必要时在 `README.md` 补充本功能相关依赖说明  
- [ ] T002 在根目录执行并验证 `npm run lint` 和 `npm test`，确保基础工具链（ESLint + Vitest）正常工作  
- [ ] T003 [P] 在 `src/` 和 `tests/` 下为本功能预留目录结构（如 `src/app/...` 路由、`tests/unit` 与 `tests/integration` 子目录）  

---

## Phase 2: Foundational（阻塞前置能力）

**Purpose**: 支撑所有用户故事的核心基础设施与数据结构。

**⚠️ CRITICAL**: 完成本阶段之前，禁止开始任何 User Story 实现。

- [ ] T004 根据 `data-model.md` 在现有 SQLite 表结构中补充或确认文章字段（如 `status`、`slug`、`published_at`），更新相关建表/迁移代码（例如 `src/lib/db/*`）  
- [ ] T005 [P] 在 `src/lib/article`（或等效目录）中定义 `Article` 领域模型与数据访问辅助函数（读取已发布文章、按 slug/id 查询等）  
- [ ] T006 [P] 在 `src/lib/markdown` 中设计并预留 TOC 相关类型定义（如 `TocItem` 接口：id、text、level、href、index）  
- [ ] T007 在 `tests/unit` 中为数据访问与基础模型（读取已发布文章、根据状态过滤等）补充或创建基础单元测试文件  

**Checkpoint**: 数据模型与基础工具准备完毕，可以开始针对具体 User Story 的实现。

---

## Phase 3: User Story 1 - 阅读文章时通过右侧目录快速跳转 (Priority: P1) 🎯 MVP

**Goal**: 为文章详情页提供右侧目录，基于正文标题自动生成，并支持滚动联动和点击跳转。

**Independent Test**: 在仅修改阅读页的前提下，读者可以通过目录快速在长文中跳转和定位内容，且目录高亮准确反映当前阅读位置。

### Tests for User Story 1（REQUIRED）

- [ ] T008 [P] [US1] 在 `tests/unit` 中为 TOC 生成函数（如 `buildTocFromMarkdown`）编写单元测试，覆盖多级标题、多段文本等组合  
- [ ] T009 [P] [US1] 在 `tests/unit` 中为滚动定位/当前高亮计算逻辑编写单元测试（根据当前视窗标题判定应高亮的 `TocItem`）  
- [ ] T010 [P] [US1] 在 `tests/integration` 中新增阅读页集成测试，用假数据文章验证：页面加载后目录正确渲染，点击目录项能滚动到对应标题（可用 jsdom 或轻量端到端方案）  

### Implementation for User Story 1

- [ ] T011 [P] [US1] 在 `src/lib/markdown` 中实现 `buildTocFromMarkdown(markdown: string): TocItem[]` 或等效函数，基于 Markdown AST 或 `react-markdown` 插件生成 H1–H6 目录结构  
- [ ] T012 [P] [US1] 在 `src/components` 下创建 `ArticleToc` 组件，使用 TailwindCSS + shadcn/ui（如列表、滚动容器组件）实现树状目录渲染和当前项高亮样式  
- [ ] T013 [US1] 在文章详情页 route（例如 `src/app/.../[slug]/page.tsx`）中集成 TOC：从文章内容生成 `TocItem[]`，渲染到右侧区域，并保证在桌面端布局合理  
- [ ] T014 [US1] 在文章详情页中接入滚动联动逻辑（如使用 `IntersectionObserver` 或滚动监听），根据当前可见标题更新 `ArticleToc` 的高亮状态  
- [ ] T015 [US1] 在 `ArticleToc` 中实现目录点击滚动到正文对应位置的能力（处理锚点 id 和偏移量，避免标题被顶部固定栏遮挡）  
- [ ] T016 [US1] 调整阅读页在移动端的小屏布局：目录以折叠面板或 Tab 形式显示，确保目录仍可使用但不影响正文阅读  

**Checkpoint**: 阅读页右侧目录、联动高亮与点击滚动在桌面和移动端均可用，可独立交付为一版 MVP。

---

## Phase 4: User Story 2 - 写文章时在同一页面完成标题、内容编辑和实时预览 (Priority: P1)

**Goal**: 重构写文章页面，使作者可以在同一页面完成标题编辑、草稿/发布操作，以及左侧编辑 + 右侧预览的写作体验。

**Independent Test**: 即使不依赖阅读页目录功能，作者也可以从空白开始撰写文章，保存草稿或发布文章，并通过预览看到接近阅读端的展示效果。

### Tests for User Story 2（REQUIRED）

- [ ] T017 [P] [US2] 在 `tests/unit` 中为写作页面标题编辑与表单校验逻辑编写单元测试（例如标题必填、长度限制等）  
- [ ] T018 [P] [US2] 在 `tests/unit` 中为草稿/发布动作对应的数据更新逻辑编写单元测试（包括状态切换与时间字段更新）  
- [ ] T019 [P] [US2] 在 `tests/unit` 中为 Markdown 编辑器与预览之间的同步逻辑编写单元测试（输入变更后预览内容与 Markdown 字符串一致）  
- [ ] T020 [P] [US2] 在 `tests/integration` 中新增写作流程集成测试：从新建文章到保存草稿再到发布的完整路径  

### Implementation for User Story 2

- [ ] T021 [P] [US2] 在 `src/components` 下封装 Markdown 编辑器组件（如 `MarkdownEditor`），集成选定的第三方 Markdown 编辑库（例如 `@uiw/react-md-editor`），并统一导出为项目内可替换的组件  
- [ ] T022 [P] [US2] 在写作页 route（例如 `src/app/.../posts/new/page.tsx` 和 `src/app/.../posts/[id]/edit/page.tsx`）中实现顶部工具条：左侧标题输入框、右侧“草稿/发布”按钮，使用 shadcn/ui 按钮与输入组件  
- [ ] T023 [P] [US2] 在写作页下方实现左右布局容器组件：左侧挂载 `MarkdownEditor`，右侧挂载预览区域  
- [ ] T024 [P] [US2] 在预览区域复用或扩展 `MarkdownContent` 组件，保证其渲染效果与阅读页一致，为未来接入预览内目录预留扩展点  
- [ ] T025 [US2] 实现写作页状态管理：根据是否为新建/编辑加载对应 Article 数据，维护标题与 `content_markdown`，在保存/发布时调用数据访问层更新 SQLite  
- [ ] T026 [US2] 实现“保存草稿”行为：将文章保存为 `status='draft'` 并更新 `updated_at`，保存成功后在页面内显示成功反馈而不跳转  
- [ ] T027 [US2] 实现“发布”行为：进行必填字段校验（标题非空、内容非空等），将 `status` 更新为 `'published'` 并设置 `published_at`，失败时展示明确的错误提示  
- [ ] T028 [US2] 为已经发布的文章提供编辑入口与行为：确保编辑完成后更新数据并给出清晰提示（例如“已更新”），避免与草稿状态混淆  
- [ ] T029 [US2] 调整写作页在移动端的小屏布局（例如切换为上下布局或 Tab 切换编辑与预览），保证主要操作可用且不会严重影响输入体验  

**Checkpoint**: 写作页具备完整的标题编辑、草稿/发布和编辑+预览体验，可以独立作为创作端的可用版本。

---

## Phase 5: User Story 3 - 作者在写作时通过预览感知阅读侧目录和结构 (Priority: P2)

**Goal**: 让作者在写作页面的预览中看到与阅读页一致的结构信息（尤其是标题层级对应的目录），以便在创作阶段优化文章结构。

**Independent Test**: 在不访问阅读页的前提下，作者能通过预览中的标题层级与目录结构快速理解当前文章的大纲，并据此调整标题与内容层级。

### Tests for User Story 3（REQUIRED）

- [ ] T030 [P] [US3] 在 `tests/unit` 中为写作页预览端使用的 TOC 生成/解析逻辑编写单元测试，确保其与阅读页目录生成保持一致  
- [ ] T031 [P] [US3] 在 `tests/integration` 中新增写作页结构预览集成测试：编辑标题层级后，预览中的层级与样式应准确反映变化  

### Implementation for User Story 3

- [ ] T032 [P] [US3] 在写作页预览区域集成 `buildTocFromMarkdown` 或公共 TOC 工具，使预览侧也能生成 `TocItem[]` 结构  
- [ ] T033 [P] [US3] 复用或轻量包装 `ArticleToc` 组件，用于写作页右侧预览中的目录展示（可根据写作场景适当弱化样式但保持层级信息一致）  
- [ ] T034 [US3] 确保写作页预览使用与阅读页接近的排版样式（标题层级样式明显区分），使作者在浏览预览时就能感知文章整体结构  
- [ ] T035 [US3] 在写作页中针对频繁标题编辑场景优化预览刷新策略（例如使用节流/防抖或分段渲染），避免目录与预览在长文场景下出现明显卡顿或闪烁  

**Checkpoint**: 写作页预览在结构和目录层面与阅读页保持高度一致，作者可以在创作阶段优化文章结构。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 跨用户故事的整体完善与质量提升。

- [ ] T036 [P] 更新或补充 `docs/` 或相关文档，对阅读页目录与写作页重构的使用方法和限制进行说明  
- [ ] T037 代码清理与重构：消除重复逻辑（如 TOC 生成、滚动处理），提炼为可复用工具或组件，提升可维护性  
- [ ] T038 针对目录生成和预览刷新进行性能优化（必要时进行简单基准测试或 profile），确保长文场景下体验稳定  
- [ ] T039 [P] 在 `tests/unit` 中根据实际实现情况补充遗漏的单元测试用例，确保关键路径均有覆盖  
- [ ] T040 安全与鲁棒性检查：确认 Markdown 渲染链路中的安全性策略（例如跳过 HTML、链接处理）满足项目要求  
- [ ] T041 通读 UI，确保使用 TailwindCSS + shadcn/ui，避免内联样式与不一致的组件风格，并按 Web Interface Guidelines 检查可访问性（focus-visible、label、aria 等）  
- [ ] T042 参考 `quickstart.md` 执行一次从启动开发环境到运行测试与手动验收的完整流程，确认文档与实际行为一致  

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即开始  
- **Foundational (Phase 2)**: 依赖 Setup 完成，阻塞所有用户故事的实现  
- **User Stories (Phase 3+)**:  
  - 依赖 Foundational 完成后开始  
  - User Story 1（阅读页目录）为 P1 且是最小可交付 MVP，建议优先完成  
  - User Story 2 与 User Story 3 可以在 Foundational 完成后并行推进，但需注意写作页预览与阅读页目录的接口保持一致  
- **Polish (Phase 6)**: 依赖所有计划实现的用户故事完成

### User Story Dependencies

- **User Story 1 (P1)**: 基于文章与 Markdown 基础设施，无其他故事依赖，可单独交付。  
- **User Story 2 (P1)**: 基于 Article 模型与写作路由，可独立于目录存在，但推荐在 Foundational 完成后再开始。  
- **User Story 3 (P2)**: 推荐在 User Story 1 和 User Story 2 的主要结构完成后进行，以便复用 TOC 工具与预览组件。  

### Within Each User Story

- 优先编写并运行测试（确保在实现前测试失败）。  
- 优先实现基础工具和组件，再接入页面与交互逻辑。  
- 每个故事完成后，都应能独立部署/演示并通过对应测试。

### Parallel Opportunities

- 所有标记为 [P] 的任务可在团队内并行执行（前提是避免编辑同一文件产生冲突）。  
- Foundational 中的模型和工具类任务（如 T005, T006）可以并行完成。  
- 不同 User Story 的实现可由不同开发者并行推进，尤其是阅读页与写作页相对独立的部分。  
- 测试任务与实现任务可以交错进行，但建议优先保障测试脚手架到位。

