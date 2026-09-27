# Luminary 文档站落地计划

Created: 2026-09-28

> 目标：把 `Luminary` 从「Fumadocs 骨架 + 3 个占位页」推进到「对外可访问、内容来自两仓真实文档」的文档站。
> 本站是 **聚合展示层**，不生产事实：正文全部来自 `Luminous` / `Lucent` 两仓，此处只做同步、导航与渲染。
> **展示范围是全量镜像**（420 篇 MD + 767 个 compodoc HTML），不做内容筛选。
> 每阶段独立验证、独立提交，不把「内容同步」和「站点功能」压进同一个提交。

## 一、背景：现状与缺口

### 已建成（`Luminary`，4 个提交）

| 提交      | 内容                                       |
| --------- | ------------------------------------------ |
| `59b59ed` | Create Next App 初始化                     |
| `429f2c6` | 接入 Fumadocs，改静态导出 + 路径式路由     |
| `2bd7850` | 接入 shadcn/ui（radix base）主题与基础组件 |
| `b5f1cf1` | 引入 GSAP 与`@gsap/react` 动效底座         |

当前可用：`lib/source.ts`（内容源）、`lib/site.ts`（站点常量）、`lib/layout.shared.tsx`、
`app/(luminous)/luminous/docs/`（文档布局与 `[[...slug]]` 页）、`app/api/search/route.ts`（搜索）、
`components/mdx.tsx`。内容只有 `content/docs/index.mdx` 与 `content/docs/manual/` 两个占位页。

### 缺口（本计划要解决的）

1. **规划文件本身缺失。** `lib/site.ts`、`lib/source.ts`、`next.config.mjs`、`.gitignore` 四处的注释
   都在引用「规划 §4.1 / §4.4 / §7 / §8 / §9」，但该规划从未提交进仓库（`git log --all --name-only`
   中不存在）。**本计划即接管这些引用**：§4.1 静态托管 → 见 §三；§4.4 内容分区 → 见 §四；
   §8 静态导出 → 见 §三；§7 软著一致项与 §9 各项待定 → 见 §七。
   完成后必须回头把上述四处注释的「规划 §x」改为指向本计划或删除。
2. **正文一篇都没接。** `content/docs/{luminous,lucent,api,errors}` 四个目录在 `.gitignore` 里已预留，
   但同步脚本不存在，目录也不存在。
3. **无同步与校验工具。** 没有 `scripts/sync-docs.ts`，也没有「两仓文档更新 → 站点感知」的机制。
4. **站点常量待定项未决。** `site.softwareName` 仍是 `TODO（待定：软著软件全称）`（见 §七.1）。

## 二、两仓可展示文档盘点

### Lucent（NestJS 后端）

**稳定文档**（`docs/reference` / `explanation` / `howto`，均带 front-matter）：

- `reference/`：`glossary`、`environment-variables`（26 KB）、`deployment`（19 KB）、`data-retention`、
  `assistant-safety`、`logging-conventions`
- `explanation/`：`architecture`
- `howto/`：`add-new-module`、`deploy`（12 KB）、`run-medicine-import`、`sync-openapi-client`
- `reference/adr/`：**21 篇 ADR**（0001–0021，只增不改，adr/README.md 为索引）

**模块 README**：`src/modules/` 下 **25 个模块全部有 README**（`auth`、`account`、`user`、
`user-settings`、`user-health-context`、`daily-records`、`assistant`、`today-suggestion`、
`today-analysis`、`reports`、`health-events`、`data-export`、`medicines`、`medicine-dose-logs`、
`medicine-reminders`、`notifications`、`notification-preferences`、`app-info`、`environment`、
`files`、`legal-documents`、`product-events`、`testing-support`、`data-retention`、`audit-log`），
另有 `src/common/README.md`。

**生成物**：

- `docs/reference/generated/openapi.json` — 570 KB，API 合同唯一事实源
- `docs/reference/generated/compodoc/` — **767 个 HTML**（整目录 899 个文件），模块/类依赖图

**归档与流水**（同样展示，见 §六.1）：`docs/archive/` 112 个文件（迁移日志与历史审计）、
`docs/logs/migration-log/` 23 篇、`docs/TODO.md`（14.5 KB）、`plans/` 14 篇。

### Luminous（Flutter 客户端）

**稳定文档**（20 篇，带 front-matter）：

- `product/`：`product-vision`、`product-mvp-scope`、`product-information-architecture`、
  `product-safety-privacy`
- `reference/`：`architecture`、`state-management`、`data-layer`、`routing`、`design-system`、
  `forui-reference`、`localization`、`openapi-client`、`glossary`
- `reference/adr/`：**9 篇 ADR**（0001–0009）
- `explanation/`：`project-governance`、`ai-development-workflow`、`iconmind-assistant-icons`、
  `motion-hierarchy`
- `howto/`：`add-new-feature`、`add-localization`、`regenerate-api-client`
- `reference/generated/`：`design-tokens.md`（12.8 KB）、`routes.md`、`features.md`（带
  `<!-- gen:*:start/end -->` 区域，禁手编）

**feature README**：`lib/features/` 下 **17 个 feature 全部有 README**（`today`、`record`、
`medicine`、`review`、`mine`、`assistant`、`auth`、`health_context`、`health_data`、`health_event`、
`legal`、`notification`、`scan`、`search`、`settings`、`shell`、`support`）。

**归档与流水**（同样展示）：`docs/archive/` 120 个文件（含 100+ 每日条目与旧治理文档）、
`docs/logs/migration-log/` 21 篇、`docs/TODO.md`（15.6 KB）、`plans/` 19 篇。

### 展示口径小结

**结论：两仓 `docs/` 与 `plans/` 下的内容全量展示，不做筛选。** 本站定位为两仓文档的完整镜像，
而非精选摘要——读者需要什么由导航与搜索解决，不由同步脚本预先裁剪。

同步口径下的完整清单（逐目录实测，合计即 **420 篇 MD**）：

| 来源                            | Lucent      | Luminous | 说明                                                  |
| ------------------------------- | ----------- | -------- | ----------------------------------------------------- |
| `docs/reference/*.md`（顶层）   | 6           | 9        | 稳定参考文档                                          |
| `docs/reference/adr/`           | 22          | 10       | 21+9 篇 ADR，各含 1 篇`README.md` 索引                |
| `docs/explanation/`             | 1           | 4        |                                                       |
| `docs/howto/`                   | 4           | 3        |                                                       |
| `docs/product/`                 | —           | 4        | Luminous 独有                                         |
| 模块 / feature README           | 25          | 17       | `src/modules/*/README.md`、`lib/features/*/README.md` |
| `docs/archive/`                 | 112         | 120      | 全量，含按月归档的迁移日志                            |
| `docs/logs/`                    | 23          | 22       | migration-log + Luminous 的`MigrationLog.md` 入口     |
| `docs/TODO.md`                  | 1           | 1        |                                                       |
| `plans/`                        | 14          | 19       | Lucent 另有 1 个非 MD 文件，见下方说明                |
| `docs/reference/generated/*.md` | 0           | 3        | Luminous 的 design-tokens / routes / features         |
| **MD 小计**                     | **208**     | **212**  | **合计 420**                                          |
| `openapi.json`                  | 1（570 KB） | —        | 生成 API 参考                                         |
| `compodoc/`                     | 767 HTML    | —        | 整目录托管，外链                                      |

规模提示：420 篇 MD + 767 个 HTML 是**大站**。导航必须靠 `meta.json` 显式分层（见 Phase 2），
不能依赖 Fumadocs 的目录默认展开。

> **非 MD 文件**：`Lucent/plans/_naming-lookup.json` 不是文档，同步脚本**必须跳过**
> （否则会被当 MDX 解析而报错）。

## 三、托管与构建（§4.1 / §8 已决）

- **纯静态导出**：`output: 'export'`，`images.unoptimized: true`，产物在 `out/`。
- 全部路由构建期确定，**无 SSR / ISR / Server Actions**，因此不需要常驻 Node 进程，
  也不引入 `proxy.ts`。
- 上传 OSS/COS + CDN 直出；图片交由 OSS/COS 边缘图片处理。
- 单一域名 + 路径式：`devluo.com`（个人站 `/`）、`/luminous`（产品页）、`/luminous/docs`（文档）。
- `baseUrl` 必须恒等于公开路径 `/luminous/docs`（路径式拓扑下写错会导致全站链接 404）。

## 四、内容分区设计（§4.4 已决）

```
content/docs/
  index.mdx            手写：文档总览（已存在）
  manual/              手写：面向使用者的图文操作手册（已存在）
  luminous/            同步自 Luminous/（docs 全量 + plans + feature README）
  lucent/              同步自 Lucent/（docs 全量 + plans + 模块 README）
  api/                 生成：fumadocs-openapi 读 openapi.json
  errors/              手写：RFC 9457 错误码参考
```

每个分区内部再按两仓已有目录结构分层，`archive/` 与 `logs/` 原样保留为子目录，
使站点结构与源仓库一一对应（读者对照源码时不需要二次换算）。

同步源与目标的映射：

| 目标                        | 源                                             | 处理                                                         |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `luminous/reference/*.md`   | `Luminous/docs/reference/*.md`                 | 搬运，保留 front-matter                                      |
| `luminous/product/*.md`     | `Luminous/docs/product/*.md`                   | 同上                                                         |
| `luminous/explanation/*.md` | `Luminous/docs/explanation/*.md`               | 同上                                                         |
| `luminous/howto/*.md`       | `Luminous/docs/howto/*.md`                     | 同上                                                         |
| `luminous/adr/*.md`         | `Luminous/docs/reference/adr/*.md`             | 同上                                                         |
| `luminous/features/*.md`    | `Luminous/lib/features/*/README.md`            | 重命名`<feature>.md`，补 title                               |
| `luminous/archive/**`       | `Luminous/docs/archive/**`                     | 原样搬运                                                     |
| `luminous/logs/**`          | `Luminous/docs/logs/**`                        | 原样搬运                                                     |
| `luminous/todo.md`          | `Luminous/docs/TODO.md`                        | 重命名，补 title                                             |
| `luminous/plans/*.md`       | `Luminous/plans/*.md`                          | 搬运（`README.md` → `index.md`）                             |
| `lucent/reference/*.md`     | `Lucent/docs/reference/*.md`                   | 搬运                                                         |
| `lucent/explanation/*.md`   | `Lucent/docs/explanation/*.md`                 | 同上                                                         |
| `lucent/howto/*.md`         | `Lucent/docs/howto/*.md`                       | 同上                                                         |
| `lucent/adr/*.md`           | `Lucent/docs/reference/adr/*.md`               | 同上                                                         |
| `lucent/modules/*.md`       | `Lucent/src/modules/*/README.md`               | 重命名`<module>.md`，补 title                                |
| `lucent/archive/**`         | `Lucent/docs/archive/**`                       | 原样搬运                                                     |
| `lucent/logs/**`            | `Lucent/docs/logs/**`                          | 原样搬运                                                     |
| `lucent/todo.md`            | `Lucent/docs/TODO.md`                          | 重命名，补 title                                             |
| `lucent/plans/*.md`         | `Lucent/plans/*.md`                            | 搬运（`README.md` → `index.md`，跳过 `_naming-lookup.json`） |
| `api/**`                    | `Lucent/docs/reference/generated/openapi.json` | fumadocs-openapi 渲染                                        |
| `errors/**`                 | 手写（见 Phase 3）                             | 对照`problem-catalog.ts` 与 ADR-0012                         |
| `public/compodoc/**`        | `Lucent/docs/reference/generated/compodoc/`    | 整目录拷贝，外链入口                                         |

### 关于相对链接（已决：不管）

两仓文档大量使用跨仓相对路径（如 Lucent 模块 README 里的 `../src/...`、
`../../docs/reference/...`），搬进站点后这些链接指向站点内不存在的路径。

**决策：不做改写，原样透传。** 理由是改写需要为每类链接维护一套映射规则，
收益仅是让少量交叉引用可点，而站点的主要入口是导航与搜索。
后果需接受：部分正文内的相对链接会 404。

因此本站**不设置全站死链门禁**（Phase 5 只校验构建成功与同步完整性，不校验正文链接）。
`src` 路径记号、`plans/README` 引用等在两仓由各自的 `docs:links` / `verify` 把关，那是仓库内的职责。

## 五、阶段清单

> 状态（2026-09-28）：**Phase 0 已跳过**（用户决定）；**Phase 1、Phase 2 已完成**并端到端验证。
> Phase 3–5 未开始。下方各阶段保留原计划文字，完成项在标题后标注结果。

### Phase 1：同步脚本 + 全量内容 —— ✅ 已完成

- ✅ 新增 `scripts/sync-docs.ts`：按 §四 映射表读两仓 → 写入 `content/docs/{luminous,lucent}/`。
  幂等、可重复运行、生成目录整体先清空再写（避免源文件删除后站点残留）。
- ✅ front-matter 规整：补 `title`（缺省取 H1，再缺省取文件名），保留 `description`。
- ✅ **`_naming-lookup.json` 已跳过**（plans 规则用 `filter: isMarkdown`）。
- ✅ `package.json` 增加 `sync:docs` script（`node scripts/sync-docs.ts`，Node 24 原生跑 TS，
  不引入 tsx/ts-node，也不产生任何 `.js`）。
- ✅ 验收通过：`写入 420 篇，跳过 1 篇`，20 个分区逐一对齐 §二 清单，`mismatches = 0`。

实施中修正的两处偏差：

1. **搬迁规则需要 `flat` 概念**。`Luminous/docs/reference/adr/` 这类目录既整体搬到
   `reference/` 又要单独搬到 `adr/`，首版递归导致 ADR 被写两遍（455 篇）。给每条规则
   加 `flat?: boolean`，6 条扁平规则显式置 `flat: true` 后精确回到 420。
2. **MDX 语法冲突必须转义**。文档正文含 `Promise<T>`、`{prefix}/{userId}` 等，会被当 JSX
   解析而构建失败。脚本对非代码块行做实体化（`<`→`&lt;`，`{`→`&#123;`，`}`→`&#125;`），
   保留 ``` / ~~~ 围栏内原文。实测 254 篇、2764 处，构建无解析错误。

### Phase 2：导航与搜索（大站的关键）—— ✅ 已完成

- ✅ 手写 `meta.json` 定义标题、顺序与折叠；两仓分区均为：
  稳定文档（reference / product / explanation / howto / adr / modules / features / generated）
  → `---归档与流水---` 分隔符 → `plans` / `logs` / `archive` / `todo`。
- ✅ `archive`、`logs`、`plans` 默认折叠；`archive/` 内部按 `2026-05`…`2026-08` 分组。
- ✅ 侧边栏 `data-state="closed"` 38 个 / `open` 3 个，符合「默认收起」预期。
- ✅ 搜索索引 **487 MB → 10.4 MB**，中文与英文查询均命中（详见下方「搜索踩坑」）。
- ✅ 验收通过（浏览器实测）：层级清晰不冗长；归档/日志默认折叠；
  6 组查询（环境变量 / 用药提醒 / Riverpod / 错误码 / medicine / 归档）各返回 17–20 条真实结果。

#### 搜索踩坑记录（三个独立缺陷，都会「静默失败」）

这三点都不是配置微调，任何一个未修复都会让搜索完全不可用，且**不报错**：

1. **索引体积爆炸**。默认 `tokenize: "full"` 把每个词的所有子串都建索引，中文按字切分后
   组合数极大：420 篇导出 **648 MB**，单键 `content.1.map` 达 297 MB，超 V8 单字符串上限，
   构建直接抛 `RangeError: Invalid string length`。
   改为 `tokenize: 'strict'` + `encoder: Charset.CJK` + 每页正文截断到 6 块 × 400 字 → **10.4 MB**。
   `Charset.CJK` 让中文按字编码，召回反而优于默认编码器。
2. **参数放错层级**。`tokenize` / `encoder` 必须作为 `document` 的字段传入：
   调用链 `flexsearchFromSource` → `server()` → `createDocument(options.document)`，
   中间 `server()` **只取 `options.document`**，放顶层的这两个键会被直接丢弃
   （实测体积与默认完全一致）。而上游类型未透出它们，故此处的类型断言是必要的。
3. **客户端与服务端配置漂移**。`flexsearchStaticClient` 内部写死 `createDocument()`
   （`full` + 默认编码器）且不接受参数；用它导入本站索引时 flexsearch **不报错**，
   只是所有查询返回空——表现为「弹窗能开、输入无结果」。
   因此 `components/search.tsx` 自行实现 `SearchClient`，与构建侧共用
   `lib/search-config.ts` 中的同一份参数，从结构上杜绝漂移。

#### 导航产物为什么不直接手写在 `content/docs/` 下

`sync:docs` 会整体清空 `content/docs/{luminous,lucent}/` 再重写，手写文件放那里会被删掉。
因此导航源文件放在 **`content/nav/`**（提交进 git），由脚本在同步末尾复制到 `content/docs/`；
复制产物已在 `.gitignore` 中排除。


### Phase 3：API 参考、错误码与 compodoc

- 引入 `fumadocs-openapi`，从 `Lucent/docs/reference/generated/openapi.json` 生成 `content/docs/api/`。
- **手写 `content/docs/errors/`**：RFC 9457 错误码参考。信息源为
  `Lucent/src/common/api/problem-catalog.ts` 的头注释与 ADR-0012，
  但**以手写维护**（不做自动提取），错误码变更时人工同步。
  注意这偏离了两仓「可生成内容不手写」的约定，是显式接受的取舍。
- 拷贝 compodoc 产物到 `public/compodoc/`，在文档站给出入口链接。
  **注意**：767 个 HTML 体积较大（见 Phase 5 的构建影响）。
- 验收：API 参考页列出全部端点与 schema；错误码页与 `problem-catalog.ts` 当前内容一致；
  compodoc 入口可访问。
- 提交：`feat(luminary): 生成 API 参考并补错误码与 compodoc 入口`。

### Phase 4：使用手册

- 扩充 `content/docs/manual/`：现有 `medicine-reminder.mdx` 是唯一的真实教程页，
  其余四个 Tab（今日 / 记录 / 回顾 / 我的）需要补齐。
- 验收：五个 Tab 均有教程页，且只写用户可见的操作，不复制开发者文档。
- 提交：`docs(luminary): 补全使用手册`。

### Phase 5：CI 与发布

- 增加「两仓文档变更 → 站点重建」的触发路径。
  因**同步内容不进 git**，构建必须能读到两仓工作区 → CI 需同时 checkout `Luminary`、
  `Luminous`、`Lucent` 三个仓库。
- 门禁范围：`pnpm sync:docs` 成功、`pnpm build` 成功、同步后的文件数与源计数一致。
  **不做全站死链校验**（见 §四「关于相对链接」）。
- 构建耗时需实测：compodoc 767 个 HTML 的拷贝与 Next 静态导出的规模效应。
- ⚠️ **产物体积需在发布前决策（Phase 1/2 实测）**：`out/` 当前 **315.6 MB / 2600 文件**，
  其中文档 HTML **303 MB**。原因是每页都内联完整侧边栏（430 条链接的页面树），
  单页 HTML 达 **630–720 KB**（最大的 `archive/2026-07/2026-07-10.html` 为 720 KB）。
  影响三处：CDN 存储与回源成本、首屏 HTML 传输（gzip 后仍可观）、CI 构建与上传耗时。
  可选缓解（按代价从低到高）：开启 CDN Brotli、给 `archive`/`logs` 页面关掉全量侧边栏、
  对归档做分页或惰性加载侧边栏。**该项不阻塞 Phase 1/2 验收，但发布前必须定调。**
- 已知无害噪声：静态导出下 Next 会请求 `__next.<hash>.txt?_rsc=...` 形式的 RSC
  预取载荷，产物里实际是 `__next._full.txt` / `__next._tree.txt`，故这些预取请求 404。
  页面渲染与导航不受影响（已实测），属 Next 16 静态导出的既有行为，非本次改动引入。
- 验收：从干净 clone 出发，checkout 三仓后 `pnpm install && pnpm sync:docs && pnpm build`
  产出可用的 `out/`。
- 提交：`ci(luminary): 文档站构建与发布`。

## 六、已决事项

以下均已拍板，实施时不再重新讨论：

1. **展示范围**：两仓 `docs/`（含 `archive/`、`logs/`、`TODO.md`）与 `plans/` 的 33 篇
   **全量展示**，不筛选。
2. **相对链接**：不做改写，原样透传；接受部分正文内相对链接 404；
   本站不设全站死链门禁。
3. **同步内容不进 git**：`content/docs/{luminous,lucent,api,errors}` 与 `public/compodoc/`
   沿用 `.gitignore` 现状，全部为构建期产物。
   → 直接后果：CI 必须同时 checkout 三仓（已写入 Phase 5）。
4. **错误码页手写**：`content/docs/errors/` 人工维护，不做自动提取。
5. **个人站（`/`）**：后置，不在本计划范围内；`app/(devluo)/page.tsx` 保持占位。
6. **域名与备案**：已完成，不构成 Phase 5 的阻塞项。

## 七、待定事项

1. **软著一致项**：`site.softwareName` 仍是 `TODO（待定：软著软件全称）`，
   `site.version` 为 `0.1.0`。softwareName 需与软著申请表、源程序页眉、说明书页眉三处
   **逐字一致**，是最高频的补正原因。拍板后只改 `lib/site.ts`。
   —— 该项不阻塞 Phase 1–4，但对外发布前必须确定。

## 八、不做的事

- 不在本站手写 endpoint 散文、不改写两仓文档的事实内容（本站是展示层）。
- 不筛选内容：不因「归档 / 内部台账」而排除任何 `docs/` 或 `plans/` 下的文档（见 §六.1）。
- 不改写正文里的相对链接，不设全站死链门禁（见 §四、§六.2）。
- 不从 `problem-catalog.ts` 自动提取错误码（见 §六.4）。
- 不把同步产物提交进 git（见 §六.3）。
- 不引入 SSR/ISR/Server Actions（与静态导出决策冲突）。
- 不新建第二个文档站；`Lumos-docs/` 已废弃，不再作为目标。
