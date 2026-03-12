# Tasks: Personal Blog CMS (Next.js + Self-host + SQLite)

**Input**: Design documents from `/specs/001-blog-cms/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Unit tests are REQUIRED for all feature work. Add contract/integration/e2e tests when needed by scope or risk.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single app**: `src/`, `tests/` at repository root
- Paths below follow the structure decision in `specs/001-blog-cms/plan.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 初始化 Next.js 全栈项目、测试基建与本地运行方式（自建服务器部署前提）

- [x] T001 Initialize Next.js + TypeScript app in repository root (create `package.json`, `src/app/`, `src/components/`, `src/server/`, `src/lib/`, `src/styles/`)
- [x] T002 [P] Add base environment files and documentation (`.env.example`, update `specs/001-blog-cms/quickstart.md` preconditions section if needed)
- [x] T003 [P] Configure linting/formatting for TypeScript (`.eslintrc*` / `eslint.config.*`, `prettier` if used)
- [x] T004 Configure test runner for unit tests (create `tests/unit/` and ensure `npm test` runs in CI/local)
- [x] T005 [P] Add minimal CI workflow for lint + unit tests (e.g. `.github/workflows/ci.yml`)
- [x] T006 Add local dev scripts in `package.json` (dev, build, start, test, lint) and verify they run

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 数据访问、鉴权与核心跨模块能力（必须先完成，才可做任何用户故事）

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement SQLite database connection + migrations strategy in `src/server/db/` (single source of truth for schema)
- [x] T008 [P] Define core types for entities in `src/server/domain/` (Post/Tag/Comment/UserIdentity) aligned with `specs/001-blog-cms/data-model.md`
- [x] T009 Implement data access layer (repositories) in `src/server/repos/` for Post/Tag/Comment/UserIdentity
- [x] T010 Implement Markdown render pipeline (shared) in `src/lib/markdown/` ensuring preview and published display use the same rendering function
- [x] T011 Implement input validation helpers in `src/lib/validation/` (required fields, length limits) and standard error mapping aligned with `specs/001-blog-cms/contracts/api.md`
- [x] T012 Implement authentication integration (Auth.js) in `src/server/auth/` with providers GitHub + Google (callbacks + session access)
- [x] T013 Add route protection helpers in `src/server/auth/guards.ts` (author-only editor routes; comment requires login)
- [x] T014 [P] Add theme preference persistence helper in `src/lib/theme/` (store/read preference; implementation detail decided in code)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Markdown 写作：草稿/预览/发布 (Priority: P1) MVP

**Goal**: 博主完成“新建 → 编辑 Markdown → 预览 → 保存草稿 → 发布 → 首页可见”的闭环

**Independent Test**: Follow `specs/001-blog-cms/quickstart.md` → User Story 1 Acceptance

### Tests for User Story 1 (REQUIRED: include unit tests) ⚠️

> **NOTE: Prefer writing tests first; ensure they fail before implementation**

- [x] T015 [P] [US1] Unit test: publish validation (title/body required) in `tests/unit/posts/publish-validation.test.ts`
- [x] T016 [P] [US1] Unit test: markdown render pipeline used by preview & publish in `tests/unit/markdown/render-pipeline.test.ts`
- [x] T017 [P] [US1] Unit test: post repository save draft vs publish state transition in `tests/unit/posts/post-repo-state.test.ts`

### Implementation for User Story 1

- [x] T018 [P] [US1] Create editor UI route `/editor/new` in `src/app/editor/new/page.tsx`
- [x] T019 [P] [US1] Create editor UI route `/editor/[id]` in `src/app/editor/[id]/page.tsx`
- [x] T020 [P] [US1] Create editor components (markdown editor, preview pane, tags input) in `src/components/editor/`
- [x] T021 [US1] Implement server actions / route handlers for draft save + publish in `src/app/api/posts/route.ts` (or `src/server/posts/` + wired endpoints)
- [x] T022 [US1] Implement preview behavior using shared render pipeline (no persistence required) in `src/server/posts/preview.ts` and wire to UI
- [x] T023 [US1] Implement home page list to show published posts (descending by time) in `src/app/page.tsx`
- [x] T024 [US1] Implement post detail page to render published markdown in `src/app/posts/[id-or-slug]/page.tsx`
- [x] T025 [US1] Add user-facing error states and actionable messages for missing title/body in editor UI

**Checkpoint**: User Story 1 is fully functional and independently testable

---

## Phase 4: User Story 2 - 阅读与发现：标签分类与搜索 (Priority: P2)

**Goal**: 读者可按标签筛选与关键词搜索文章，并在返回时保持上下文

**Independent Test**: Follow `specs/001-blog-cms/quickstart.md` → User Story 2 Acceptance

### Tests for User Story 2 (REQUIRED: include unit tests) ⚠️

- [x] T026 [P] [US2] Unit test: search query parsing and normalization in `tests/unit/search/query-parse.test.ts`
- [x] T027 [P] [US2] Unit test: tag filter composition in `tests/unit/search/tag-filter.test.ts`
- [x] T028 [P] [US2] Unit test: empty result state decision in `tests/unit/search/empty-state.test.ts`

### Implementation for User Story 2

- [x] T029 [P] [US2] Add tag model/repo behaviors needed for filtering in `src/server/repos/tagRepo.ts`
- [x] T030 [US2] Implement search service against SQLite (title/body) in `src/server/search/searchService.ts`
- [x] T031 [US2] Add UI for tag filter on home page in `src/components/tags/TagFilter.tsx` and wire to `src/app/page.tsx`
- [x] T032 [US2] Add UI for search input + results state in `src/components/search/SearchBox.tsx` and wire to `src/app/page.tsx`
- [x] T033 [US2] Preserve search context on navigation back (store in URL params or equivalent) and add unit tests for state serialization in `tests/unit/search/state-serialize.test.ts`

**Checkpoint**: User Story 2 works independently on top of US1

---

## Phase 5: User Story 3 - 评论系统：社交账号登录后发表评论 (Priority: P3)

**Goal**: 读者登录后可发表评论，刷新后仍可见；未登录状态给出明确提示与入口

**Independent Test**: Follow `specs/001-blog-cms/quickstart.md` → User Story 3 Acceptance

### Tests for User Story 3 (REQUIRED: include unit tests) ⚠️

- [x] T034 [P] [US3] Unit test: auth required for creating comment in `tests/unit/comments/auth-required.test.ts`
- [x] T035 [P] [US3] Unit test: comment body required validation in `tests/unit/comments/body-validation.test.ts`
- [x] T036 [P] [US3] Unit test: comment ordering & persistence in `tests/unit/comments/order-persistence.test.ts`

### Implementation for User Story 3

- [x] T037 [US3] Implement comment repository in `src/server/repos/commentRepo.ts`
- [x] T038 [US3] Implement comment create/list handlers in `src/app/api/comments/route.ts` (align error codes with `specs/001-blog-cms/contracts/api.md`)
- [x] T039 [P] [US3] Add comments UI (list + composer) in `src/components/comments/` and wire to `src/app/posts/[id-or-slug]/page.tsx`
- [x] T040 [US3] Add login entry points for comments (GitHub + Google) and ensure returning to the same post after login

**Checkpoint**: User Story 3 works independently (requires auth configured in foundation)

---

## Phase 6: User Story 4 - 体验偏好：明亮/暗黑皮肤切换 (Priority: P3)

**Goal**: 全站可切换明亮/暗黑主题，并持久化偏好

**Independent Test**: Follow `specs/001-blog-cms/quickstart.md` → User Story 4 Acceptance

### Tests for User Story 4 (REQUIRED: include unit tests) ⚠️

- [x] T041 [P] [US4] Unit test: theme preference read/write in `tests/unit/theme/preference.test.ts`

### Implementation for User Story 4

- [x] T042 [P] [US4] Add theme toggle component in `src/components/theme/ThemeToggle.tsx`
- [x] T043 [US4] Wire theme preference to app root layout in `src/app/layout.tsx` and ensure persistence across refresh
- [x] T044 [US4] Validate readability of markdown content in dark mode (code blocks, quotes) and fix styles in `src/styles/`

**Checkpoint**: Theme switch is functional and persistent

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 跨用户故事的质量、性能与文档收尾

- [x] T045 [P] Add/adjust unit tests to close any coverage gaps across `tests/unit/`
- [x] T046 Add minimal integration tests for critical cross-layer flows (publish → home visible; comment create → visible) in `tests/integration/` (only if unit tests insufficient)
- [x] T047 Performance pass: ensure first load <= 3s on key pages; optimize bundle/render path and document findings in `specs/001-blog-cms/research.md` (append perf notes)
- [x] T048 UX pass: ensure all error states are actionable and consistent across editor/search/comments
- [x] T049 Update repository-level documentation for self-host deployment (create `docs/deploy/self-host.md` and reference env vars)
- [x] T050 Run full lint + unit tests; fix failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** → **US1** → **US2/US3/US4** → **Polish**

### User Story Dependencies

- **US1 (P1)**: depends on Foundational
- **US2 (P2)**: depends on US1 (needs posts to search/filter)
- **US3 (P3)**: depends on Foundational + US1 (comments attached to posts)
- **US4 (P3)**: can run after Setup/Foundational (independent of content)

### Simple Dependency Graph

```text
Setup → Foundation → US1 → US2
                    ├→ US3
Setup → Foundation →└→ US4
```

---

## Parallel Example: User Story 1

```bash
# Run unit tests for US1 in parallel (separate files):
tests/unit/posts/publish-validation.test.ts
tests/unit/markdown/render-pipeline.test.ts
tests/unit/posts/post-repo-state.test.ts

# Implement UI components in parallel:
src/components/editor/*
src/app/editor/new/page.tsx
src/app/editor/[id]/page.tsx
```

