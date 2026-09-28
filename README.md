# Luminary

多产品聚合站的 monorepo：产品官网与文档站、个人网站、Luminous 桌面客户端。

## 结构

```
Luminary/
├── apps/
│   ├── site/        # 官网 + 文档站（静态导出 → out/）
│   ├── personal/    # 个人网站（静态导出 → out/）
│   └── desktop/     # 桌面客户端（静态导出 → out/，由 src-tauri/ 打包）
├── packages/
│   └── sync/        # 两仓文档同步与构建门禁
├── turbo.jsonc      # 任务图（含各条约束的理由）
└── pnpm-workspace.yaml
```

**三个 app 按发布形态分区，不按技术栈分**：

| app | 输出 | 分发 | 线上位置 |
|---|---|---|---|
| `site` | `output: 'export'` → `out/` | 上传 CDN | `devluo.com/luminous/` |
| `personal` | `output: 'export'` → `out/` | 上传 CDN | `devluo.com/` |
| `desktop` | `output: 'export'` → `out/` | Tauri 内嵌进安装包 | 无 HTTP 路由 |

三个 app **都是静态导出**。`desktop` 之所以也必须是静态，不是取舍而是硬约束：
Tauri 官方明确"不支持基于服务端的方案"（见 https://tauri.app/start/frontend/nextjs/）。
桌面端需要"服务端"能力的部分（认证、请求中转）由 **Rust 层**承担，不是 Node。

三者的差别在**分发方式**，不在渲染方式。

## 站点拓扑与部署

```
devluo.com/                  → personal（占根路径）
devluo.com/luminous/         → site（官网）
devluo.com/luminous/docs/    → site（文档站）
```

`site` 与 `personal` 同域共存、**都要产出 `/_next/`**，因此 `site` 设了
`basePath: '/luminous'` 把资源区分开——这是 Next 在**构建期**解决的，
不依赖托管方的 rewrite 规则。

两处容易踩的坑（详见 `docs/deployment.md`）：

- `site` 的 `_next/` 在磁盘上仍在 `out/_next/`，**上传时需重映射**到
  `/luminous/_next/`。这一步只在线上暴露，本地 `next dev` 看不出来。
- 搜索索引由构建收尾脚本从 `api/search` 改名为 `api/search.json`，
  否则对象存储不返回 `application/json`。

## 常用命令

在仓库根执行（由 Turbo 编排）：

```bash
pnpm install

pnpm dev           # 三个 app 的开发服务
pnpm build         # 三个 app 分别构建
pnpm lint

pnpm sync:docs     # 从同级 Luminous / Lucent 同步文档（有副作用，不缓存）
pnpm verify:docs   # 文档门禁（分区计数 + 手写页完整）
pnpm ci:docs       # 同步 + 门禁 + 构建（CI 用的完整链路）
```

单个 app 内也可以直接跑：

```bash
pnpm --filter @luminary/site dev
pnpm --filter @luminary/site build
```

桌面端由 Tauri 驱动（`beforeDevCommand` / `beforeBuildCommand` 已配好，
会自动带上 Next 的 dev / build）：

```bash
pnpm --filter @luminary/desktop tauri:dev     # 起 next dev + 桌面窗口
pnpm --filter @luminary/desktop tauri:build   # 打包安装包
```

> ⚠️ `tauri:*` 需要 `tauri-cli`（`cargo install tauri-cli`），
> 只有 Rust 工具链不够。Windows 侧另需 `src-tauri/icons/icon.ico`——
> 缺了会在生成 Windows Resource 时直接失败。

## 文档站

`apps/site` 的内容**不进 git**：`content/docs/{luminous,lucent}` 由 `pnpm sync:docs`
从同级仓库读出来。因此本地构建与 CI 都必须能同时访问三个仓库，且目录层级必须是平的：

```
<workspace>/          # 例如 Lumos/
├── Luminary/         # 本仓库
├── Luminous/
└── Lucent/
```

`packages/sync` 按标记文件向上找 monorepo 根（`pnpm-workspace.yaml`），
再取上一级作为工作区根——**不要**改成数层级的相对路径：
数层级在结构变化时是**静默**失败的（去错目录找内容，表现为"同步成功但内容为空"）。

同步内容与 compodoc 产物由 `.gitignore` 忽略；`packages/sync` 会自检
`content/nav/` 复制出的每个路径都被忽略，漏了规则会直接报错。

## 约定

- **只写 TypeScript，不产出 JavaScript**。同步脚本由 Node 24 原生执行
  （类型剥离），无构建步骤、无打包产物。
- 提交信息：`type(scope): 中文摘要`，单行。
- 不修改 `Lucent` 仓库结构；本仓库的改动不涉及后端。

## 相关文档

- 部署（拓扑、配置选型、上传映射、对象存储配置）：`docs/deployment.md`
- 改造计划与决策依据：`plans/2026-09-28-luminary-monorepo-plan.md`
- 文档站落地过程与实测数据：`plans/2026-09-28-docs-site-rollout-plan.md`