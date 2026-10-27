# 单药分析（`/analysis/drug`）实施计划

> 2026-10-26 起草；**2026-10-27 按全量导入后的实测数据修订**。
> 执行完毕即删（ADR-0002 规则 3）。
> 范围：**仅单药分析**（`apps/lumine`），含所需的后端改动与 `PRODUCT.md` 修订。
> 多药分析（`/analysis/combination`）与结构分析（`/analysis/structure`）不在本计划内。

## 修订摘要（2026-10-27）

DrugBank 全量导入完成（19,842 药 / 291 万相互作用 / 14,622 结构），本次按实测数据重核了
计划里的每一条数据假设，改了四处**会直接导致返工**的判断：

| 原判断 | 实测 | 改动 |
| --- | --- | --- |
| ego 图「约 30 个邻居，SVG 足够」 | 相互作用度数**中位数 542**，`DB00176` 是 **2,249** | §3.4 改为**限流图**（30 节点 + 展开 + 未显示总数） |
| 节点上限 200 | 200 个节点已是毛球且无排序规则 | §6.1 上限改 **30**，加排序规则与 `truncated` |
| §6.0 导入未做 → A1/A2 无数据 | 已全量完成，外键孤儿 0 | 第 0 项**关闭**，不再是任何事项的前置 |
| §6.1 需新增 `/network` 端点 | 已有 **9 个**语义关系端点，但走 Neo4j 且**未配置** | §6.1 澄清共存关系与降级现实 |
| 页面按字段区块组织 | 覆盖率最好的字段也只有 73.7%，`toxicity` 仅 13.1% | §3.0 新增定位与三条页面原则，加 `CoverageOverview` |

---

## 一、设计判读（taste-skill §0.B）

> **Reading this as: 内部研究工具的密集数据界面（不是落地页），受众是药学分析者，语气是"仪器读数"而非"营销"，沿用既有的 shadcn/Base UI + Tailwind v4 体系。**

**`taste-skill` 对本次任务部分不适用，这里如实说明**（其 §13 明确把 dashboards / data tables 列为 out of scope，并指示"say so explicitly, point to the right tool"）：

| taste-skill 章节 | 是否适用 | 处理 |
| --- | --- | --- |
| §0–§2 设计判读与设计系统选型 | 部分 | 判读要做；选型**不换**——§2.A 说 dashboard 该用 Fluent/Carbon，但 §2.A 同时规定 "One system per project"，本项目已是 shadcn，换系统等于重写 |
| §3.C 图标 | **适用** | 见 §五.2，当前混用 tabler 与 lucide，违反"one family per project" |
| §4.4 卡片与形状一致性 | **适用** | §4.4 规定 `VISUAL_DENSITY > 7` 时禁止通用卡片容器；本页密度取 8 |
| §4.5 交互状态 | **适用** | 骨架屏 / 空态 / 错误态 / 按下反馈，逐项落地 |
| §6 性能与可访问性 | **适用** | 表格与图节点键盘可达、对比度 |
| §7 `VISUAL_DENSITY` 8–10 | **适用** | "1px lines separate data"、"`font-mono` for all numbers" |
| §8 暗色协议 | **适用** | 含"no pure `#000000` / `#ffffff`"，与既有 `vercel.css` 现状一致；§8.D 要求两种主题都实测 |
| §9.A 纯黑、霓虹 | **适用** | — |
| §9.D 禁止假精确数字 | **适用** | 覆盖率必须报真实值（13%、3.3%、0.4%），不得凑整 |
| §9.F 禁填充式进度条 | **适用** | 覆盖率不用进度条；雷达图加数值标签规避同类问题（§3.4） |
| §9.F 禁 em-dash | **不适用** | 该条针对英文营销文案；中文界面里 `——` 是正常标点，不套用 |
| §4.7 英雄区规则、§9.C 三列卡片、§4.8 配图 | **不适用** | 无英雄区、无营销区块 |
| §10 参考词汇、§12 Block Library | **不适用** | 营销区块库，无数据可视化条目（这也是它自述 out of scope 的一部分） |

**三个 dial**：`DESIGN_VARIANCE: 3`（工具界面要可预测，不是艺术排版）、`MOTION_INTENSITY: 2`（静态为主，仅状态过渡）、`VISUAL_DENSITY: 8`（仪表盘密度）。

---

## 二、事实核查：`PRODUCT.md` 与代码/数据现状的六处不一致

这几处必须先修，否则计划会建在错误前提上。全部为**实测**结论（dev 库 `lucent-postgres-dev:15432`、源文件 `DrugDataBase/`）。

### 2.0 【曾是最严重】`drugbank_drug_targets` 与 `drugbank_targets` 曾是**空表**（2026-10-27 已解决）

实测各表行数：

| 表 | 行数 |
| --- | --- |
| `drugbank_drugs` | **100** |
| `drugbank_targets` | **0** |
| `drugbank_drug_targets` | **0** |
| `drugbank_structures` | **0** |
| `drugbank_target_sequences` | **0** |
| `drugbank_drug_sequences` | 0 |
| `drugbank_patents` | 409 |
| `drugbank_properties` | 578 |
| `drugbank_fingerprints` | 8 |

`drug_source_imports` 台账里**根本没有 `drugbank_targets_*` / `drugbank_structures` 的导入记录**（只有 drugs / patents / properties / fingerprints / pathways / reactions / snp / calculated / experimental 九项）。

三个后果：

1. **A1 成药性评估也不成立。** `structure` 字段来自 `drugbank_structures`，该表为空 → `MedicineDetailResponse.structure` 全为 `null` → 雷达图与 Lipinski 逐项**全部无数据**。我在上一版计划里写"A1 全部已在库，零后端改动"，那是**错的**：字段定义在，但**没有数据**。
2. **A2 靶点分析不成立**，原因不只是缺引用列，而是整张关系表为空。
3. **`drugbank_drugs` 只有 100 行**（DB00001–DB00108），是一次 `--limit` 开发抽样；`DB00176` 等常用验证对象**不在库里**。所以"用 DB00176 验收"在当前数据下会直接查不到。

**源数据是齐的**，这是好消息：

- `DrugDataBase/raw/drugbank/all.csv`（1.2 MB，5,096 行目标）——`drugbank_targets-all` 的源
- `DrugDataBase/raw/drugbank/full database.xml`（**1.82 GB**）——含 `<targets>` / `<enzymes>` / `<carriers>` / `<transporters>` 与每个 target 下的 `<references><articles><article><pubmed-id>` + `<citation>`
- 导入器与解析器**都已存在**：`parsers/drugbank_targets.py`、`drugbank_structures.py`、`drugbank_target_sequences.py`、`drugbank_drug_sequences.py`、`drugbank_external_links.py`

**结论：这不是"写代码"的问题，是"没跑导入"的问题。**

> **2026-10-27 修订（重要）**：本节初稿写「不需要改 Lucent 代码」。**Lucent 侧代码已经改完了**：
> 6 个 JsonB 列（`groups` / `classification` / `synonyms` / `products` /
> `drug_interactions` / `external_identifiers`）已提升为 9 张关系表并删除原列，
> `DrugbankMedicinesService` 改为 include 关系表。
>
> **2026-10-27 二次修订：全量导入已完成，本节的问题全部关闭。** 25 个 DrugBank 命令全量跑完，
> 实测（dev 库）：
>
> | 表 | 行数 | | 表 | 行数 |
> | --- | --- | --- | --- | --- |
> | `drugbank_drugs` | 19,842 | | `drugbank_targets` | 6,565 |
> | `drugbank_drug_targets` | 34,441 | | `drugbank_structures` | 14,622 |
> | `drugbank_drug_interactions` | 2,911,156 | | `drugbank_fingerprints` | 14,615 |
> | `drugbank_products` | 468,460 | | `drugbank_synonyms` | 52,154 |
>
> 37 条外键孤儿数为 0；`DB00176` 已在库。**§2.0 的三条后果全部失效**，A1 与 A2 现在有数据可显示。
>
> **对 Lumine 的含义**：
> 1. API 契约**没有变**（端点与响应字段形状不变），`pnpm contract` 无需重跑。
> 2. `drugbank_drug_interactions` 里 **96% 的对方药物不在 `drugbank_drugs`** 这一结论
>    在全量后依然成立（该表故意不建指向药物的外键）。前端必须处理「对方药物不在本库」。
> 3. 详情接口的 `drugInteractions` **只返回前 200 条**，而真实的单个药物相互作用度数
>    中位数是 **542**——见 §3.4 的修订，这条直接推翻了 ego 图的原始设计。
> 4. 全量导入暴露并修复了 4 个只在全量下复现的导入缺陷（残留 JsonB 列、活跃靶点路径
>    重复拼接、指纹白名单缺省、**`drugbank_products` 身份键过窄丢 37,059 行**），
>    详见 `Lucent/docs/logs/migration-log/2026-10-27.md`。

### 2.1 A2 的「PubMed 引用」——源里有，未落库

实测 `full database.xml` 中 `DB00176` 的 `<targets>` 块：单个 target 下带 12 个 `<references>`，每个含 `pubmed-id` 与完整 `citation` 文本（例：`<pubmed-id>11304754</pubmed-id>` + Kakiuchi 等 2001 年那篇）。

而 `DrugbankDrugTarget` 模型的列只有 `drugbankId` / `targetId` / `relationKind` / `actions` / `knownAction`——**没有引用列**。

所以 `PRODUCT.md` §五 A2 的「数据自带引用，天然满足可溯源要求」需要区分两件事：

- **源数据里确实有引用** → 该卖点成立，只是没落库；
- **当前 API 返回不了** → 需要新增列 + 导入器扩展（`applyXmlTargetActions` 已在解析同一份 XML，扩展它即可）。

### 2.2 §十 的 `/api/v1/workbench/*` 前缀不存在

查证：Lucent 下**没有 workbench 模块**，只有 `medicines.controller.ts` 与 `medicines-relations.controller.ts`，路径都是 `/api/v1/medicines/*`。

### 2.3 §三 说 patents / properties / fingerprints「未导入」——实际已导入

实测：`drugbank_patents` 409 行、`drugbank_properties` 578 行、`drugbank_fingerprints` 8 行，台账里都有 completed 记录。**§三 这一条是过期描述**。

但它们**都不在 `MedicineDetailResponse` 里暴露**，所以"能查到"与"能通过 API 拿到"是两件事。

### 2.4 【关键】"按名查询"端点已存在，但搜索能力有明确缺口

讨论中提到的"Lucent 提供一个按药品名查药品信息的端点"**已经存在**：`GET /api/v1/medicines?q=&source=&page=&pageSize=`。

实测其实现（`infrastructure/persistence/drugbank.ts` 的 `buildWhere`）：

```ts
OR: [
  { searchText: { contains: q, mode: 'insensitive' } },
  { OR: [ { name: ... }, { casNumber: ... }, { unii: ... } ] },
]
```

即：`name` / `casNumber` / `unii` / `searchText` 四个字段 `contains` 模糊匹配。

**`searchText` 不是"只有药名"**——导入时拼进了 `synonyms[:20]`（`parsers/drugbank_drugs.py` 的 `build_search_text([name, primary_id, cas_number, unii] + secondary_ids + groups + synonyms[:20])`）。实测 `DB00003` 的 `search_text` 里确实含第 3 个同义词 `Dornasa alfa`。

所以缺口是这三条，而不是"同义词搜不到"：

| 缺口 | 说明 |
| --- | --- |
| **中文名搜不到英文药** | `source=cn` 与 `source=drugbank` 是两套表不混排。**且按 ADR-0008 这属于"不做"**（不维护 CN↔DrugBank 映射），跨源由 LLM 工具链处理，见 §6.5 |
| **同义词有截断且不可区分** | 只取前 20 条（实测仅 4 个药超过 20 条，影响小）；且命中后无法知道命中的是哪个同义词、无法按语言 / INN 标记筛选 |
| **无相关度排序** | `orderBy: name asc`；数据量 19,842 下暂不影响 |

**因此本计划不新增"按名查询"端点**（避免两份语义重叠的搜索），搜索增强按 §6.5 建表解决。

### 2.5 `PRODUCT.md` §2.5「已入库情况」整体过期

§2.5 的表格称「DrugBank 主表 ✅ 已导入」「成药性全套字段 ✅ 已导入」「靶点关系 ✅ 已导入」，实测只有主表（且仅 100 行抽样）成立，靶点与结构均为空表。该表需要按 §2.0 的实测数据重写。

---

## 三、页面规划

### 3.0 范围与定位（2026-10-27 补充）

侧边栏「分析」下有**三个并列入口**：单药分析（`/analysis/drug`）、多药分析
（`/analysis/combination`）、结构分析（`/analysis/structure`）。

**本计划只覆盖单药分析。** 多药分析（相互作用、联合用药）与结构分析各有独立计划，
这里不实现、也不为它们预留抽象——三者共享的只有"搜索并选中药品"这一个动作，
真出现第二处重复再抽取。

**定位：把药品当成一个待判读的对象，而不是一条待翻阅的记录。**

普通药品查询网站的骨架是「身份区 → 字段区块从上往下堆」，本质是数据库行渲染，
隐含假设是"用户在找某个字段"。但单药分析的隐含问题是"**这个药是什么、作用在哪、
和谁像、风险在哪**"。两者的差别在覆盖率上被放大：

| 字段 | 有值的药 | 覆盖率 |
| --- | --- | --- |
| `indication`（适应症） | 4,479 / 19,842 | 22.6% |
| `mechanism_of_action` | 4,252 / 19,842 | 21.4% |
| `atc_codes` | 3,636 / 19,842 | 18.3% |
| `pharmacodynamics` | 3,252 / 19,842 | 16.4% |
| `toxicity` | 2,609 / 19,842 | 13.1% |
| `half_life` | 2,537 / 19,842 | 12.8% |
| `food_interactions` | 1,453 / 19,842 | 7.3% |
| 有靶点 | 9,884 / 19,842 | 49.8% |
| 有结构描述符 | 14,622 / 19,842 | 73.7% |
| 有相互作用 | 4,631 / 19,842 | 23.3% |

**没有任何一个字段是全覆盖的。** 照搬查询网站的结构，意味着在大多数药上会摊开
一片"暂无数据"——这恰恰是查询网站体验最差的地方。所以本页的骨架要按"**有数据才
展开，缺数据要说明为什么缺**"来组织，而不是按字段清单组织。

据此确定三条页面原则：

1. **覆盖率是一等信息，不是免责声明**：每个区块显示"该药此字段有/无"，整页顶部给一个
   数据完整度概览。用户应当一眼知道"这个药我还能问到什么"。
2. **先结论后证据**：身份与判定在上，长文本（描述、适应症、毒性原文）默认折叠。
3. **不伪造空态**：没有数据就说"无数据 + 全库覆盖率"，不许用"—"糊过去，也不许
   隐藏区块（隐藏会让人以为这个药根本没这个字段）。

### 3.1 路由与 URL 状态

```
/analysis/drug                      未选药物：展示搜索与最近打开
/analysis/drug?id=DB00176           选中药物
```

选中态放在 **search param**（不是路径段）：TanStack Router 的 `validateSearch` 能拿到类型化的 `id`，且分享链接、前进后退都自然可用。放在路径段会让 `/analysis/drug/DB00176` 与"未选中"变成两个路由文件。

### 3.2 布局

按 `VISUAL_DENSITY: 8`，**不用卡片分块**，改用发丝线分隔的单一滚动列 + 右侧粘性栏：

```
┌─ 搜索框（常驻在页面顶部，不是 Cmd+K）────────────────────┐
├──────────────────────────┬──────────────────────────────┤
│ 主列（min-w-0）          │ 侧栏（lg 起，sticky）        │
│                          │                              │
│ 身份区                    │ 数据完整度概览               │
│  名称 / DB ID / CAS       │  有值 6 / 12 项              │
│  分子式 / 分子量 / 状态    │  缺：毒性、半衰期 …          │
│ ────────────────────     │                              │
│ 作用概览（A2 摘要）        │ 成药性判定（A1）             │
│  靶点数 / 作用类型分布     │  违规数 1 / 4 规则逐行       │
│  度数：相互作用 2,249      │                              │
│ ────────────────────     │ 交叉引用（A5）               │
│ 关系网络（A6，限流图）     │  UniProt / PDB / KEGG …      │
│  30 节点 + 可展开          │                              │
│  「还有 N 个未显示」       │ 成药性雷达图（A1）           │
│ ────────────────────     │                              │
│ 靶点表（A2，含引用）       │ 数据来源与日期               │
│ ────────────────────     │                              │
│ 药代动力学（A12）         │                              │
│ ────────────────────     │                              │
│ 毒性（A13，默认折叠）      │                              │
└──────────────────────────┴──────────────────────────────┘
```

要点：

- **未选中时不渲染空壳**：整页只显示搜索框 + `Empty` 引导，不画占位表格。
- **侧栏只放"结论"**：完整度、判定、交叉引用是扫一眼就要的信息，滚动时不希望丢失，所以粘性。
- **分子式、分子量、logP、TPSA、半衰期数值一律 `font-mono`**（taste-skill §7）。
- **每个数值区都带覆盖率**：`toxicity` 覆盖 13.1%、`half_life` 12.8%，缺失时显示"无数据"而非空白（`PRODUCT.md` §五 B2 已明确要求"不能推测"）。
- **关系网络内嵌在主列**，不跳页：单药分析的核心问题就是"这个药作用在什么上"，图与靶点表是同一份数据的两种读法，分开放会让人来回跳。
- **度数先于图**：「相互作用 2,249 · 靶点 3」这行数字比图更早给出结论，图是它的展开。

### 3.3 各区块的字段映射

| 区块 | 数据来源（当前 API） | 备注 |
| --- | --- | --- |
| 身份 | `MedicineDetailResponse.detail`：`description` / `drugType` / `groups` / `state` / `synonyms` / `atcCodes` / `categories`；`structure.formula` / `molecularWeight` / `exactMass` / `iupacName` / `inchiKey` | `groups` 四态用 `Badge` 分色（approved / withdrawn / investigational / vet_approved） |
| 成药性 A1 | `structure`：`ruleOfFive` / `acceptorCount` / `donorCount` / `rotatableBondCount` / `logP` / `alogpsLogP` / `polarSurfaceArea` / `polarizability` / `ringCount` / `ghoseFilter` / `veberRule` / `bioavailability` / `mddrLikeRule` | ⚠️ **字段齐全但 `drugbank_structures` 是空表**，需先跑导入（§6.0） |
| 靶点 A2 | `detail.targets[]` | ⚠️ `drugbank_drug_targets` 为空表；引用列还需 §6.2 |
| 药代 A12 | `halfLife` / `proteinBinding` / `absorption` / `metabolism` / `clearance` / `volumeOfDistribution` / `routeOfElimination` | **原文文本**，不做数值解析；如需比较，解析结果必须标注"解析所得"（§五 A12） |
| 毒性 A13 | `toxicity` | 覆盖率 13%，必须显著提示"多为动物实验，不能外推到人" |
| 交叉引用 A5 | `externalIdentifiers[]` / `externalLinks[]` | 纯链接，实现最简 |
| 关系网络 A6 | **需新增端点**，见 §3.4 | 数据已在 `drugbank_drug_targets`（当前为空，需第 0 步导入）；**替代方案**：`drugbank_drug_interactions` 已有 51,606 条，可先做「相互作用网络」而非「靶点网络」 |
| 成药性雷达图 A1 | 由 `structure` 的 6 个描述符归一化后绘制 | 归一化区间需固定，见 §3.5 |
| 中文对照 | **不做** | 违反 ADR-0008（不维护 CN↔DrugBank 映射），见 §6.6 |

### 3.4 可视化：三处，各有明确职责

单药分析要有可视化，但不能为了"有图"而画图。按 taste-skill §9.D「禁止假精确数字」与 §7 密度要求，这里只放**承载信息**的三处：

#### (1) 关系网络 —— 核心可视化（**2026-10-27 按实测重写**）

> **原设计作废。** 初版假设「单药 ego 网络约 30 个邻居（DB00176 度数 32），SVG 足够」，
> 结论是画一张完整的星形 ego 图。全量导入后实测该假设**不成立**：
>
> | 指标（`drugbank_drug_interactions`） | 实测 |
> | --- | --- |
> | 单药度数 中位数 / p90 / 最大 | **542 / 1,396 / 2,637** |
> | `DB00176`（Fluvoxamine）度数 | **2,249** |
> | 对方药物在 `drugbank_drugs` 内的比例 | 2,911,056 / 2,911,156（该列无外键，仍须容错） |
>
> 并按靶点侧核对：
>
> | 指标（`drugbank_drug_targets`） | 实测 |
> | --- | --- |
> | 单药靶点数 中位数 / p90 / 最大 | **2 / 7 / 306** |
> | 度数 > 100 的靶点数 | 19 |
>
> 也就是说：**相互作用侧画全图会得到 2,249 条边的毛球，靶点侧才 2–3 条边画不出东西。**
> 初版的"约 30 个邻居"是拿 Semantica 的导出样例估的，不是从本库测的——这是本次修订
> 发现的最严重的计划缺陷。

**新设计：限流的可探索图（Neo4j Browser 式三栏）**

不画"全图"，而是做**可步进的探索图**：一次只画用户当前关注的邻域，其余用计数表示。

```
┌─ 左：图例与筛选 ──┬─ 中：画布（限流）─────────┬─ 右：当前选中节点详情 ─┐
│ 关系类型开关      │  30 个邻居 + 1 个中心      │ 名称 / ID / 类型       │
│  ○ 靶点/酶        │  ↓ 拖动/滚轮缩放           │ 该节点的边（可点）     │
│  ○ 转运体         │  「还有 2,219 个未显示」   │ 「以此为起点重新展开」  │
│  ○ 相互作用       │  [展开这个节点] 按钮       │                        │
└───────────────────┴────────────────────────────┴────────────────────────┘
```

要点（每一条都是为了避免"画了个毛球"）：

- **限流规则**：初始节点数上限 **30**，默认按关系类型优先级选取——靶点/酶/转运体
  优先（稀疏、信息密度高），相互作用只在用户显式打开时纳入，且**取 Top-N（默认 20）
  按 `actions` 数量与是否有已知机理排序**，不是随机取。
- **必须显示被截断的数量**：画布上常驻「还有 2,219 个未显示」，不是静默少画。
  这是 `PRODUCT.md` §7「节点数量控制」的要求。
- **展开是用户动作**：点任意节点可"以此为起点展开"，等价于一次新的邻域查询。
  这条让 2,249 度的药可探索，而不需要一次渲染。
- **度数本身是信息**：中心节点旁边直接标「相互作用 2,249 · 靶点 3」，不进图也能读到。
- **不引入力导向**：30 个节点用手算的放射布局（靶点在外环按类型分组），
  比力导向稳定、可预测、不会每次打开形状都变。
- **对方药物不在库内时**：只显示名称，不提供跳转，并在视觉上标记为"库外"。

**实现**：仍用 **`@xyflow/react`**（理由见 §5.1）。原计划的选型论证不变，
变的只是"画多少"：从"画全图"改成"画限流邻域 + 可展开"。

**必须遵守的视觉规则**（沿用 `PRODUCT.md` §4.3 / §11.4，不能省）：

| 边来源 | 样式 |
| --- | --- |
| 数据中的事实边 | 实线 |
| 规则推理出的边 | 虚线 + 异色 |
| LightRAG 语义关联 | 点线，默认隐藏 |

单药页第一版**只有事实边**，因此图例必须写明"本图仅含数据写明的关系，无推断边"。
这是 `PRODUCT.md` §4.3 的硬要求：把推断画成和数据一样就是误导。

**边类型不能统一画成箭头**（§7）：`INHIBITS` / `INDUCES` / `SUBSTRATE_OF` /
`CARRIED_BY` / `TRANSPORTED_BY` 有方向，`INTERACTS_WITH` 双向。用 `markerEnd`
有无来区分，并在 tooltip 里给 `action` 原文。

#### (2) 成药性雷达图 —— 谨慎使用

Lipinski 四规则（MW / logP / HBD / HBA）加 TPSA、可旋转键共 6 维，雷达图能一眼看出"偏在哪"。

**但 taste-skill §9.F 明确禁止"填充背景轨道的进度条"作为对比视觉**，雷达图有同类风险（形状好看但不精确）。因此：

- **只在 6 个描述符都有值时画**；任一缺失则整块降级为 `MetricRow` 列表，不画半张图。
- 每个轴必须标**实际数值与阈值**（如 `logP 3.1 / ≤5`），不能只给形状。
- 复用已有 `recharts`（3.8.0，MIT，已在依赖里）的 `RadarChart`，**不新增依赖**。

#### (3) 覆盖率指示 —— 不是图表

毒性 13%、通路 3.3%、SNP 0.4% 这类覆盖率**不用进度条**（同上禁令），用 `Badge` + 文案："毒性数据：2,609 / 19,842 个药有记录"。数字要真实，不凑整。

### 3.5 雷达图的归一化区间（必须固定，否则不可比）

| 维度 | 区间 | 依据 |
| --- | --- | --- |
| 分子量 | 0–1000 | Lipinski 阈值 500 落在中点，两侧对称可读 |
| logP | -2–7 | 阈值 5；负值侧留空间给强亲水药 |
| 氢键供体 | 0–10 | 阈值 5 |
| 氢键受体 | 0–20 | 阈值 10 |
| TPSA | 0–300 | 阈值 140 |
| 可旋转键 | 0–20 | 阈值 10（Veber） |

**区间写死在代码里并注明来源**，不按当前数据集动态求最大最小值：动态区间会让同一个药在两次访问间因他人数据变化而"形状不同"，这种图比没有更糟。

---

## 四、组件方案

### 4.1 直接复用（均已存在）

| 用途 | 组件 |
| --- | --- |
| 页面骨架 | `PageContainer`（已有 `pageTitle` / `pageDescription`） |
| 搜索输入 | `Input` + `Command`（`Command` 已支持分组，见 `command-menu.tsx`） |
| 靶点表 | `Table` + `components/ui/table/data-table*`（TanStack Table v8 已在依赖里） |
| 加载态 | `Skeleton` / `data-table-skeleton`（**不用** `Spinner` 做页面级加载） |
| 未选中态 | `Empty`（`EmptyMedia` + `EmptyTitle` + `EmptyDescription`） |
| 覆盖率提示 | `Alert` + `InfoButton`（`Heading` 已支持 `infoContent`） |
| 状态标签 | `Badge` |
| 长文本截断 | `Tooltip`（IUPAC 名、SMILES 很长） |
| 数值复制 | 自建 `MetricRow` 内用 `Button variant='ghost' size='icon-xs'` |

### 4.2 需要新建（放 `src/features/analysis/components/`）

| 组件 | 职责 | 关键约束 |
| --- | --- | --- |
| `DrugSearchPanel` | 搜索框 + 结果列表 + 最近打开 | 输入防抖；`source` 可切 `drugbank` / `cn`（两源各自内部检索，**不跨源**，见 §6.5） |
| `DrugIdentityHeader` | 名称、ID、状态徽章、分子式 | ID 与数值用 `font-mono` |
| `CoverageOverview` | 数据完整度概览（有值 N / 12 项，逐项列出缺什么） | **不聚合成一个百分数**——用户要的是"缺哪项"，不是一个 0–1 的分数 |
| `ActionSummary` | 靶点数 / 作用类型分布 / **度数** | 度数必须来自后端 `count(*)`，不能用 `take: 200` 的长度冒充 |
| `DruggabilityPanel` | Lipinski 四规则逐行 + 违规数 | **规则是启发式，界面必须写明只做初筛**（§五 A1） |
| `MetricRow` | 标签 + 等宽数值 + 单位 + 可选来源 | 数值列右对齐；缺失显示"—"并在 tooltip 说明 |
| `CoverageNotice` | 单区块覆盖率与限制提示 | 文案走 i18n；不得凑整 |
| `TargetTable` | 靶点表（靶点/作用方式/关系类型/物种/引用） | 引用列在 §六.2 完成前隐藏而非留空列 |
| `RelationNetwork` | 限流图（`@xyflow/react`）+ 图例 + **未显示总数** + 展开节点 | 默认 30 节点；放射布局不用力导向；图例写明仅含事实边（§3.4） |
| `DruggabilityRadar` | 6 维雷达图（`recharts`） | 6 值齐全才画，否则降级为 `MetricRow` 列表；每轴标实际值与阈值 |
| `ProvenanceFooter` | 数据来源与快照日期 | §五 B1 要求专利数据"界面必须显示数据日期" |

**不要新建的**：结构式渲染（见 §5.3）、覆盖率进度条（§3.4 已说明理由）、通用图表容器（recharts 的 `ChartContainer` 直接用）。

### 4.3 交互状态（taste-skill §4.5）

| 状态 | 处理 |
| --- | --- |
| 加载 | 骨架屏**匹配最终布局形状**（身份区 3 行 + 表格 5 行），不用转圈 |
| 空（未选药） | `Empty` + 搜索框自动聚焦 |
| 空（选了药但某字段无数据） | 该区块显示"无数据"+ 覆盖率说明，**不隐藏区块**——隐藏会让人以为这个药没有毒性字段，而事实是数据没覆盖 |
| 错误 | 请求失败用内联 `Alert`；整页崩溃走既有 `components/error-boundary.tsx`；401 走既有 `handleRequestFailure` |
| 按下反馈 | `active:scale-[0.98]` |

---

## 五、依赖决策

### 5.1 结论：只需新增 **1 个**运行时依赖

| 依赖 | 状态 | 用途 | 体积/许可 |
| --- | --- | --- | --- |
| **`@xyflow/react`** | **新增** | 关系网络限流图（30 节点 + 展开） | MIT，v12.12.0；按需 tree-shake，只引 `ReactFlow` + 必要插件 |
| `recharts` 3.8.0 | 已有 | 成药性雷达图（`RadarChart`） | — |
| `@tanstack/react-table` ^8.21.3 | 已有 | 靶点表 | — |
| `@tanstack/react-query` ^5.95.2 | 已有 | 请求缓存 | — |
| `@tanstack/react-router` | 已有 | `validateSearch` 管 `?id=` | — |
| `@tabler/icons-react` | 已有 | 图标 | — |

> 2026-10-27 复核：`@xyflow/react` 确认**尚未安装**（`package.json` 里只有
> `@tanstack/react-table` 与 `recharts`），需要新增。选型结论不变——变的只是画多少节点。

**为什么是 `@xyflow/react` 而不是别的**（均已核实为 MIT）：

| 候选 | 版本 | 取舍 |
| --- | --- | --- |
| **`@xyflow/react`** | 12.12.0 | **选它**：DOM 节点（可选中、可键盘聚焦、可放真实 `Badge`），自带平移缩放；限流后 30 节点是它最舒适的区间 |
| `cytoscape` + `cytoscape-fcose` | 3.34.4 / 2.2.0 | 力导向更强，适合 500+ 节点；限流到 30 后它的优势用不上，且 canvas 渲染对可访问性不友好 |
| `sigma` | 4.0.3 | WebGL，为万级节点设计；引入它等于为用不上的规模付体积 |
| `d3-force` 手写 | — | 能省一个依赖，但平移/缩放/拖拽/命中测试要自己写，且容易写出不可访问的实现 |

**不需要的**：`@rdkit/rdkit`（WASM，体积大，属于 A7 导入期需求）、任何图数据库客户端。

### 5.2 图标：需要收敛，不是新增

taste-skill §3.C 要求"one family per project"并统一 `strokeWidth`。现状是**两套并存**：

- `lucide-react`：23 个文件（`src/components/ui/` 下的 shadcn 组件）
- `@tabler/icons-react`：1 个文件（`src/components/icons.tsx`，导航与业务图标走这里）

本次**不混用**：新组件一律从 `@/components/icons`（tabler）取。把 shadcn 内部那 23 处的 lucide 统一成 tabler 是独立的重构，不在本计划范围内，但应记入 `PRODUCT.md` 未决问题。

### 5.3 结构式渲染：延后，但数据已就绪

`structure.smiles` **已经在 `MedicineDetailResponse` 里返回**（已核实），所以数据侧没有阻塞。仍建议延后，理由：

- 它与 A7/A8（结构相似性、骨架分析）同属结构分析页，一次引入两处受益；
- 需要新增依赖。纯 JS 的 `smiles-drawer`（MIT，v2.4.1）可客户端渲染 SVG；WASM 方案（RDKit.js）会显著增大包体，而桌面端与 Web 端共用同一份产物，需单独评估体积；
- 本页首屏信息已经密集（`VISUAL_DENSITY: 8`），再加一块结构图会让"扫一眼拿结论"变慢。

若确定要做，`smiles-drawer` 优先于 `@rdkit/rdkit`：前者只画图，后者是完整化学信息学工具链（属于 A7 的**导入期**需求，不是运行时需求）。

---

## 六、后端与数据改动清单（Lucent）

按依赖顺序。**§6.0 与 §6.1 已完成**（2026-10-27），剩余只有全量导入。

### 6.0 【已完成】DrugBank 导入链路就绪

实测 dev 库缺 5 张表的数据（§2.0），原因是**从未执行导入**，不是导入失败。解析器与导入 spec 都已存在。

> **2026-10-27 已完成**：
> - 新增 9 张关系表（`drugbank_drug_interactions` / `products` / `synonyms` / `dosages` /
>   `external_identifiers` / `classifications` / `groups` / `manufacturers` / `packagers`），
>   取代 6 个 JsonB 列（原列已删除）。详见 `Lucent/src/modules/medicines/README.md`。
> - 新增 8 个解析器 + 9 个导入命令，并加入 `import:medicine:all` 顺序。
> - `DrugbankMedicinesService` 改为 include 关系表。
> - `drugbank_drug_targets` 补 `import_run_id`（此前无法追溯批次）。

仍需执行的导入：

```bash
cd Lucent
# PyArrow 不在 PATH 的 python 里，需指定解释器（见 docs/howto/run-medicine-import.md）
$env:PYTHON_BIN = "D:\25080\Documents\VSCodeProject\Lumos\DrugDataBase\.venv312\Scripts\python.exe"

# 0. 药物主表必须先全量（否则下面所有带 drugbank_id 外键的表都会报外键冲突）
pnpm import:medicine:all -- --command drugbank-drugs
# 目标关系（A2 与 ego 图的基础）
pnpm import:medicine:all -- --command drugbank-targets-all
pnpm import:medicine:all -- --command drugbank-targets-active
# 成药性（A1 的基础）
pnpm import:medicine:all -- --command drugbank-structures
# 序列
pnpm import:medicine:all -- --command drugbank-target-proteins
pnpm import:medicine:all -- --command drugbank-target-genes
pnpm import:medicine:all -- --command drugbank-drug-sequences
# 已建好的 9 张关系表（重跑到全量）
pnpm import:medicine:all -- --command drugbank-groups
pnpm import:medicine:all -- --command drugbank-classification
pnpm import:medicine:all -- --command drugbank-synonyms
pnpm import:medicine:all -- --command drugbank-external-identifiers
pnpm import:medicine:all -- --command drugbank-dosages
pnpm import:medicine:all -- --command drugbank-manufacturers
pnpm import:medicine:all -- --command drugbank-packagers
pnpm import:medicine:all -- --command drugbank-products
pnpm import:medicine:all -- --command drugbank-drug-interactions
```

**顺序不能颠倒**：`drugbank_drugs` 是全表外键的父表。实测 `drugbank-targets-all --limit 100`
在抽样库上直接报 `violates foreign key constraint "drugbank_drug_targets_drugbank_id_fkey"`，
因为 `all.csv` 里的靶点引用的药不全在那 100 个抽样里。

`drugbank-structures` 的源是 `raw/drugbank/structures.sdf`（62.9 MB，14,622 个分子），不是 parquet。

**验收**：

```sql
SELECT count(*) FROM drugbank_targets;        -- 期望数千
SELECT count(*) FROM drugbank_drug_targets;   -- 期望上万
SELECT count(*) FROM drugbank_structures;     -- 期望 ~14,622
SELECT count(*) FROM drugbank_drugs;          -- 期望 19,842
SELECT count(*) FROM drugbank_drugs WHERE drugbank_id='DB00176';  -- 期望 1
SELECT count(*) FROM drugbank_drug_interactions;  -- 期望 ~291 万
```

> **2026-10-27 已完成**：全量导入跑完并通过校验，本节的验收结果：
> `drugbank_targets` 6,565 · `drugbank_drug_targets` **34,441** · `drugbank_structures`
> **14,622** · `drugbank_drugs` **19,842** · `DB00176` 存在 ·
> `drugbank_drug_interactions` **2,911,156**。37 条外键孤儿数为 0。
>
> **§6.0 由此关闭，不再是任何事项的前置条件。** 第 0 项可以从未完成清单里删掉。
> 原「先用 51,606 条抽样做相互作用网络」的折中也不再需要——数据已是全量。

### 6.1 关系网络端点 —— 可视化的前置条件

新增 `GET /api/v1/medicines/{id}/network?depth=1|2`，数据源 `drugbank_drug_targets`（**不经过 Semantica**，理由见 §3.4）。**依赖 §6.0**。

要点：

- `depth=1` 返回该药的直接邻居；`depth=2` 再扩一层，但**必须设节点上限**并在响应里带
  `truncated` 标记，让前端能提示"已截断"而不是静默少画。
- 边带 `action`（来自 `actions` JSON）与 `relationKind`（`all` / `enzyme` / `carrier` / `transporter`）。
- 方向语义按 `PRODUCT.md` §7 处理：`INTERACTS_WITH` 双向，其余有向。
- 端点鉴权姿态显式化（Lucent 的 `arch:check` 要求方法或类级 `@Public()` / `@UseGuards`）。
- 按 Lucent 的 e2e 约定补「跨用户访问 → 404」与 limit 上限用例。
- **必须处理"关系为空的药"**：该药无靶点且无相互作用时返回空图而不是 500。

> **2026-10-27 修订：本节的「新增端点」前提已不成立，且限流上限要改。**
>
> **(a) 已经有 9 个关系端点**，在 `medicines-relations.controller.ts`，均为 `@Public()`、
> 只收业务参数、Cypher 固定在后端：
>
> `GET /api/v1/medicines/relations/` 下：`mechanism-paths`（多药代谢机理路径）·
> `shared-targets`（多药共享靶点）· `cascade-paths`（单药 4 跳级联）·
> `substitutes`（避开某酶的替代药）· `actions`（单药作用谱）·
> `shortest-route`（两药最短传播路径）· `target-drugs`（某靶点的全部药）·
> `transport-routes`（单药转运路径）· `enzyme-duel`（诱导 vs 底物对抗）
>
> 这些已经覆盖了"机理分析"的大部分想要的能力。**新增 `/network` 之前必须先确认它
> 提供的是这 9 个给不了的东西**——它给的是"原始邻域图"，用于绘制；那 9 个给的是
> "有语义的结论"。两者不重复，可以共存。
>
> **(b) 这 9 个端点当前全部返回 `status: unavailable`**：它们走 Neo4j
> （`infrastructure/graph/executor.ts`），而 dev 环境**没有配置 `NEO4J_*`、也没有
> Neo4j 容器**。这不是 bug——端点被设计成用 `200 + status` 表达"图不可用"，
> 正是为了这种降级。**但意味着单药页第一版不能依赖它们**，需要用 Postgres 的
> `/network` 端点自给自足；Neo4j 接上后再决定是否把机理区块切过去。
>
> **(c) 节点上限从 200 改为 30**：实测单药相互作用度数中位数 542、`DB00176` 达 2,249，
> 200 个节点画出来已经是毛球（而且 200 只是"截断后的 200"，不带排序规则就没有代表性）。
> 新规则见 §3.4：**默认 30 节点，按关系类型优先级 + 相互作用按 `actions` 排序取 Top-N，
> 响应必须带 `truncated` 与未显示总数**。
>
> **(d) 新增端点的查询不能走 `getDetail` 的 `take: 200`**：那是详情摘要，没有排序、
> 没有总数。网络端点要单独实现"取 Top-N + `count(*)` 总数"两条查询。

**验收**：`DB00176` 的中心节点标出「相互作用 2,249 · 靶点 3」；图中最多 30 个邻居，
且显示未显示总数；`P08684`（CYP3A4）的边 `relationKind` 为 `enzyme`。

### 6.2 靶点引用落库 —— **A2 的前置条件**

实测源 XML 里每个 target 带 `<references>`（`DB00176` 的 12 条，含 `pubmed-id` + 完整 `citation`）。落库方案：

1. `DrugbankDrugTarget` 增列 `references Json?`（存 `[{ pubmedId, citation }]`）。
   - 若将来要"按 PubMed ID 反查哪些药"→ 按 `PRODUCT.md` §三 的判断标准应**建独立表**；若只做"取一个药、看它的引用"→ JsonB 足够。**当前需求是后者**，故先用 JsonB，并在列注释里写明这个判断依据。
2. 扩展导入器的 XML 富化流程 `applyXmlTargetActions`（`import-medicine-knowledge.ts`，它已在解析同一份 XML 的 targets/enzymes/carriers/transporters）——**在同一遍解析里顺带取 `<references>`**，不要再开第二遍扫描（1.82 GB XML，每遍都是分钟级）。
3. `MedicineDetailResponseTargets` 增 `references` 字段。
4. `pnpm export:openapi` → `apps/lumine` 跑 `pnpm contract`。

**验收**：`DB00176` 的靶点返回非空引用，且 PubMed ID 可点（链到 `pubmed.ncbi.nlm.nih.gov/<id>`）。

### 6.3 暴露已建表但未暴露的数据


三个模型已存在但 API 未暴露。**建议按需加子资源，而不是塞进 `getDetail`**：

```
GET /api/v1/medicines/{id}/patents
GET /api/v1/medicines/{id}/properties
```

理由：单药分析首屏只需要 A1/A2，专利属于"机会"页（`/opportunity/patents`）。塞进 `getDetail` 会让每次详情请求都带上没人看的重字段。

### 6.4 端点前缀决策

**建议：沿用 `/api/v1/medicines/*`，并修订 `PRODUCT.md` §十。**

`PRODUCT.md` 分前缀的理由是"手机端要轻量摘要，桌面端要全量字段"。但现有 `getDetail` **已经返回全量字段**，再开一个 `/workbench/*` 会得到两份语义重叠的详情端点。真正需要区分的是**列表**接口的字段量，那用一个 `fields` 参数或独立摘要端点即可，不必另起命名空间。

若坚持分前缀，则需明确回答：两个前缀下哪些端点重复、由谁保证不漂移。这属于 ADR 级别的问题，建议先按"单前缀 + 按需子资源"落地。

### 6.5 搜索能力：建同义词表；**中文映射坚决不做**

#### 【硬约束】ADR-0008 否决了 CN↔DrugBank 映射

我上一版提议「落库 `cn_en_mapping` 让中文名搜到英文药」——**这直接违反 Lucent 的 [ADR-0008](../../Lucent/docs/reference/adr/0008-no-cn-drugbank-medicine-mapping.md)（status: accepted，2026-07-15）**，该 ADR 的决定是：

> **不维护 CN↔DrugBank 药品映射关系。**

理由（ADR 原文）：医药映射容错率为零、无专业药学人力审核、两源独立更新维护成本不可控，而 LLM 已能通过工具链自主跨源检索（`resolve_drugbank_entity` / `get_drugbank_detail` 等）。且该 ADR 明确写了「**不可逆**：此决策不会逆转」。

而 `PRODUCT.md` §九 把「中英对照」列为**最值得做的第一项**，理由是「已有 `cn_en_mapping.parquet`」——**这是与 ADR-0008 的直接冲突**，且 PRODUCT.md 全文没有提到 ADR-0008。`cn_en_mapping.parquet` 只是 `DrugDataBase/derived/` 下的离线产物，`CN_EN_MAPPING_PLAN.md` 自己写的是「只产出数据，不接入 Lucent」，Lucent 的 `src/` 里**没有任何引用**（实测）。

**结论**：本计划**不做**中文映射落库，也不做"中文名搜英文药"。§6.6 的"中英对照展示"同样取消。这一条要作为 `PRODUCT.md` §九 的修订项（见 §七），由你决定是改 PRODUCT.md 还是推翻 ADR——**那是产品决策，不是实现细节**。

#### 同义词：建表（与 ADR-0008 无关，属于 DrugBank 内部）

先纠正我上一版写错的事实：`synonyms` **不是"未参与查询"**。导入时已把 `synonyms[:20]` 拼进了 `drugbank_drugs.search_text`（`parsers/drugbank_drugs.py` 的 `build_search_text([name, primary_id, cas_number, unii] + secondary_ids + groups + synonyms[:20])`）。实测 `DB00003` 的 `search_text` 里含第 3 个同义词 `Dornasa alfa`。

真正的问题是这两条：

| 问题 | 现状 | 建表后 |
| --- | --- | --- |
| 截断 | 只取前 20 条（实测仅 4 个药超过 20 条，影响小） | 全量 |
| 不可区分 | 命中后不知道命中的是哪个同义词，也无法按语言 / INN 标记筛选 | 可按 `language` / `is_inn` / `kind` 过滤与展示 |

按 `PRODUCT.md` §三 的标准（要按字段过滤/排序/范围查询 → 建表），**建 `drugbank_synonyms`**：

```
drugbank_synonyms
  drugbank_id  text  → drugbank_drugs.drugbank_id
  synonym      text
  language     text?     -- DrugBank 的 language 属性
  is_inn       boolean   -- 国际非专利名标记
  kind         text?     -- 来源分组（如 synonyms / international-brands）
  @@unique([drugbank_id, synonym])
  @@index([synonym])     -- 或 pg_trgm GIN，见下
```

索引：`pg_trgm` 1.6 **已安装**（实测 `installed_version = 1.6`），用 `gin (synonym gin_trgm_ops)` 支持子串匹配。`search_text` 里的拼接**保留**（它是模糊召回的主力），同义词表用于**精确命中与展示**——两者不冲突。

#### 中文检索：只做 CN 侧内部，不跨源

- `source=cn` 的搜索（`cn_medicine_products`）是**中文侧内部**检索，与 ADR-0008 无关，可以正常增强。
- 实测 `pg_available_extensions` 里有 **`zhparser` 2.4（installed）**，但 `pg_ts_config` 里**只有内置的 24 种语言配置，没有中文配置**。所以：

| 方案 | 取舍 |
| --- | --- |
| **A. `pg_trgm` 子串匹配**（先做） | 中文药名多为 2–6 字，子串召回够用；无需分词，实现最轻 |
| B. `zhparser` 全文检索 | 可按词根匹配、`ts_rank` 排序；但要维护 `tsvector` 列与触发器，且**需确认 `zhparser` 在部署镜像中存在**（dev 装了不等于生产装了） |

#### 端点侧

不新增"按名查询"端点（已存在，§2.4）。改动是**扩大 `buildWhere` 的 `OR`**：

```ts
OR: [
  { name: { contains: q, mode: 'insensitive' } },
  { casNumber: ... }, { unii: ... },
  { searchText: ... },                                    // 保留：模糊召回
  { synonyms: { some: { synonym: { contains: q, mode: 'insensitive' } } } },  // 新表
]
```

**注意这里没有中文映射项**——按 ADR-0008，跨源由 LLM 工具链处理，不在搜索层做。

### 6.6 【取消】中英对照展示

原计划要"按 DrugBank ID 并列展示中文说明书与英文机制"，**依据是 `cn_en_mapping.parquet`，而它违反 ADR-0008**（§6.5 已说明）。故取消。

若将来仍要做，必须先解决 ADR-0008 与 `PRODUCT.md` §九 的冲突（改 ADR 或改产品定义），**不能靠"数据文件已经存在"绕过一个 accepted 的 ADR**。

---

## 七、`PRODUCT.md` 修订清单

| 位置 | 现状 | 改为 |
| --- | --- | --- |
| **§2.5「已入库情况」** | 称靶点关系 / 成药性 / 结构「✅ 已导入」 | **整表按 2026-10-27 全量实测重写**：19,842 药、34,441 药-靶点关系、14,622 结构、291 万相互作用、468,460 产品。空白不再存在，但**字段覆盖率**要写进去（见 §3.0 的覆盖率表）——「有表」不等于「有值」 |
| **§三** | 判断"哪些数据需补导入" | 改为：DrugBank 全量导入**已完成**（2026-10-27），导入缺陷已修复；后续是按需增量 |
| §五 A2 | "数据自带引用，天然满足可溯源要求" | 改为："源 XML 自带引用（每 target 含 `<references>`），但**未落库**；需 §6.2 补列与导入后才成立" |
| §三 | patents / properties / fingerprints 标"未导入" | 改为"**已导入**（全量 13,391 / 328,025 / 14,615 行），缺 API 暴露" |
| §十 | 路径前缀 `/api/v1/workbench/*` | 改为 `/api/v1/medicines/*` + 按需子资源，并说明理由 |
| §十 | 未提现有搜索端点能力 | 补：`GET /api/v1/medicines?q=` 匹配 name/CAS/UNII/searchText（含前 20 个同义词），**不含中文名**；同义词增强见 §6.5（建 `drugbank_synonyms` + `pg_trgm` GIN） |
| **§九** | 把「中英对照」「中文检索（用中文名搜到 DrugBank 条目）」列为最值得做的能力，依据 `cn_en_mapping.parquet` | **与 ADR-0008 直接冲突**（该 ADR 已 accepted 且声明不可逆）。必须二选一：改 §九 删除这两项，或推翻 ADR-0008。**这是产品决策，需你裁定**，不能靠"数据文件已存在"绕过 |
| §三 | 未提同义词的承载结构 | 按 §三 自己的标准补：同义词需按语言 / INN 筛选且不截断 → **建表 `drugbank_synonyms`** |
| §六 | 落地顺序第 1 项 A2 | 注明**依赖 §6.0 导入 + §6.2 引用落库**；在 §6.0 完成前，第 1、2 项都无法验收 |
| §五 A1 | 称"数据最齐、实现最简单，不需要补导入" | 补：**字段齐但表为空**，需先跑 `drugbank-structures` 导入 |
| §五 A6 | 把图谱可视化定位为独立页（`/graph`） | 补一句：**单药页内嵌 ego 图**（数据源 `drugbank_drug_targets`，非 Semantica）；`/graph` 仍是全局探索页 |
| §七 | "已有导出样例 166 节点 / 400 边" | 补：该样例**本身派生自 `drugbank_drug_targets`**（每条边 `prov` 可证），因此单药 ego 图无需依赖 Semantica sidecar |
| §十二 未决问题 | — | 增五条：① 图标库收敛（tabler vs lucide）；② 结构式渲染方案（`smiles-drawer` vs RDKit.js）；③ 单药 ego 图 `depth=2` 的节点上限与截断提示；④ 中文检索用 `pg_trgm` 还是 `zhparser`（后者已装但未建 text search config）；⑤ `zhparser` 是否在部署镜像中存在 |

---

## 八、实施顺序与验收

> **2026-10-27 重排**：原第 0 项（补齐导入）**已完成并关闭**，第 8 项（同义词建表）
> 也随全量导入落地（`drugbank_synonyms` 52,154 行，表已建、数据已进）。所以从第 1 项
> 开始，**没有任何"先补数据"的前置工作**。
>
> 顺序也按依赖重排了一处：**靶点表挪到网络图之前**（原计划把图放第 6 项、表在第 5 项，
> 顺序对，但验收里图的节点来源没说清）。图是靶点表的图形化读法，先有表再画图。

| 序 | 事项 | 依赖 | 验收 |
| --- | --- | --- | --- |
| 1 | 路由与 URL 状态（`?id=`）、搜索面板、未选中空态 | — | `/analysis/drug` 可搜到药并跳转，刷新后保持选中 |
| 2 | 身份区 + **数据完整度概览**（§3.0） | 1 | 缺失字段在概览里逐项列出，不是笼统打一个分数 |
| 3 | 作用概览：靶点数 / 作用类型分布 / **度数**（相互作用 2,249 · 靶点 3） | 1 | 度数来自 `count(*)`，不是 `take: 200` 后的长度 |
| 4 | 靶点表（A2，引用列先隐藏） | 1 | 靶点/作用/关系/物种正确；**无靶点的药显示"无数据 + 全库覆盖率 49.8%"** |
| 5 | **后端 §6.1 网络端点**（限流 Top-N + `truncated`） | 3 | 返回 ≤30 节点 + 未显示总数；`DB00176` 中心标 2,249 |
| 6 | 前端限流图（`@xyflow/react`）+ 图例 + "展开节点" | 5 | 图例写明仅含事实边；点节点能展开；不画力导向毛球 |
| 7 | 成药性面板（A1）+ 雷达图 | 1 | `DB00176` 显示 Lipinski 逐项与违规数；6 值齐全才画雷达图 |
| 8 | PK（A12）+ 毒性（A13，默认折叠）+ 覆盖率提示 | 1 | 缺失字段显示"无数据"而非空白 |
| 9 | 交叉引用（A5） | 1 | 外链可点，`target="_blank"` + `rel="noreferrer"` |
| 10 | **后端 §6.2 引用落库** | 4 | 靶点表出现引用列，PubMed 链接可点 |
| 11 | 骨架屏、错误态、键盘可达、暗色核对 | 1–6 | 断网有错误态；Tab 能走完表格与图节点；两种主题下都检查过（taste-skill §8.D） |

**已关闭的前置项**（保留记录，不再执行）：

- ~~第 0 项 补齐 DrugBank 导入~~ → 2026-10-27 完成，见 §6.0 的验收结果。
- ~~第 8 项 建 `drugbank_synonyms`~~ → 已随全量导入落地。**但 `pg_trgm` GIN 索引与
  `buildWhere` 扩 OR 这两件事仍未做**，如果搜索增强要做，它是一条独立的小改动，
  不再是"建表"。

**本计划只覆盖单药分析**（§3.0）。多药分析与结构分析各有独立计划。

---

## 九、明确不做

| 不做 | 理由 |
| --- | --- |
| 分子对接 | SDF 是 2D 坐标（§2.2） |
| 用药建议 | 属于 Luminous 领域且涉合规（§八.3） |
| 毒性/疗效预测 | 无药效参数，无法验证（§八.1） |
| **画全量 ego 图** | 实测单药相互作用度数中位数 542、`DB00176` 达 2,249，全画就是毛球。改为限流图 + 展开（§3.4），**这不是"暂时不做"，是"不做这个形态"** |
| **新增"按药品名查询"端点** | 已存在 `GET /api/v1/medicines?q=`（§2.4），重复造会得到两份语义重叠的搜索。**但增强该端点的 `where` 与建表是计划内工作（§6.5）** |
| **把可视化做成"好看的装饰"** | 三处图各有职责（§3.4）；不放无信息量的图 |
| **按数据集动态算雷达图区间** | 同一药两次访问形状不同，比没有图更糟（§3.5） |
| **用进度条表示覆盖率** | taste-skill §9.F 禁止填充背景轨道的对比条；改用真实数字 |
| **把数据完整度聚合成一个百分数** | 用户要的是"缺哪一项"，一个 0–1 的分数既不可解释也不可行动（§3.0） |
| **在本页接 Semantica** | 同一份数据在 `drugbank_drug_targets` 就有，且 Semantica 默认关闭；多一个 sidecar 依赖换不到新信息 |
| **本页依赖 Neo4j 关系端点** | dev 无 `NEO4J_*` 配置、无容器，那 9 个端点当前全部 `status: unavailable`；第一版用 Postgres 自给 |
| **CN↔DrugBank 中文映射（含"中文名搜英文药"与"中英对照"）** | **ADR-0008 已 accepted 且声明不可逆**；跨源检索由 LLM 工具链处理。`PRODUCT.md` §九 与此冲突，需先裁定（§6.5 / §七） |
| 把 PK 文本字段解析成数值后直接比较 | §五 A12 要求标注"解析所得"；本计划只展示原文 |
| 卡片式分块布局 | taste-skill §4.4：`VISUAL_DENSITY > 7` 时禁止通用卡片容器 |
| 用图表展示单药的时间序列 | 本页数据里没有时间序列；recharts 只用于雷达图 |
