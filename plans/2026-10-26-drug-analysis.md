# 单药分析（`/analysis/drug`）实施计划

> 2026-10-26 起草。执行完毕即删（ADR-0002 规则 3）。
> 范围：`apps/lumine` 的单药分析页，含所需的后端改动与 `PRODUCT.md` 修订。

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

## 二、事实核查：`PRODUCT.md` 与代码现状的三处不一致

这三处必须先修，否则计划会建在错误前提上。

### 2.1 A2「靶点自带 PubMed 引用」——**当前不成立**

`PRODUCT.md` §五 A2 称：

> **这是 Lumine 最值得做的能力**：数据自带引用，天然满足可溯源要求。

查证结果：

- `MedicineDetailResponse.targets` 的字段是 `actions` / `geneName` / `knownAction` / `name` / `pdbIds` / `relationKind` / `species` / `uniprotId` / `uniprotTitle`——**没有引用字段**。
- `DrugbankDrugTarget` 模型（`Lucent/prisma/models/medicine-knowledge.prisma`）的列只有 `drugbankId` / `targetId` / `relationKind` / `actions` / `knownAction`，**没有引用列**。

结论：**A2 的头号卖点目前无法兑现**。原始 DrugBank XML 的 target 条目里带 `<references>`（PubMed ID），是导入器没有落库。

这不是"以后再说"的小事：A2 被 `PRODUCT.md` §六列为**落地顺序第 1 项**，理由是"数据自带引用，最能体现可溯源"。要么补引用，要么把 A2 的理由改掉。

### 2.2 §十 的 `/api/v1/workbench/*` 前缀不存在

`PRODUCT.md` §十约定：

> | 路径前缀 | `/api/v1/workbench/*`，与手机端的 `/api/v1/medicines/*` 分开 |

查证：Lucent 下**没有 workbench 模块**，只有 `medicines.controller.ts` 与 `medicines-relations.controller.ts`，路径都是 `/api/v1/medicines/*`。

### 2.3 §三 说 patents / properties / fingerprints「未导入」，但模型已存在

`Lucent/prisma/models/medicine-knowledge.prisma` 里已有：

- `DrugbankPatent`（含 `expiresOn` 索引）
- `DrugbankProperty`（含 `valueText` + `valueNum` 双列，正是 §三「实验属性」要求的设计）
- `DrugbankFingerprint`（2048-bit Morgan，hex 存储）

且这三个模型都**不在** `MedicineDetailResponse` 里暴露。所以 §三 的措辞（"需补导入"）与实际的"schema 已就绪、只差 API 暴露 + 数据确认"有偏差。

---

## 三、页面规划

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
│ 身份区                    │ 成药性判定（A1）             │
│  名称 / DB ID / CAS       │  违规数 1 / 4 规则逐行       │
│  分子式 / 分子量 / 状态    │                              │
│ ────────────────────     │ 交叉引用（A5）               │
│ 靶点与机制（A2）          │  UniProt / PDB / KEGG …      │
│  表格：靶点/作用/引用      │                              │
│ ────────────────────     │ 成药性雷达图（A1）           │
│ 关系网络（A6，内嵌）       │                              │
│  ego 图：药→靶点/酶/转运体 │ 数据来源与日期               │
│ ────────────────────     │                              │
│ 药代动力学（A12）         │                              │
│ ────────────────────     │                              │
│ 毒性（A13）               │                              │
└──────────────────────────┴──────────────────────────────┘
```

要点：

- **未选中时不渲染空壳**：整页只显示搜索框 + `Empty` 引导，不画占位表格。
- **侧栏只放"结论"**：判定与交叉引用是扫一眼就要的信息，滚动时不希望丢失，所以粘性。
- **分子式、分子量、logP、TPSA、半衰期数值一律 `font-mono`**（taste-skill §7）。
- **每个数值区都带覆盖率**：`toxicity` 覆盖 13%、`experimental_properties` 约 14%，缺失时显示"无数据"而非空白（`PRODUCT.md` §五 B2 已明确要求"不能推测"）。
- **关系网络内嵌在主列**，不跳页：单药分析的核心问题就是"这个药作用在什么上"，图与靶点表是同一份数据的两种读法，分开放会让人来回跳。

### 3.3 各区块的字段映射

| 区块 | 数据来源（当前 API） | 备注 |
| --- | --- | --- |
| 身份 | `MedicineDetailResponse.detail`：`description` / `drugType` / `groups` / `state` / `synonyms` / `atcCodes` / `categories`；`structure.formula` / `molecularWeight` / `exactMass` / `iupacName` / `inchiKey` | `groups` 四态用 `Badge` 分色（approved / withdrawn / investigational / vet_approved） |
| 成药性 A1 | `structure`：`ruleOfFive` / `acceptorCount` / `donorCount` / `rotatableBondCount` / `logP` / `alogpsLogP` / `polarSurfaceArea` / `polarizability` / `ringCount` / `ghoseFilter` / `veberRule` / `bioavailability` / `mddrLikeRule` | **全部已在库，零后端改动** |
| 靶点 A2 | `detail.targets[]` | 引用列**需后端补**（见 §六） |
| 药代 A12 | `halfLife` / `proteinBinding` / `absorption` / `metabolism` / `clearance` / `volumeOfDistribution` / `routeOfElimination` | **原文文本**，不做数值解析；如需比较，解析结果必须标注"解析所得"（§五 A12） |
| 毒性 A13 | `toxicity` | 覆盖率 13%，必须显著提示"多为动物实验，不能外推到人" |
| 交叉引用 A5 | `externalIdentifiers[]` / `externalLinks[]` | 纯链接，实现最简 |
| 关系网络 A6 | **需新增端点**，见 §3.4 | 数据已在 `drugbank_drug_targets`，不必依赖 Semantica |
| 成药性雷达图 A1 | 由 `structure` 的 6 个描述符归一化后绘制 | 归一化区间需固定，见 §3.5 |
| 中文对照 | 暂不接 | 需 `cn_en_mapping` 落地到 API，见 §六.5 |

### 3.4 可视化：三处，各有明确职责

单药分析要有可视化，但不能为了"有图"而画图。按 taste-skill §9.D「禁止假精确数字」与 §7 密度要求，这里只放**承载信息**的三处：

#### (1) 关系网络 ego 图 —— 核心可视化

**数据来源：`drugbank_drug_targets`，不是 Semantica。** 已核实：

- Semantica 的导出（`semantica-service/data/viz/Warfarin-Clopidogrel.json`，400 边）里**每一条边的 `prov` 都指向 `lucent:drugbank_drug_targets`**，即它本身也是从 Lucent 的 Postgres 派生的。
- 所以让 Lumine 去依赖 Semantica（`SEMANTICA_ENABLED=false`，需另起 sidecar）是**绕远路**：同一份数据在 `drugbank_drug_targets` 里就有，且带 `relation_kind`（`all` / `enzyme` / `carrier` / `transporter`）与 `actions`。

**规模核实**（对样例子集实测）：单药 ego 网络约 **30 个邻居**（DB00176 度数 32；样例中最高度数节点是 CYP3A4 `P08684`，90 度）。这个量级**不需要 WebGL**，SVG 足够，也不需要聚合。

**实现**：新增 `GET /api/v1/medicines/{id}/network?depth=1|2`，返回：

```json
{
  "nodes": [{ "id": "DB00176", "type": "drug", "label": "Fluvoxamine" },
            { "id": "P08684", "type": "protein", "label": "CYP3A4", "relationKind": "enzyme" }],
  "edges": [{ "source": "DB00176", "target": "P08684", "action": "inhibitor", "relationKind": "enzyme" }]
}
```

前端用 **`@xyflow/react`（MIT，v12）** 渲染：它自带平移/缩放/节点拖拽与可访问的 DOM 节点（不是 canvas），30–200 节点量级表现良好，且与 React 19 同构。备选 `cytoscape`（MIT，v3.34）+ `cytoscape-fcose` 更适合 500+ 节点的力导向，本页用不上。

**必须遵守的视觉规则**（沿用 `PRODUCT.md` §4.3 / §11.4 的既定要求，不能省）：

| 边来源 | 样式 |
| --- | --- |
| 数据中的事实边 | 实线 |
| 规则推理出的边 | 虚线 + 异色 |
| LightRAG 语义关联 | 点线，默认隐藏 |

单药页第一版**只有事实边**，因此图例必须写明"本图仅含数据写明的关系，无推断边"，而不是省掉图例。等 A6 接上 `/reason` 后再启用另两种线型。这条是 `PRODUCT.md` §4.3 的硬要求：把推断画成和数据一样就是误导。

**边类型不能统一画成箭头**（§7）：`INHIBITS` / `INDUCES` / `SUBSTRATE_OF` / `CARRIED_BY` / `TRANSPORTED_BY` 有方向，`INTERACTS_WITH` 双向。用 `markerEnd` 有无来区分，并在 tooltip 里给 `action` 原文。

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
| `DrugSearchPanel` | 搜索框 + 结果列表 + 最近打开 | 输入防抖；中文名可搜（`q` 已支持） |
| `DrugIdentityHeader` | 名称、ID、状态徽章、分子式 | ID 与数值用 `font-mono` |
| `DruggabilityPanel` | Lipinski 四规则逐行 + 违规数 | **规则是启发式，界面必须写明只做初筛**（§五 A1） |
| `MetricRow` | 标签 + 等宽数值 + 单位 + 可选来源 | 数值列右对齐；缺失显示"—"并在 tooltip 说明 |
| `CoverageNotice` | 覆盖率与限制提示 | 文案走 i18n；不得凑整 |
| `TargetTable` | 靶点表（靶点/作用方式/关系类型/物种/引用） | 引用列在 §六.2 完成前隐藏而非留空列 |
| `RelationNetwork` | ego 图（`@xyflow/react`）+ 图例 | 图例必须写明仅含事实边（§3.4）；节点上限与 `truncated` 提示 |
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
| **`@xyflow/react`** | **新增** | 关系网络 ego 图 | MIT，v12.12.0；按需 tree-shake，只引 `ReactFlow` + 必要插件 |
| `recharts` 3.8.0 | 已有 | 成药性雷达图（`RadarChart`） | — |
| `@tanstack/react-table` ^8.21.3 | 已有 | 靶点表 | — |
| `@tanstack/react-query` ^5.95.2 | 已有 | 请求缓存 | — |
| `@tanstack/react-router` | 已有 | `validateSearch` 管 `?id=` | — |
| `@tabler/icons-react` | 已有 | 图标 | — |

**为什么是 `@xyflow/react` 而不是别的**（均已核实为 MIT）：

| 候选 | 版本 | 取舍 |
| --- | --- | --- |
| **`@xyflow/react`** | 12.12.0 | **选它**：DOM 节点（可选中、可键盘聚焦、可放真实 `Badge`），自带平移缩放，30–200 节点最舒适 |
| `cytoscape` + `cytoscape-fcose` | 3.34.4 / 2.2.0 | 力导向更强，适合 500+ 节点；本页 30 个邻居用不上，且 canvas 渲染对可访问性不友好 |
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

## 六、后端改动清单（Lucent）

按依赖顺序。

### 6.1 关系网络端点 —— 可视化的前置条件

新增 `GET /api/v1/medicines/{id}/network?depth=1|2`，数据源 `drugbank_drug_targets`（**不经过 Semantica**，理由见 §3.4）。

要点：

- `depth=1` 返回该药的直接邻居；`depth=2` 再扩一层，但**必须设节点上限**（默认 200，与 `PRODUCT.md` §7「节点数量控制」一致）并在响应里带 `truncated` 标记，让前端能提示"已截断"而不是静默少画。
- 边带 `action`（来自 `actions` JSON）与 `relationKind`（`all` / `enzyme` / `carrier` / `transporter`）。
- 方向语义按 `PRODUCT.md` §7 处理：`INTERACTS_WITH` 双向，其余有向。
- 端点鉴权姿态显式化（Lucent 的 `arch:check` 要求方法或类级 `@Public()` / `@UseGuards`）。
- 按 Lucent 的 e2e 约定补「跨用户访问 → 404」与 limit 上限用例。

**验收**：`DB00176` 返回约 30 个邻居节点，`P08684`（CYP3A4）的边 `relationKind` 为 `enzyme`。

### 6.2 靶点引用落库 —— **A2 的前置条件**

1. `DrugbankDrugTarget` 增列：`references Json?`（存 `[{ pubmedId, citation }]`），或按 §三 的判断标准建独立表（若要按 PubMed ID 反查，就该建表）。
2. 导入器 `Lucent/scripts/import/medicine/import-medicine-knowledge.ts` 解析 DrugBank XML 的 target `<references>` 并落库（该文件已有 XML 富化流程 `applyXmlTargetActions`，在其上扩展）。
3. `MedicineDetailResponseTargets` 增 `references` 字段。
4. `pnpm export:openapi` → `apps/lumine` 跑 `pnpm contract`。

**验收**：`DB00176`（Fluvoxamine）的靶点返回非空引用。

### 6.3 暴露已建表的 patents / properties / fingerprints

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

### 6.5 中文对照（延后）

`PRODUCT.md` §九把"中英对照"列为最值得做的中文能力，依据是 `cn_en_mapping.parquet`。这需要：`cn_en_mapping` 落库 → 加 `GET /api/v1/medicines/{id}/cn` → 单药页并排展示。

**本计划不包含**，因为它是独立的导入工作，且不阻塞 A1/A2 上线。

---

## 七、`PRODUCT.md` 修订清单

| 位置 | 现状 | 改为 |
| --- | --- | --- |
| §五 A2 | "数据自带引用，天然满足可溯源要求" | 改为："引用需补导入（见 §三）；导入前本项的可溯源优势不成立" |
| §三 | patents / properties / fingerprints 标"未导入" | 改为："schema 已就绪（`DrugbankPatent` / `DrugbankProperty` / `DrugbankFingerprint`），缺 API 暴露；实际数据状态需查库确认" |
| §十 | 路径前缀 `/api/v1/workbench/*` | 改为 `/api/v1/medicines/*` + 按需子资源，并说明理由 |
| §六 | 落地顺序第 1 项 A2 | 保持，但注明**依赖 §6.2 的引用导入**；若不导入，第 1 项应改为 A1 |
| §五 A6 | 把图谱可视化定位为独立页（`/graph`） | 补一句：**单药页内嵌 ego 图**（数据源 `drugbank_drug_targets`，非 Semantica）；`/graph` 仍是全局探索页 |
| §七 | "已有导出样例 166 节点 / 400 边" | 补：该样例**本身派生自 `drugbank_drug_targets`**（每条边 `prov` 可证），因此单药 ego 图无需依赖 Semantica sidecar |
| §十二 未决问题 | — | 增三条：① 图标库收敛（tabler vs lucide）；② 结构式渲染方案（`smiles-drawer` vs RDKit.js）；③ 单药 ego 图 `depth=2` 的节点上限与截断提示 |

---

## 八、实施顺序与验收

| 序 | 事项 | 依赖 | 验收 |
| --- | --- | --- | --- |
| 1 | 路由与 URL 状态（`?id=`）、搜索面板、未选中空态 | 无 | `/analysis/drug` 可搜到药并跳转，刷新后保持选中 |
| 2 | 身份区 + 成药性面板（A1）+ 雷达图 | 1 | `DB00176` 显示 Lipinski 逐项与违规数；**零后端改动** |
| 3 | PK（A12）+ 毒性（A13）+ 覆盖率提示 | 2 | 缺失字段显示"无数据"而非空白 |
| 4 | 交叉引用（A5） | 2 | 外链可点，`target="_blank"` + `rel="noreferrer"` |
| 5 | 靶点表（A2，引用列先隐藏） | 2 | 靶点/作用/关系/物种正确 |
| 6 | **后端 §6.1 网络端点** + 前端 ego 图 | 5 | `DB00176` 出图；图例写明仅含事实边；方向正确 |
| 7 | **后端 §6.2 引用导入** | 独立 | 靶点表出现引用列 |
| 8 | 骨架屏、错误态、键盘可达、暗色核对 | 2–6 | 断网有错误态；Tab 能走完表格与图节点；两种主题下都检查过（taste-skill §8.D） |

**第 1–5 项不依赖任何后端改动即可上线**（除引用列）；第 6 项依赖一个新增端点，但该端点只读现有表，不依赖任何导入工作。

---

## 九、明确不做

| 不做 | 理由 |
| --- | --- |
| 分子对接 | SDF 是 2D 坐标（§2.2） |
| 用药建议 | 属于 Luminous 领域且涉合规（§八.3） |
| 毒性/疗效预测 | 无药效参数，无法验证（§八.1） |
| **把可视化做成"好看的装饰"** | 三处图各有职责（§3.4）；不放无信息量的图 |
| **按数据集动态算雷达图区间** | 同一药两次访问形状不同，比没有图更糟（§3.5） |
| **用进度条表示覆盖率** | taste-skill §9.F 禁止填充背景轨道的对比条；改用真实数字 |
| **在本页接 Semantica** | 同一份数据在 `drugbank_drug_targets` 就有，且 Semantica 默认关闭；多一个 sidecar 依赖换不到新信息 |
| 把 PK 文本字段解析成数值后直接比较 | §五 A12 要求标注"解析所得"；本计划只展示原文 |
| 卡片式分块布局 | taste-skill §4.4：`VISUAL_DENSITY > 7` 时禁止通用卡片容器 |
| 用图表展示单药的时间序列 | 本页数据里没有时间序列；recharts 只用于雷达图 |
