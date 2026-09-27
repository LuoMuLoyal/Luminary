# Luminary Monorepo 改造计划

> 状态：**待评审**（仅计划，不含任何结构改动）
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
├── pnpm-workspace.yaml          # packages: apps/*（已存在，扩充）
├── package.json                 # 根：仅编排脚本，无应用依赖
├── apps/
│   ├── site/                    # 官网 + 文档站（静态）
│   ├── personal/                # 个人网站（静态）
│   └── workbench/               # 桌面工作台（SSR）
│       └── src-tauri/           # Tauri 壳
└── packages/                    # 【暂不创建】见 §六
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

> **前置条件**：`2026-09-28-docs-site-rollout-plan.md` 的 CI 已在真实 runner 上验证通过。
> 理由：本次迁移会改动 `pnpm build`、CI、`.gitignore`、`verify:docs` 的路径假设。
> 若 CI 本身从未验证过，出错时分不清是迁移问题还是 CI 问题。

### Phase 1：workspace 骨架（不移动任何应用）

- 扩充 `pnpm-workspace.yaml` 为 `packages: [apps/*, packages/*]`
- 根 `package.json` 只保留编排脚本，应用依赖下沉
- 建立 `apps/` 并把现有内容整体移入 `apps/site/`（`git mv`，保留历史）
- **验收**：`apps/site` 的 `pnpm build` 产物与迁移前**逐文件一致**

> 这一步只动位置，不动内容。先证明"搬家不影响构建"，再谈别的。

### Phase 2：抽出 site 的共享配置

- 把 `eslint.config.mjs`、`tsconfig.json`、`postcss.config.mjs` 中可复用的部分
  抽到根或 `packages/config`
- **验收**：`apps/site` 的 lint 与 build 结果不变

### Phase 3：建立 personal

- 新建 `apps/personal`，沿用 site 的技术栈基线
- 与 site 之间**不共享组件**（叙事不同，强行共享会互相牵制）
- **验收**：独立构建、独立产物

### Phase 4：建立 workbench 骨架（不含业务功能）

- 新建 `apps/workbench`，**不带** `output: 'export'`
- 加 `src-tauri/` 壳
- **验收**：`next build` 走 SSR 产物；Tauri 能打出空壳窗口

> 本阶段**只搭骨架**。工作台的功能集是独立计划（ADR-0008 第 22 行：
> "0.1.0 发布后启动桌面 MVP"），不在本计划内。

### Phase 5：路由与部署编排

- 决定 zone 之间的路由方式（见 §八 待定）
- 每个 zone 配 `assetPrefix`，互不冲突
- CI 扩展为按 app 分别构建
- **验收**：三个 app 的产物可同时部署且互不覆盖

## 五、需要修订的既有决策

### ADR-0008 需要被取代

`Luminous/docs/reference/adr/0008-desktop-independent-web-product-route.md`
（Status: accepted）第 18 行规定：

> **独立桌面客户端使用 Next.js + Tauri**……**客户端代码归属 Lucent 仓库**

**该归属应改为 `Luminary`。** 理由：

1. **同构收益**：`Luminary` 已是 Next.js 16 + React 19 + TS，
   工作台 (ADR 要求 Next.js) 可直接复用构建链、React 版本、组件与设计 token。
2. **避免污染后端仓库**：`Lucent` 是活跃 NestJS 后端，`pnpm build` / `test:ci` /
   `export:openapi` 均绑在后端语义上。塞入 Next.js 意味着两套构建系统、两份 tsconfig、
   两种模块解析，且要动**线上服务所在仓库**的结构——风险不对称。
3. **官方与先例支持**：见 §二。

**ADR-0008 中仍然有效的部分**（不因归属改变而失效）：
- 桌面端走独立产品路线，不复制手机端五个入口
- 停止扩展现有 Flutter 桌面表面（`windows/`/`macos/`/`linux/`/`web/` 保留但不新增功能）
- 手机端边界不变
- 共享业务合同（OpenAPI、认证、健康数据语义），不共享页面结构
- 桌面壳选 Tauri；PWA 不在路线内

**执行方式**：新增
`Luminous/docs/reference/adr/0010-desktop-client-repository-placement.md`
（Status: `accepted`），并在其中标注 supersedes ADR-0008 的**归属条款**。
ADR 目录约定为 add-only，因此**不修改 0008 本体**；需在 0008 中加一行指向 0010 的说明。

### ⚠️ 修订前必须先解决的口径冲突

调研中发现 `Luminous` 内部对**技术路线本身是否已定**存在矛盾表述，需一并厘清，
否则新 ADR 会建立在一个自相矛盾的基础上：

| 文档 | 表述 | 口径 |
|---|---|---|
| `docs/reference/adr/0008-...md` | "**已选**"，Status: `accepted` | **已决策** |
| `docs/TODO.md:20` | "0.1.0 后**启动**独立 Next.js + Tauri 桌面工作台 MVP" | 已决策（作为待办执行项） |
| `docs/product/product-vision.md:40` | "是否采用 Next.js Web + Tauri 2……**等待独立调研后决策**" | **未决策** |
| `docs/product/product-mvp-scope.md:59` | "Next.js + Tauri 2 **候选**技术路线另行调研" | **未决策** |
| `docs/product/product-information-architecture.md:117` | "Next.js + Tauri 2 **候选**路线另行调研" | **未决策** |
| `docs/archive/2026-08/...` | "仅作**候选**，不写成已定技术决策" | 未决策 |

即：**ADR 说"已选"，产品文档说"待研究"**。虽然存档文档不构成现行决策，
但 `product-vision.md`、`product-mvp-scope.md`、`product-information-architecture.md`
是**活跃文档**，与 ADR 直接冲突。

**因此在新 ADR 之前需要你先确认一件事**：

> 桌面端「Next.js + Tauri」到底是**已定路线**（ADR-0008 口径），
> 还是**候选、尚待调研**（产品文档口径）？

- 若是**已定** → 新 ADR 只需改归属，同时应修正那三份产品文档的表述。
- 若**尚未定** → 那么本次要决定的就**不止是"放哪个仓库"**，
  而是先决定是否采用该路线；`Luminary` 的 monorepo 改造也应相应推迟或缩小范围
  （例如只先做 site + personal 两个 zone，桌面端结构待路线确定后再建）。

**这一点会影响 Phase 4 是否现在执行**，故列为前置决策项。

> ⚠️ 注意：`Lucent/docs/` 侧也有 ADR（如 ADR-0012 响应契约）。
> 若 Lucent 侧存在与桌面端归属相关的记录，需一并核对。
> **本项在动手前应先确认。**

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
├── sync-docs.ts          # 入口：编排 + 报告（目标 < 120 行）
├── verify-docs.ts        # 门禁（已存在）
├── audit-links.ts        # 断链普查（已存在）
└── sync/
    ├── rules.ts          # 路径映射表 + 单篇重命名
    ├── walk.ts           # 目录遍历、文件收集
    ├── frontmatter.ts    # front-matter 规整
    ├── escape.ts         # MDX 转义
    ├── rewritelinks.ts   # §6.1 的链接重写
    ├── nav.ts            # copyNav + assertCopiesIgnored
    └── compodoc.ts       # compodoc 拷贝
```

**拆分原则**：
- **不改行为**：纯搬迁，现有同步输出（`写入 420 篇，跳过 1 篇，导航 24 个，compodoc 899 个`）
  必须逐字一致
- **每个模块单一职责**，输入输出用显式参数传递，不依赖全局常量
- 保持现有约定：**TypeScript only**（无 JS 产物），`node scripts/sync-docs.ts` 直接跑

#### 与 Phase 1 的关系

**在 Phase 1（workspace 骨架）之前完成拆分**。理由：Phase 1 需要修正仓库根推导
（`resolve(scriptDir, '..')` 在 `apps/site/` 下会指错），
**先把职责拆清楚，再改路径推导，改动面小且可验证**。

#### 验收

- 拆分后 `pnpm sync:docs` 输出与拆分前**逐字一致**
- `pnpm verify:docs` 通过
- `pnpm build` 成功
- 负向测试：移走一个手写页 → 门禁仍退出码 1

## 七、明确不做的事

- **暂不建 `packages/`**。真实先例建了 `packages/ui` 是因为其三个资产来自不同技术栈
  （vanilla React + Vite / full-stack / Fumadocs），统一设计系统是真需求。
  本项目三个 app 同栈，**等出现第二处真实重复再抽**。先建后拆的成本高于需要时再建。
  （同理适用于本项目的既有原则：不做「伪需求」预案。）
- **暂不引入 Turbo / Nx**。当前文档站构建约 40 秒，三 app 串行约 2–3 分钟，
  尚未构成负担。编排工具是**增量**，日后加入不影响目录结构。
- **不动 `Lucent` 的仓库结构**。本计划全部改动限于 `Luminary`（外加 §五 的 ADR 文档）。
- **不实现工作台业务功能**。仅搭骨架，功能集另行计划。
- **不做 `personal` 的内容设计**。本计划只确定它的 app 边界与位置。
- **不把行内代码形态的源码路径改成链接**（理由见 §6.1）。
- **软著相关命名**暂不处理（见 §八）。

## 八、待定事项

以下三项**在相应阶段之前必须定**：

### 8.1 桌面端技术路线是否已定（**Phase 4 前置**）

见 §五「修订前必须先解决的口径冲突」。ADR-0008 说已选，三份活跃产品文档说待调研。
**这一项没定之前，Phase 4 不应开工。**

### 8.2 域名与路径划分（**Phase 5 前置**）

multi-zones 需把不同 zone 的路径路由到不同应用。当前访问路径是
`devluo.com/luminous/docs`。待定：官网、个人站、工作台各自用什么路径或域名。

- 子路径（`devluo.com/me`、`devluo.com/desktop`）→ 需要 rewrite 或代理
- 独立域名 → 无需代理，但失去"同一站点"的观感

### 8.3 托管方是否支持 rewrite（**Phase 5 前置**）

§8.2 若选子路径，则需要在托管侧做路由代理。**需先确认对象存储 + CDN
能否配置 rewrite 规则**；不能的话只能退回「各 zone 独立挂载」，方案随之调整。

### 8.4 其他

- `lib/site.ts` 中的 `TODO（待定：软著软件全称）`：**保持现状**。
  该项影响官网页脚、文档站标题、Tauri 打包名，晚定会导致多处返工，
  但按当前决定暂不处理。
- **Lumos-docs 的退役**：它是本站的 VitePress 前身，功能已被 `Luminary` 完全覆盖。
  退役流程与时机不在本计划内，**建议等本计划 Phase 1 验收通过后再单独推进**。

## 九、风险

| 风险 | 影响 | 应对 |
|---|---|---|
| 迁移破坏已完成的文档站 | 文档站刚验收完毕，返工成本高 | Phase 1 以「产物逐文件一致」为硬验收，且在此之前先验证 CI |
| multi-zones 的硬跳转 | 官网→文档若跨 zone 会有整页重载 | 已将二者并入同一 zone（§2.2） |
| `assetPrefix` 配置错误 | 静态资源 404 | 每个 zone 独立构建后逐一验证资源路径 |
| 根 `package.json` 与 app 依赖混淆 | 依赖提升导致构建行为变化 | 根只放编排脚本，应用依赖不下沉到根 |
| 迁移期间 `content/` 同步脚本路径失效 | `sync:docs` / `verify:docs` 写死相对仓库根的路径 | 迁移时同步修正两个脚本的 `repoRoot` 推导并复跑门禁 |

> **最后一条是实际最高频的坑**：`scripts/sync-docs.ts` 与 `scripts/verify-docs.ts`
> 都用 `resolve(scriptDir, '..')` 推导仓库根。移入 `apps/site/` 后该推导会指向
> `apps/`，需改为按 workspace 根或显式配置推导。**Phase 1 必须一并处理并复跑门禁。**
