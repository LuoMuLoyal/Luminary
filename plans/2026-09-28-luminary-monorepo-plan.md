# Luminary Monorepo 改造计划

> 状态：**Phase 1–5 已完成**（结构改造已落地并逐阶段提交）；Phase 6 待定项未决
> 前置阅读：`2026-09-28-docs-site-rollout-plan.md`（文档站落地，已完成）

## 一、背景：Luminary 的定位变了

文档站落地计划里，`Luminary` 被当作**单一文档站**。现在它的定位是**多产品聚合站**，
要承载四件事：

| # | 项目 | 形态 | 面向 | 运行需求 |
|---|---|---|---|---|
| 1 | 官网 | 静态 | 潜在用户 | 静态导出 |
| 2 | 文档站 | 静态 | 使用者 | 静态导出 |
| 3 | 个人网站 | 静态 | 社团、其他团队、GitHub 访客 | 静态导出 |
| 4 | Luminous 桌面端 | **SSR** | 使用者 | 认证、SSE、缓存 |

1+2 是产品叙事（同一套导航与视觉），3 是"我是谁、我做过什么"的展示叙事，
4 是登录后的工作台。**四者不是同一类东西，所以不能是一个 app。**

### 现状（迁移基线）

`Luminary` 现在是标准单应用结构，18 个提交：

```
Luminary/
├── app/
│   ├── (devluo)/          # 官网首页（route group）
│   └── (luminous)/luminous/docs/   # 文档站
├── components/  lib/  content/  scripts/  public/
├── next.config.mjs        # output: 'export'（纯静态）
├── pnpm-workspace.yaml    # 已存在！目前只有 allowBuilds
└── plans/  AGENTS.md  README.md
```

**关键有利条件**：`pnpm-workspace.yaml` 已存在（`allowBuilds` 配置），
不需要从零建立 workspace；且仓库只有 18 个提交，**现在改结构的成本是全程最低点**。

## 二、调研结论（决定方案的三条证据）

### 2.1 官方 multi-zones 的标准示例就是本场景

Next.js 官方 [Multi-Zones 指南](https://nextjs.org/docs/app/guides/multi-zones) 的示例：

> `/dashboard/*` for all pages when the user is logged-in to the dashboard
> `/*` for the rest of your website not covered by other zones

"登录后的 dashboard" 就是"SSR 工作台"，与静态站**共存于同一域名**——
这正是我们要的形态，也是官方推荐做法，而非变通。

官方同时明确：

> it is often convenient to put these zones in a **monorepo** to more easily share code

### 2.2 跨 zone 导航是硬跳转，划分须按"是否常一起访问"

官方原文：

> Navigating from a page in one zone to a page in another zone... will perform a **hard
> navigation**, unloading the resources of the current page
>
> **Pages that are frequently visited together should live in the same zone** to avoid hard
> navigations.

据此校验本方案的分区：

| 组合 | 是否常一起访问 | 结论 |
|---|---|---|
| 官网 ↔ 文档站 | **是**（看完介绍就点文档） | **同 zone** ✅ |
| 官网/文档 ↔ 个人站 | 否（叙事完全不同） | 分开 ✅ |
| 静态站 ↔ 工作台 | 否（工作台需登录） | 分开 ✅ |

**三个 zone 的划分与官方建议一致。**

### 2.3 真实先例

**[cuHacking 2025](https://github.com/cuhacking/2025/issues/40)** —— 与本项目高度同构：
marketing site + hacker portal app + docs site 合并为 monorepo，
且他们的 **docs site 正是 Fumadocs + Next.js**。

他们否决了"保持独立仓库"：

> Keeping separate repositories: This was dismissed because it would increase maintenance
> efforts and make it harder to manage shared configurations and consistent branding.

**[Arbarwings/tauri-v2-nextjs-monorepo](https://github.com/Arbarwings/tauri-v2-nextjs-monorepo)**
—— Tauri v2 + Next.js monorepo 参考实现，结构：

```
apps/
├── native/     # Tauri 壳
└── web/        # Next.js
packages/{eslint-config,typescript-config,ui}
```

验证了 **Tauri 壳与 Next.js 同 monorepo 是成熟做法**，且 Tauri 单独占一层。

## 三、目标结构

```
Luminary/                        # monorepo 根
├── pnpm-workspace.yaml          # packages: apps/* + packages/*；allowBuilds 已存在
├── package.json                 # 根：仅编排脚本，无应用依赖
├── turbo.jsonc                  # 任务图（用 jsonc 承载约束说明）
├── apps/
│   ├── site/                    # 官网 + 文档站（静态）
│   ├── personal/                # 个人网站（静态）
│   └── workbench/               # 桌面工作台（SSR）
│       └── src-tauri/           # Tauri 壳
└── packages/                    # 跨 app 共享
    └── sync/                    # 文档同步与门禁脚本（见 §四 Phase 3）
```

### 分区判据（为什么这么分）

- **site**：官网与文档站共享导航、页脚、主题、`site.softwareName` 等站点元数据。
  且有大量互链（官网 → 文档），必须软跳转，故必须同 zone。
- **personal**：展示叙事，导航与视觉独立。与 site 之间不常互访，独立 zone 无损。
- **workbench**：唯一需要 SSR 的 app。与静态站无共享页面结构，
  且在发布形态上完全不同（Tauri 打包 vs 静态上传）。

### `output` 字段按发布形态切换

`output: 'export'` 是 **app 级**开关，不是架构分界：

| app | 常态 | 说明 |
|---|---|---|
| site | `output: 'export'` | 出 `out/`，上传 CDN |
| personal | `output: 'export'` | 同上 |
| workbench | 无该字段（默认 SSR） | `next start` / Tauri |

**两个静态 app 恒为静态导出**，不受 workbench 影响——这消除了"文档站被拖成 SSR"的担忧。

> 早期讨论中曾以"必须拆两个 app 才能共存静态与 SSR"为由论证，
> 该论证**不成立**：结论（拆 app）对，理由错。真正理由是**发布形态与叙事边界不同**，
> 见 §三「分区判据」。

## 四、迁移阶段

> **状态（2026-09-28）**：Phase 1–5 **已完成并逐阶段提交**；Phase 6 未开工（待 §8.2/§8.3）。
>
> | Phase | 提交 | 结果 |
> |---|---|---|
> | 1 workspace 骨架 | `48a96cb` | 站点移入 `apps/site`，路径推导改为标记文件向上找 |
> | 2 拆分同步脚本 | `933db42` | 589 行 → 12 个单一职责模块，输出逐字一致 |
> | 3 packages 与 Turbo | `7802245` | `packages/sync` 成为首个共享包 |
> | 4 personal 骨架 | `8fa59b2` | 独立静态 app |
> | 5 workbench 骨架 | `9a86a91` | SSR app + Tauri 壳 |

### 关于 Phase 1 的验收标准（**已修正**）

原定"产物与迁移前**逐文件 SHA256 一致**"。**实测该标准不可达**：

同一份源码**连续构建两次**，4739 个文件里 6950 行 hash 不同。根因有两处，
都与源码无关：

1. **内容哈希文件名与 buildId**：Turbopack 每轮生成不同的 chunk 名与 buildId。
2. **Shiki 语法高亮的颜色会跳**：代码块的 `--shiki-light` 在 `#032F62` 与
   `#005CC5` 之间变化，是高亮器并发渲染的竞态。

**修正后的验收方式**：比对前把 buildId、chunk 名、Shiki 颜色归一化，
再比路径集合与内容。归一后同源构建**完全一致**（已实测），
因此该方式既能抓住真实变化，又不会把构建器的非确定性当成迁移失败。

> 未把该比对做成脚本入库：它是一次性验收工具，长期价值低于维护成本。
> **真正该长期守的是"页面集合与内容不意外变化"**，而那由 `verify:docs`
> 的分区计数与浏览抽查承担。

### Phase 1：workspace 骨架（不移动任何应用的内容）

- 扩充 `pnpm-workspace.yaml` 为 `packages: [apps/*, packages/*]`
- 根 `package.json` 只保留编排脚本，应用依赖下沉
- 建立 `apps/` 并把现有内容整体移入 `apps/site/`（`git mv`，保留历史）
- **修正仓库根推导**：`sync-docs.ts` / `verify-docs.ts` / `lib/openapi.ts` 原先用
  `resolve(here, '..')` / `resolve(process.cwd(), '..')` 推导根目录，移入 `apps/site/`
  后会指向 `apps/`。改为**按标记文件向上找**（`pnpm-workspace.yaml` → monorepo 根，
  `next.config.mjs` → app 根）
- **验收**：`sync:docs` 输出逐字一致（写入 420 篇 / 跳过 1 / 导航 24 / compodoc 899）；
  `verify:docs` 通过；`build` 成功且页面集合一致

> **`.gitignore` 是这一步的隐藏坑**：原规则带前导斜杠（`/out/`、`/content/docs/lucent/`），
> 锚定的是仓库根。app 移入 `apps/site/` 后**全部失效**，且失效是静默的——
> 产物与构建期副本会以"未跟踪文件"的形态出现，看起来像残留。
> 已把根 `.gitignore` 改为不锚定的目录名匹配。

### Phase 2：拆分 `sync-docs.ts`（见 §6.2）

- 按职责拆成 `sync/` 下的 12 个模块（入口 44 行）
- **验收**：同步输出**逐字一致**（40 行全等）；`verify:docs` 通过；
  负向测试（移走一个手写页）仍退出码 1 ✅

> 纯重构，不改行为。放在搬家之后，基线已稳定，可逐字对比。

### Phase 3：抽出 `packages/` 与引入 Turbo

- 把拆好的同步/门禁脚本迁到 `packages/sync`，作为**首个真实共享包**
- 建立 `turbo.jsonc`（用 jsonc 承载约束说明），根脚本改为 `turbo run <task>`
- `packages/sync` 不再猜 app 位置：目标 app 根由调用方传入
  （命令行参数 → `LUMINARY_APP_ROOT` → 缺省 `apps/site`）
- **验收**：`pnpm build`、`pnpm ci:docs` 经 Turbo 跑通；重复执行命中缓存 ✅

> ⚠️ **`sync:docs` 只能由一个包声明**。迁移中 `@luminary/sync` 与 `@luminary/site`
> 都声明了它，Turbo 视为两个独立任务并**并发执行**，两个进程同时对同一目录
> `rmdir` → `EPERM: operation not permitted`。
> 现由 `apps/site` 单独声明：它才是"文档站在哪"的知情者，`packages/sync` 是库。

### Phase 4：建立 personal

- 新建 `apps/personal`，沿用 site 的技术栈基线
- 与 site 之间**不共享组件**（叙事不同，强行共享会互相牵制）
- **验收**：独立构建、独立产物（`apps/personal/out/`，21 个文件）✅

### Phase 5：建立 workbench 骨架（不含业务功能）

- 新建 `apps/workbench`，**不带** `output: 'export'`
- 加 `src-tauri/` 壳（Tauri v2 配置 + `lib.rs` / `main.rs` + 占位图标）
- 加 `/ssr-probe` 页：`force-dynamic` 输出请求时间，把"SSR 真的生效"变成可观测事实
- **验收**：`next build` 产出 `/ssr-probe` 为 `ƒ (Dynamic)`，且**不产生 `out/`** ✅
- **未验收**：Tauri 打空壳窗口——需要 Rust 工具链，本机未装。
  **壳的形态已固定，能构建性未验证**，这一条留给 Phase 6 或功能集计划。

> 本阶段**只搭骨架**。工作台的功能集是独立计划（ADR-0008 第 22 行：
> "0.1.0 发布后启动桌面 MVP"），不在本计划内。

> ⚠️ **SSR 与 Tauri 尚未打通**：SSR 需要常驻 Node 进程，不能像纯静态站点那样
> 让 `frontendDist` 直接指向 HTML 目录。落地方式（sidecar 进程 vs 指向外部服务）
> 属于功能集计划，本骨架**不做决定，也不假装已解决**。

### Phase 6：路由与部署编排

- 决定 zone 之间的路由方式（见 §八 待定）
- 每个 zone 配 `assetPrefix`，互不冲突
- CI 扩展为按 app 分别构建（当前 `docs.yml` 只跑 `site`）
- **验收**：三个 app 的产物可同时部署且互不覆盖

> ⚠️ 跨 zone 链接必须用 `<a>` 而非 `<Link>`：Next.js 的 `<Link>` 会尝试
> prefetch 并对相对路径做软跳转，跨 zone 不生效（见 Next.js multi-zones 指南
> "Linking between zones"）。这条约束落在 Phase 6，但写组件时常会踩。

## 五、需要修订的既有决策

### ADR-0008 已就地修订完成

`Luminous/docs/reference/adr/0008-desktop-independent-web-product-route.md`
**已就地修订**（不新增 ADR），落地结果：

| 项 | 修订前 | 修订后 |
|---|---|---|
| 客户端代码归属 | `Lucent` 仓库 | **`Luminary` 仓库** |
| 后端服务 | 未明确 | **由 `Lucent` 提供**（合同仍以后端为准） |
| Status | `accepted` | `accepted (amended 2026-09-27: 客户端代码归属由 Lucent 改为 Luminary；后端合同仍由 Lucent 提供)` |

**为什么就地改而不是新增 ADR-0010**：本次修订**不改变决策本身**——
桌面端仍走独立 Next.js + Tauri 路线，只改了两件事的指向（代码放哪、后端谁提供）。
新增一份 ADR 会让"路线是否已定"多出一个需要交叉阅读的文档，
而问题恰恰是原先**太多文档各说一套**。就地修订把口径收敛回一处。

**ADR-0008 中仍然有效的部分**（不因归属改变而失效）：
- 桌面端走独立产品路线，不复制手机端五个入口
- 停止扩展现有 Flutter 桌面表面（`windows/`/`macos/`/`linux/`/`web/` 保留但不新增功能）
- 手机端边界不变
- 共享业务合同（OpenAPI、认证、健康数据语义），不共享页面结构
- 桌面壳选 Tauri；PWA 不在路线内

### 口径冲突已消除

ADR-0008 修订时发现的活跃文档冲突**已同步更正**，现行文档口径一致：

| 文档 | 更正后 |
|---|---|
| `docs/reference/adr/0008-...md` | 已选（归属 Luminary、后端 Lucent） |
| `docs/reference/adr/README.md` | 索引状态同步 |
| `docs/product/product-vision.md` | 路线已定 + 指向 ADR-0008 |
| `docs/product/product-mvp-scope.md` | 技术路线已定 + 指向 ADR-0008 |
| `docs/product/product-information-architecture.md` | 两处均已更正 |
| `docs/explanation/project-governance.md` | 两处均已更正 |

`docs/archive/**` 下的"候选"表述**不动**——存档是冻结的历史，不是现行口径。

## 六、随本计划一并处理的两项技术债

以下两项在文档站计划中已识别，但**刻意推迟到本计划**，因为改造会再次改变
同步脚本的路径假设，现在做必然返工。

### 6.1 同步期链接重写

#### 背景

`sync:docs` 会把源仓库目录**摊平**（如 `Lucent/docs/reference/adr/` → `lucent/adr/`），
而文档正文里的相对链接是**按源仓库结构写的**，于是失效。

实测（`node scripts/audit-links.ts`，2026-09-28）：

| 项 | 数值 |
|---|---|
| 站内内链总数 | 247 |
| 真断链（指向站点内容但解析不到） | **44**，涉及 22 篇 |
| 其中：文件名在分区内唯一 → 可机械重写 | 33 |
| 其中：同名多候选 → 需人工判断 | 6 |
| 其中：站点内不存在 → 需改指向或删链 | 5 |

> 手写页（`content/nav/{lucent,luminous}/index.mdx`）的 5 条错误链接**已在文档站计划中修复完毕**
> （24 个分区链接浏览器实测全绿）。此处剩下的是**同步内容**的 44 条。

#### 重写规则

**必须用站点内真实路径重写，而不是"猜"**：按文件名在**同分区**内查唯一匹配，
查到唯一才重写；多候选或查不到则**不动**（避免把链接改错，错链比断链更难发现）。

#### 源码链接的显示文本

早期设想把 `../src/**` 一律改写成 `Lucent/src/module/...` 形态。**实测后需修正**：

| 形态 | 实测 | 处理 |
|---|---|---|
| 源码路径作为**行内代码** | **3108 处** | **不动**（是陈述性文本，不是链接） |
| 源码路径作为**链接** | **4 个** | 重写这 4 个 |

源码路径在两仓文档里几乎全部是行内代码（`` `src/setup-app.ts` ``），
**点击本就不该跳转**。把 3108 处文本改成链接，等于把**陈述**变成**承诺**——
链接会随源码重构失效，文本不会。

对那 4 个真正的链接，采用**带仓库名的可读形态**（`Lucent/src/...` / `Luminous/lib/...`），
并指向源仓库的代码托管地址（而非站点内路径，因为站点不提供源码）。

> 判据：**可读的路径文本保留，可点的链接重写。**
> 前者要求"读得懂"，后者要求"点了有用"。

#### 校验方式

**不设全站死链门禁**。两仓源文档的仓库内相对链接（`../src/**`）在站点里
本来就不该可达，全站门禁会持续误报。

改为在同步脚本内做**定向校验**：只统计"重写后仍无法解析"的链接数，
**超过阈值（建议 50）才报警**。同时把当前值（44）记录为基线，
让新增断链可见。

### 6.2 `sync-docs.ts` 拆分

#### 为什么要拆

该文件当前 **589 行**，同时承担六件事：

1. 路径映射规则（`Rule` 表 + `singleRenames`）
2. 目录遍历与文件收集
3. front-matter 规整（补 `title`、保留 `description`）
4. MDX 转义（花括号等）
5. 导航复制（`copyNav` + `assertCopiesIgnored` 自检）
6. compodoc 整目录拷贝
7. 计数与报告输出

**问题**：这些职责的**变更频率差异很大**——映射规则会随仓库结构调整而变，
转义逻辑几乎不变。混在一个文件里，改任一处都要通读全局，
且本计划 §八 风险表已指出：改造时须修正仓库根推导，
在那 589 行里定位相关位置本身就是负担。

#### 拆分方案（按职责切，不按行数切）

```
scripts/
**实际落位**（`packages/sync/src/`，拆分与迁移分两步提交）：

```
packages/sync/src/
├── sync-docs.ts      # 入口：解析路径 → sync() → 打印（44 行）
├── verify-docs.ts    # 门禁
├── audit-links.ts    # 断链普查
├── context.ts        # 路径推导 + SyncContext（包内不猜 app 位置）
├── rules.ts          # 路径映射表 + 单篇重命名（变更频率最高）
├── run.ts            # 编排顺序与计数
├── page.ts           # 单篇组装：front-matter + 转义
├── frontmatter.ts    # front-matter 解析/重建（纯函数）
├── escape.ts         # MDX 转义（纯函数）
├── walk.ts           # 目录遍历
├── nav.ts            # copyNav + assertCopiesIgnored
├── compodoc.ts       # compodoc 拷贝
├── report.ts         # 计数与告警，注入式传递
└── output.ts         # 控制台输出格式
```

> 与原方案差一处：`rewritelinks.ts`（§6.1 的链接重写）**未建**。
> 该功能与目录映射强相关，映射稳定前建它必然返工；模块位置已留好。

**拆分原则**：
- **不改行为**：纯搬迁，现有同步输出（`写入 420 篇，跳过 1 篇，导航 24 个，compodoc 899 个`）
  逐字一致 ✅
- **每个模块单一职责**，输入输出用显式参数传递，不依赖全局常量
  （`SyncContext` 取代原先的文件级常量）
- 保持现有约定：**TypeScript only**（无 JS 产物），`node src/sync-docs.ts` 直接跑

#### 与 Phase 1 的关系

**拆分在 Phase 1（workspace 骨架）之后进行**，作为 **Phase 2**。
理由：Phase 1 只做"搬家 + 修正路径推导"，改动越少越容易验证；拆分是纯重构，
放在搬家之后、有稳定基线可对比时做，责任边界更清楚。

#### 验收

- 拆分后 `pnpm sync:docs` 输出与拆分前**逐字一致**（40 行全等）✅
- `pnpm verify:docs` 通过 ✅
- `pnpm build` 成功 ✅
- 负向测试：移走一个手写页 → 门禁仍退出码 1 ✅
- 拆分产物落位 `packages/sync`（见 Phase 3），不再是 app 私有脚本 ✅

## 七、明确不做的事

- **`packages/` 只放真实共享物，不做设计系统共享**。三个 app 同栈，
  共享 UI 组件属于"先建后拆"——等出现第二处真实重复再抽。
  首个进 `packages/` 的是**文档同步脚本**（`site` 用、根编排用，见 Phase 3），
  它跨 app 复用且与构建无关，是最没有争议的一项。
- **不引入 Nx**。只用 Turbo：任务是"构建 + 校验"，无 Nx 的插件/图/生成器需求。
- **不动 `Lucent` 的仓库结构**。本计划全部改动限于 `Luminary`（外加 §五 的 ADR 文档）。
- **不实现工作台业务功能**。仅搭骨架，功能集另行计划。
- **不做 `personal` 的内容设计**。本计划只确定它的 app 边界与位置。
- **不把行内代码形态的源码路径改成链接**（理由见 §6.1）。
- **软著相关命名**暂不处理（见 §八）。

## 八、待定事项

以下事项**在相应阶段之前必须定**：

### 8.1 桌面端技术路线是否已定 —— ✅ 已解决

ADR-0008 **已就地修订**，路线为**已定**（Next.js + Tauri），客户端代码归属 `Luminary`，
后端服务由 `Lucent` 提供。活跃产品文档已同步更正口径。**Phase 4 无阻塞。**

### 8.2 域名与路径划分（**Phase 6 前置，仍未定**）

multi-zones 需把不同 zone 的路径路由到不同应用。当前访问路径是
`devluo.com/luminous/docs`。待定：官网、个人站、工作台各自用什么路径或域名。

- 子路径（`devluo.com/me`、`devluo.com/desktop`）→ 需要 rewrite 或代理
- 独立域名 → 无需代理，但失去"同一站点"的观感

### 8.3 托管方是否支持 rewrite（**Phase 6 前置**）

§8.2 若选子路径，则需要在托管侧做路由代理。**需先确认对象存储 + CDN
能否配置 rewrite 规则**；不能的话只能退回「各 zone 独立挂载」，方案随之调整。

### 8.4 其他

- `lib/site.ts` 中的 `TODO（待定：软著软件全称）`：**保持现状**。
  该项影响官网页脚、文档站标题、Tauri 打包名，晚定会导致多处返工，
  但按当前决定暂不处理。
- **Lumos-docs 的退役**：它是本站的 VitePress 前身，功能已被 `Luminary` 完全覆盖。
  退役流程与时机不在本计划内，**建议等本计划 Phase 1 验收通过后再单独推进**。

## 九、Turbo 与 `packages/` 的边界

### 9.1 为什么是 Turbo 而不是 Nx

任务是"三个 app 各自构建 + 一组校验脚本"。没有 Nx 的插件生态、生成器、
模块边界强制需求。Turbo 只做两件事：**按依赖图排序**、**按输入哈希缓存**，
这恰好是需要的全部。

### 9.2 任务图

```jsonc
// turbo.json
{
  "tasks": {
    "build":     { "dependsOn": ["^build"], "outputs": ["out/**", ".next/**"] },
    "lint":      { "dependsOn": ["^build"] },
    "sync:docs": { "cache": false },          // 有副作用：写 content/ 与 public/
    "verify:docs": { "dependsOn": ["sync:docs"] },
    "ci:docs":   { "dependsOn": ["verify:docs", "build"] }
  }
}
```

**关键判断**：
- `sync:docs` **必须 `cache: false`**。它不是纯函数——会 `rm` 再写 `content/docs/`
  与 `public/compodoc/`，被缓存跳过会导致"产物看起来在、其实是上一轮的"。
- `build` 的 `outputs` 必须声明。Turbo 靠它做缓存复用，漏了就只有"跳过"没有"恢复"。
- `verify:docs` 依赖 `sync:docs` 而非反过来——门禁校验的是同步结果。
- `ci:docs` 要**显式**依赖 `sync:docs`：否则 `build` 可能与它并发
  （`build` 读 `content/`，而 `sync:docs` 正在清空重写），表现为**偶发**失败。
- **`sync:docs` 只能由一个包声明**。若库与 app 都声明，Turbo 视为两个独立任务并
  并发执行，两个进程对同一目录 `rmdir` → `EPERM`（迁移中实际踩到）。

> 配置用 `turbo.jsonc` 而非 `turbo.json`：这些约束**必须写在配置旁边**，
> 否则下一个改动的人只会看到一份"为什么这些 flag 长这样"无从判断的 JSON。
> Turbo 2.11 只认 `turbo.json` / `turbo.jsonc`，**不支持** `turbo.config.mjs`（已实测）。

### 9.3 `packages/` 的首个包

`packages/sync`（文档同步与门禁）：

| 项 | 说明 |
|---|---|
| 为什么是它 | 与渲染/构建完全解耦；`site` 与根编排都要用；迁移风险最低 |
| 形态 | 内部包，`"private": true`，无构建步骤（Node 24 直接跑 `.ts`） |
| 定位 | **不猜 app 位置**：目标 app 根由调用方传入（参数 → 环境变量 → 缺省 `apps/site`） |
| 不声明任务 | 只暴露代码；会写盘的 `sync:docs` 等任务由 `apps/site` 声明（见 §9.2 末条） |

**仍然不抽的**：UI 组件、设计 token、eslint/tsconfig 预设。
三个 app 同栈，抽共享 UI 属于"先建后拆"；等第二处真实重复再抽。

> `apps/personal` 与 `apps/workbench` 当前各自复制了一份 `tsconfig.json` /
> `postcss.config.mjs` / `eslint.config.mjs`。这是**刻意**的：抽 `packages/config`
> 属于上一条"仍然不抽"的范围，等第三个同配置出现、或配置开始分叉时再抽。

## 十、风险

| 风险 | 影响 | 应对 |
|---|---|---|
| 迁移破坏已完成的文档站 | 文档站刚验收完毕，返工成本高 | Phase 1 以「同步输出逐字一致 + 页面集合一致」为验收（原「逐文件 SHA256」不可达，见 §四） |
| multi-zones 的硬跳转 | 官网→文档若跨 zone 会有整页重载 | 已将二者并入同一 zone（§2.2） |
| `assetPrefix` 配置错误 | 静态资源 404 | 每个 zone 独立构建后逐一验证资源路径 |
| 根 `package.json` 与 app 依赖混淆 | 依赖提升导致构建行为变化 | 根只放编排脚本，应用依赖不下沉到根 |
| 迁移期间 `content/` 同步脚本路径失效 | 写死相对仓库根的路径 | **已改为按标记文件向上找**，不再数层级 |
| Turbo 缓存掩盖副作用 | `sync:docs` 被判为命中，产物停留在上一轮 | 该任务显式 `cache: false`；门禁只信 `pnpm ci:docs` 全跑 |
| `.gitignore` 前导斜杠锚定失效 | 产物与构建期副本变成"未跟踪文件"，看起来像残留 | 根 `.gitignore` 改为不锚定；`assertCopiesIgnored()` 自检兜底 |
| pnpm 的 peer 后缀解析不一致 | 新 app 的 `next` 软链指向不存在的 store 条目，报「'next' is not recognized」 | 删 `node_modules` + lock 全新安装（**改配置无效**，是 store 索引陈旧） |

> **路径推导是实际最高频的坑**：原 `sync-docs.ts` / `verify-docs.ts` /
> `lib/openapi.ts` 分别用 `resolve(scriptDir, '..')` 与 `resolve(process.cwd(), '..')`
> 推导根目录。移入 `apps/site/` 后全部指向 `apps/`，且**不报错**——
> 表现为"去错目录找内容"。**已全部改为按标记文件向上找。**
> 新代码不要退回数层级的写法。
