# Self-host Deployment (Next.js)

## Overview

本项目为 Next.js 全栈应用，目标部署到自建服务器（Node.js 运行时）。推荐按环境区分：
- dev：本地开发
- staging：预发布/验收
- prod：生产

## Prerequisites

- Node.js 20+
- 可写入的持久化目录（SQLite 数据文件）

## Environment Variables

参见仓库根 `/.env.example`。

关键变量：
- `SQLITE_PATH`: SQLite 数据文件路径（例如 `./data/app.db`）
- `AUTH_SECRET`: Auth.js 会话密钥
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`

## Build & Run

```bash
npm ci
npm run build
npm run start
```

## Notes

- SQLite 文件目录必须可写；推荐将 `data/` 配置为持久化卷（如容器部署）。
- 首屏性能目标见 `specs/001-blog-cms/plan.md` 与宪章 `/.specify/memory/constitution.md`。

