import { describe, expect, it } from 'vitest';

import type { MedicineNetwork } from '../infrastructure/types';
import { isNetworkEmpty, projectNetwork } from './project-network';

/**
 * 邻域图投影的测试。
 *
 * 重点不是映射本身（那是直的），而是**「不假装图是完整的」这条规则**：
 * `truncated` 与 `ordering` 必须原样进入视图模型，界面才有办法如实标注。
 */

function network(overrides: Partial<MedicineNetwork> = {}): MedicineNetwork {
  return {
    center: { id: 'DB00176', name: 'Fluvoxamine' },
    degree: { interactions: 2249, targets: 3 },
    neighbours: [
      { id: 'DB00001', name: 'Lepirudin', nodeKind: 'drug', inCatalogue: true },
      { id: 'DB00005', name: 'Etanercept', nodeKind: 'drug', inCatalogue: false },
      { id: 'T1', name: 'CYP2C9', nodeKind: 'protein', inCatalogue: true }
    ],
    edges: [
      { kind: 'interaction', neighbourId: 'DB00001', relationKind: null, actions: [] },
      { kind: 'interaction', neighbourId: 'DB00005', relationKind: null, actions: [] },
      { kind: 'target', neighbourId: 'T1', relationKind: 'enzyme', actions: ['inhibitor'] }
    ],
    truncated: 2249,
    ordering: 'drugbank_id_asc',
    ...overrides
  };
}

describe('projectNetwork — 契约到视图模型', () => {
  it('中心节点来自 center，邻居与边一一对应', () => {
    const view = projectNetwork(network());

    expect(view.center).toEqual({
      id: 'DB00176',
      label: 'Fluvoxamine',
      kind: 'center',
      inCatalogue: true
    });
    expect(view.nodes).toHaveLength(3);
    expect(view.links).toHaveLength(3);
    expect(view.links.every((link) => link.from === 'DB00176')).toBe(true);
  });

  it('度数来自后端 count(*)，不是节点数量', () => {
    const view = projectNetwork(network());

    // 关键断言：节点只有 3 个，但真实度数是 2,249。
    expect(view.degree.interactions).toBe(2249);
    expect(view.degree).not.toEqual({ interactions: view.nodes.length, targets: 3 });
  });

  it('truncated 原样带出，complete 反映是否被截断', () => {
    const truncated = projectNetwork(network({ truncated: 2219 }));
    expect(truncated.truncated).toBe(2219);
    expect(truncated.complete).toBe(false);

    const complete = projectNetwork(network({ truncated: 0 }));
    expect(complete.complete).toBe(true);
  });

  it('idOrdered 恒为 true（后端只提供 id 序，界面必须如实说明）', () => {
    expect(projectNetwork(network()).idOrdered).toBe(true);
  });

  it('库外节点保留 inCatalogue=false（界面据此不给链接）', () => {
    const view = projectNetwork(network());
    const outOfCatalogue = view.nodes.find((node) => node.id === 'DB00005');

    expect(outOfCatalogue?.inCatalogue).toBe(false);
  });

  it('空图：没有邻居也没有边，且 complete 为 true', () => {
    const view = projectNetwork(
      network({ neighbours: [], edges: [], degree: { interactions: 0, targets: 0 }, truncated: 0 })
    );

    expect(isNetworkEmpty(view)).toBe(true);
    expect(view.complete).toBe(true);
  });

  it('有邻居时 isNetworkEmpty 为 false', () => {
    expect(isNetworkEmpty(projectNetwork(network()))).toBe(false);
  });
});
