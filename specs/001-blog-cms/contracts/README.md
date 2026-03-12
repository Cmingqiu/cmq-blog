# Contracts: Personal Blog CMS

**Branch**: `001-blog-cms`  
**Created**: 2026-03-12  
**Purpose**: 定义对外可观察的契约（路由、输入输出、错误与状态），用于实现与测试对齐。

## Contract Scope

- 页面路由（读者/博主）
- 服务端接口（Route Handlers / Server Actions 的外部行为）
- 草稿/发布/评论/搜索的输入校验与错误反馈

## Conventions

- 所有错误必须对用户可理解且可操作（宪章 UX 门禁）
- 所有可变更操作必须可被单元测试覆盖（宪章测试门禁）
- 首页/详情等关键页面需考虑缓存/再验证策略以满足首屏预算（宪章性能门禁）

