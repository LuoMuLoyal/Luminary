# Luminary

多产品聚合站的 monorepo：产品官网与文档站、个人网站、Luminous 桌面工作台。

## 结构

```
Luminary/
├── apps/
│   ├── site/        # 官网 + 文档站（静态导出 → out/）
│   ├── personal/    # 个人网站（静态导出 → out/）
│   └── workbench/   # 桌面工作台（SSR；src-tauri/ 是 Tauri 壳）
├── packages/
│   └── sync/        # 两仓文档同步与构建门禁
├── turbo.jsonc      # 任务图（含各条约束的理由）
└── pnpm-workspace.yaml
```

**三个 app 按发布形态分区，不按技术栈分**：

| app | 输出 | 部署 |
|---|---|---|
| `site` | `output: 'export'` → `out/` | 静态上传 CDN |
| `personal` | `output: 'export'` → `out/` | 静态上传 CDN |
| `workbench` | 默认 SSR → `.next/`，**无 `out/`** | `next start` / Tauri 打包 |

`output: 'export'` 是 **app 级**开关，因此两个静态 app 恒为静态导出，不受 workbench 影响。

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

- 改造计划与决策依据：`plans/2026-09-28-luminary-monorepo-plan.md`
- 文档站落地过程与实测数据：`plans/2026-09-28-docs-site-rollout-plan.md`