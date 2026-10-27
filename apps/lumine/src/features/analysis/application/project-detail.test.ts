import { describe, expect, it } from 'vitest';

import type { MedicineDetail } from '../infrastructure/types';
import {
  projectCounts,
  projectCrossReferences,
  projectDrugbankIdentity,
  projectPharmacokinetics,
  projectTargets,
  projectTextSections
} from './project-detail';

/**
 * 构造一个最小的 DrugBank 详情载荷。
 *
 * 只填被测字段，其余按契约的 nullable 填 `null`——契约里这些字段都允许 null，
 * 所以测试数据与真实响应同形。
 */
function drugbankDetail(overrides: Record<string, unknown> = {}): MedicineDetail {
  return {
    id: 'DB00176',
    name: 'Fluvoxamine',
    source: 'drugbank',
    subtitle: null,
    detail: {
      kind: 'drugbank',
      description: null,
      indication: null,
      mechanismOfAction: null,
      pharmacodynamics: null,
      toxicity: null,
      absorption: null,
      halfLife: null,
      proteinBinding: null,
      metabolism: null,
      clearance: null,
      volumeOfDistribution: null,
      routeOfElimination: null,
      atcCodes: null,
      categories: null,
      drugType: null,
      state: null,
      groups: null,
      synonyms: null,
      foodInteractions: null,
      targets: null,
      drugInteractions: null,
      externalIdentifiers: null,
      externalLinks: null,
      sequenceSummary: null,
      structure: null,
      ...overrides
    }
  } as unknown as MedicineDetail;
}

/**
 * 这一组测试锁住用户明确要求的那条规则：**有什么字段展示什么字段，
 * 不写「暂无数据」**。
 *
 * 实现手段是「投影阶段剔除空值」，所以测试直接验证「空值不产出条目」——
 * 视图层因此拿不到空值，也就不可能渲染出空状态。
 */
describe('详情投影：空值不产出条目', () => {
  it('全空的药产出空数组，而不是带占位值的条目', () => {
    const detail = drugbankDetail();

    expect(projectDrugbankIdentity(detail)).toEqual([]);
    expect(projectPharmacokinetics(detail)).toEqual([]);
    expect(projectTextSections(detail)).toEqual([]);
    expect(projectTargets(detail)).toEqual([]);
    expect(projectCrossReferences(detail)).toEqual([]);
  });

  it('只有部分字段有值时，只产出那些字段', () => {
    const detail = drugbankDetail({ halfLife: '15 hours', toxicity: '  ' });

    const pk = projectPharmacokinetics(detail);

    expect(pk).toHaveLength(1);
    expect(pk[0]).toEqual({ labelKey: 'pk.halfLife', value: '15 hours', mono: false });
    // 只有空白的字符串等同于没有值。
    expect(projectTextSections(detail)).toEqual([]);
  });

  it('0 与 false 是有效值，不能被当成空', () => {
    // 用 `if (!value)` 判空会把「0 个违规」「电荷为 0」这类最有用的结论丢掉。
    const detail = drugbankDetail({
      structure: { formula: 'C15H21F3N2O2', acceptorCount: 0, molecularWeight: 0 }
    });

    const identity = projectDrugbankIdentity(detail);
    const keys = identity.map((item) => item.labelKey);

    expect(keys).toContain('identity.formula');
    expect(keys).toContain('identity.molecularWeight');
    expect(identity.find((item) => item.labelKey === 'identity.molecularWeight')?.value).toBe('0');
  });

  it('数值格式化去掉浮点噪声，整数不带小数点', () => {
    const detail = drugbankDetail({
      structure: { molecularWeight: 318.335, exactMass: 318 }
    });

    const identity = projectDrugbankIdentity(detail);
    const byKey = new Map(identity.map((item) => [item.labelKey, item.value]));

    expect(byKey.get('identity.molecularWeight')).toBe('318.335');
    expect(byKey.get('identity.exactMass')).toBe('318');
  });

  it('中文产品分支不产出 DrugBank 专有字段', () => {
    // 两源字段名有重合但语义不同；用 kind 判别收窄后，中文源取不到这些字段。
    const cn = {
      id: '12345',
      name: '阿司匹林',
      source: 'cn',
      subtitle: null,
      detail: { kind: 'cnProduct', indications: '解热镇痛' }
    } as unknown as MedicineDetail;

    expect(projectDrugbankIdentity(cn)).toEqual([]);
    expect(projectPharmacokinetics(cn)).toEqual([]);
    expect(projectTextSections(cn)).toEqual([]);
    expect(projectTargets(cn)).toEqual([]);
    expect(projectCounts(cn)).toEqual({ targets: 0, synonyms: 0, crossRefs: 0 });
  });
});

describe('详情投影：计数与列表', () => {
  it('计数取自真实数组长度', () => {
    const detail = drugbankDetail({
      targets: [{ name: 'A' }, { name: 'B' }],
      drugInteractions: [{ drugbankId: 'DB00001', description: 'x' }],
      synonyms: ['a', 'b', 'c'],
      externalIdentifiers: [{ resource: 'PubChem', identifier: '1' }],
      externalLinks: [{ resource: 'Wikipedia', url: 'https://x' }]
    });

    expect(projectCounts(detail)).toEqual({
      targets: 2,
      synonyms: 3,
      crossRefs: 2
    });
  });

  it('不把截断的相互作用数组当计数', () => {
    // 详情接口对 drugInteractions 是 take: 200，那个长度不是真实度数
    // （DB00176 真实 2,249）。计数里因此没有这一项。
    const detail = drugbankDetail({
      drugInteractions: [{ drugbankId: 'DB00001', description: 'x' }]
    });

    expect(projectCounts(detail)).not.toHaveProperty('interactions');
  });

  it('交叉引用区分标识符与链接：只有后者可点', () => {
    const detail = drugbankDetail({
      externalIdentifiers: [{ resource: 'PubChem', identifier: '5362119' }],
      externalLinks: [{ resource: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Lisinopril' }]
    });

    const refs = projectCrossReferences(detail);
    const pubchem = refs.find((ref) => ref.resource === 'PubChem');
    const wikipedia = refs.find((ref) => ref.resource === 'Wikipedia');

    // 标识符没有 URL，界面上不可点；编一个链接出来会指向错误位置。
    expect(pubchem?.url).toBeNull();
    expect(wikipedia?.url).toBe('https://en.wikipedia.org/wiki/Lisinopril');
  });

  it('靶点的可空数组归一成空数组，界面不必再判 null', () => {
    const detail = drugbankDetail({
      targets: [{ name: 'CYP3A4', actions: null, pdbIds: null }]
    });

    const [target] = projectTargets(detail);

    expect(target?.actions).toEqual([]);
    expect(target?.pdbIds).toEqual([]);
  });
});
