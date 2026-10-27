import type { MedicineDetail } from '../infrastructure/types';

/**
 * 把详情载荷投影成「界面能渲染的行」（application 层）。
 *
 * ## 这条规则是本次的核心决定
 *
 * 用户要求：**有什么字段展示什么字段，不写「暂无数据」**。
 *
 * 实现方式是**在投影阶段就把空值剔除**，而不是渲染时逐个判断：
 *
 * - 空字符串、空数组、`null`、`undefined` 一律不产出条目；
 * - 于是视图层拿到的是「已经确定有值」的列表，不需要（也不应该）再判空；
 * - 视图层因此**不可能**渲染出「暂无数据」——不是靠自觉，是靠拿不到空值。
 *
 * 这与「请求失败」是两件事：失败不进入这里，由状态机在更外层显式报错
 * （见 `domain/detail-state.ts` 的注释）。缺字段 = 少一行；失败 = 报错。
 *
 * ## 为什么 `0` 与 `false` 要保留
 *
 * `0` 是合法数值（例如电荷为 0、违规数为 0），`false` 是合法布尔（例如未获批）。
 * 用 `if (!value)` 判空会把它们一起丢掉，于是「0 个违规」这条**最有用**的结论
 * 反而消失。所以判空只看 `null` / `undefined` / 空串 / 空数组。
 */

/** 一条可渲染的度量：标签键 + 已确认有值的展示串。 */
export interface Metric {
  /** i18n 键路径（`analysis` 命名空间，不含前缀）。 */
  readonly labelKey: string;
  /** 已格式化的展示值；**一定非空**。 */
  readonly value: string;
  /** 数值型条目用等宽字体显示（taste-skill §7）。 */
  readonly mono: boolean;
}

/** 空值判定：只有真正没有内容才算空，`0` 与 `false` 不算。 */
function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function formatNumber(value: number): string {
  // 描述符多为 1–3 位小数；`toPrecision` 会给 `3.10` 这种尾零，这里去掉。
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));
}

/** 由「标签 + 原始值 + 格式化器」构造条目；空值直接不产出。 */
function metric(
  labelKey: string,
  value: unknown,
  options: { format?: (v: never) => string; mono?: boolean } = {}
): Metric | null {
  if (!isPresent(value)) return null;

  const format = options.format as ((v: unknown) => string) | undefined;
  const text = format ? format(value) : String(value);

  return text.trim().length > 0 ? { labelKey, value: text, mono: options.mono ?? false } : null;
}

/** 过滤掉 `null`，保持类型收窄。 */
function compact(items: readonly (Metric | null)[]): Metric[] {
  return items.filter((item): item is Metric => item !== null);
}

/**
 * 身份区条目：来源无关的公共字段。
 *
 * 名称与 id 不在这里——它们渲染在标题上，重复一遍只是噪音。
 */
export function projectIdentity(detail: MedicineDetail): Metric[] {
  return compact([
    metric('identity.source', detail.source),
    metric('identity.subtitle', detail.subtitle)
  ]);
}

/**
 * DrugBank 分支的身份与理化条目。
 *
 * 只对 `kind === 'drugbank'` 生效：中文产品没有分子式、logP 这些字段，
 * 拿它去读会得到 `undefined`（类型上也不允许）。
 */
export function projectDrugbankIdentity(detail: MedicineDetail): Metric[] {
  if (detail.detail.kind !== 'drugbank') return [];

  const d = detail.detail;

  return compact([
    metric('identity.drugType', d.drugType),
    metric('identity.state', d.state),
    metric('identity.formula', d.structure?.formula, { mono: true }),
    metric('identity.molecularWeight', d.structure?.molecularWeight, {
      format: formatNumber,
      mono: true
    }),
    metric('identity.exactMass', d.structure?.exactMass, { format: formatNumber, mono: true }),
    metric('identity.iupacName', d.structure?.iupacName),
    metric('identity.inchiKey', d.structure?.inchiKey, { mono: true }),
    metric('identity.smiles', d.structure?.smiles, { mono: true })
  ]);
}

/**
 * 药代动力学条目（A12）。
 *
 * 一律展示**原文**，不解析成数值：`PRODUCT.md` §五 A12 要求解析所得必须标注来源，
 * 而本版不做解析。原文里常带区间与条件，解析成单值会丢信息。
 */
export function projectPharmacokinetics(detail: MedicineDetail): Metric[] {
  if (detail.detail.kind !== 'drugbank') return [];

  const d = detail.detail;

  return compact([
    metric('pk.absorption', d.absorption),
    metric('pk.halfLife', d.halfLife),
    metric('pk.proteinBinding', d.proteinBinding),
    metric('pk.metabolism', d.metabolism),
    metric('pk.clearance', d.clearance),
    metric('pk.volumeOfDistribution', d.volumeOfDistribution),
    metric('pk.routeOfElimination', d.routeOfElimination)
  ]);
}

/**
 * 长文本区块（描述 / 适应症 / 机制 / 毒性 / 药效学）。
 *
 * 单独一组而不是塞进 `Metric`：它们是段落，渲染成「标签: 值」的一行会很难读，
 * 界面上按折叠段落处理。
 */
export interface TextSection {
  readonly labelKey: string;
  readonly body: string;
}

export function projectTextSections(detail: MedicineDetail): TextSection[] {
  if (detail.detail.kind !== 'drugbank') return [];

  const d = detail.detail;
  const sections: TextSection[] = [];

  const push = (labelKey: string, body: string | null) => {
    if (isPresent(body) && body !== null) sections.push({ labelKey, body });
  };

  push('text.description', d.description);
  push('text.indication', d.indication);
  push('text.mechanismOfAction', d.mechanismOfAction);
  push('text.pharmacodynamics', d.pharmacodynamics);
  push('text.toxicity', d.toxicity);

  return sections;
}

/** 靶点条目（A2）。 */
export interface TargetRow {
  readonly name: string;
  readonly geneName: string | null;
  readonly relationKind: string | null;
  readonly actions: string[];
  readonly species: string | null;
  readonly uniprotId: string | null;
  readonly pdbIds: string[];
}

/**
 * 靶点表投影。
 *
 * 无靶点的药返回空数组——**不是**一个「无数据」行：视图层对空数组直接不渲染该区块。
 */
export function projectTargets(detail: MedicineDetail): TargetRow[] {
  if (detail.detail.kind !== 'drugbank') return [];

  return (detail.detail.targets ?? []).map((target) => ({
    name: target.name,
    geneName: target.geneName,
    relationKind: target.relationKind,
    actions: target.actions ?? [],
    species: target.species,
    uniprotId: target.uniprotId,
    pdbIds: target.pdbIds ?? []
  }));
}

/** 交叉引用（A5）：标识符与链接分开，前者不可点、后者可点。 */
export interface CrossRef {
  readonly resource: string;
  readonly value: string;
  /** 有 URL 时可点；标识符类没有 URL。 */
  readonly url: string | null;
}

export function projectCrossReferences(detail: MedicineDetail): CrossRef[] {
  if (detail.detail.kind !== 'drugbank') return [];

  const d = detail.detail;

  const identifiers: CrossRef[] = (d.externalIdentifiers ?? []).map((item) => ({
    resource: item.resource,
    value: item.identifier,
    url: null
  }));

  const links: CrossRef[] = (d.externalLinks ?? []).map((item) => ({
    resource: item.resource,
    value: item.url,
    url: item.url
  }));

  return [...identifiers, ...links];
}

/**
 * 计数摘要：用长度表达的结论，不需要渲染列表就能读到。
 *
 * 每一项都来自真实数组长度，**不是**后端另给的数字——避免两处数字不一致。
 *
 * ## 这里为什么**没有**相互作用计数
 *
 * 因为拿不到真实值。`getDetail` 对 `drugInteractions` 是 `take: 200`（详情页只做
 * 摘要），所以数组长度最多是 200，而真实度数远超它：
 *
 * | 药品 | 详情返回 | 库内真实度数 |
 * | --- | --- | --- |
 * | `DB00176` | 200 | **2,249** |
 * | 全库单药度数中位数 | — | **542** |
 *
 * 把 200 当「相互作用对象数」展示是**假精确**：用户会以为这个药只有 200 个相互作用。
 * 正确做法是让后端给出 `count(*)` 总数（计划 §6.1d 已列为 `/network` 端点的一部分），
 * 在那之前宁可不显示。
 *
 * 这一条是实测发现的：初版写了 `interactions: (d.drugInteractions ?? []).length`，
 * 拿真实响应一跑就发现它恒为 200。
 */
export interface CountSummary {
  readonly targets: number;
  readonly synonyms: number;
  readonly crossRefs: number;
}

export function projectCounts(detail: MedicineDetail): CountSummary {
  if (detail.detail.kind !== 'drugbank') {
    return { targets: 0, synonyms: 0, crossRefs: 0 };
  }

  const d = detail.detail;

  return {
    targets: (d.targets ?? []).length,
    synonyms: (d.synonyms ?? []).length,
    crossRefs: (d.externalIdentifiers ?? []).length + (d.externalLinks ?? []).length
  };
}
