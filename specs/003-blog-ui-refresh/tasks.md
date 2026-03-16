---
description: "Updated task list for 003-blog-ui-refresh with corrected requirements"
---

# Tasks: 优化博客 UI 与发布体验 (v2)

**Input**: Design documents from `/specs/003-blog-ui-refresh/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md

**Tests**: Unit tests are REQUIRED for redirection, validation, and component behaviors.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and asset preparation

- [x] T001 Prepare brand assets (logo, favicon) in `public/` directory
- [x] T002 Verify `lucide-react` is available for the back-arrow and user icons

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration and data safety

- [x] T003 Configure site-wide brand colors (e.g., `brand-green`) in `tailwind.config.ts` (limited to logo/spot usage)
- [x] T004 Ensure `DropdownMenu` component from `shadcn/ui` is initialized in `src/components/ui/dropdown-menu.tsx`
- [x] T004b [US1] Create and run database migration to ensure `slug` field exists for all articles (blocking US1 redirection)

---

## Phase 3: User Story 1 - 发布文章后返回首页 (Priority: P1) 🎯 MVP

**Goal**: 文章发布成功后自动跳转首页，确认展示效果。

### Tests for User Story 1
- [x] T005 [P] [US1] Unit test for successful redirect after save in `tests/unit/editor/Editor.test.tsx`

### Implementation for User Story 1
- [x] T006 [US1] Integrate `useRouter` from `next/navigation` in `src/components/editor/Editor.tsx`
- [x] T007 [US1] Update `save('publish')` callback to redirect to `/` upon success

---

## Phase 4: User Story 2 - 写作报错与反馈提示 (Priority: P1) 🎯 MVP

**Goal**: 提供清晰的表单校验和接口错误反馈。

### Tests for User Story 2
- [x] T008 [P] [US2] Unit test for title/content validation logic in `tests/unit/editor/Editor.test.tsx`
- [x] T009 [P] [US2] Server-side validation test in `tests/unit/api/posts/route.test.ts`

### Implementation for User Story 2
- [x] T010 [US2] Implement localized (ZH) validation messages using `shadcn/ui` Toast/Form in `src/components/editor/Editor.tsx`
- [x] T011 [US2] Enhance error state handling in `src/components/editor/Editor.tsx` to handle backend error responses

---

## Phase 5: User Story 3 - 写作页布局优化与返回键 (Priority: P2)

**Goal**: 桌面端宽屏布局，预览与阅读页一致，顶部按钮替换。

### Implementation for User Story 3
- [x] T012 [P] [US3] Unit test for back-arrow navigation action in `tests/unit/editor/Editor.test.tsx`
- [x] T013 [US3] Replace instructional text with `Link` based back-arrow button in `src/components/editor/Editor.tsx`
- [x] T014 [US3] Adjust `max-w-*` and `prose` classes in `src/components/editor/Editor.tsx` to align with reading page

---

## Phase 6: User Story 4 - 首页精简与品牌焕新 (Priority: P2)

**Goal**: 移除干扰入口，提升品牌感，同时保留主题切换。

### Tests for User Story 4
- [x] T014b [P] [US4] Add snapshot/DOM test to verify new Brand Logo and absence of removed items (but persistence of ThemeToggle) in `tests/unit/app/HomePage.test.tsx`

### Implementation for User Story 4
- [x] T015 [P] [US4] Update `metadata` for site icons and title in `src/app/layout.tsx`
- [x] T016 [US4] Remove SearchBox and TagFilter from `src/app/page.tsx`, but RETAIN `ThemeToggle`
- [x] T017 [US4] Replace "CMQ Blog" text with the new Brand Logo component (green-themed) in `src/app/page.tsx`

---

## Phase 7: User Story 5 - 首页头像/登录入口 (Priority: P3)

**Goal**: 展示用户状态入口（头像下拉或登录按钮）。

### Tests for User Story 5
- [x] T018 [P] [US5] Unit test for `AuthStatus` component logic (Login vs Avatar) in `tests/unit/components/auth/AuthStatus.test.tsx`

### Implementation for User Story 5
- [x] T019 [P] [US5] Create `AuthStatus` component that shows "Login" link or `UserAvatar` dropdown (with 「我的文章」「退出」)
- [x] T020 [US5] Replace existing "写文章" button wrapper or integrate `AuthStatus` into header in `src/app/page.tsx`
- [x] T021 [US5] Ensure 「我的文章」 properly filters posts by author in the UI

---

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T022 [P] Ensure all brand-green elements meet contrast requirements
- [x] T023 Verify ThemeToggle correctly persists across visual changes
- [x] T024 Final compliance check against Constitution principles
