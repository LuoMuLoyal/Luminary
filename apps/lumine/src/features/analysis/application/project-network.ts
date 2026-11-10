import type { MedicineNetwork } from '../infrastructure/types';

/**
 * 把邻域图契约投影成界面视图模型（application 层）。
 *
 * ## 这里做的最重要一件事：不假装图是完整的
 *
 * `truncated > 0` 时界面**必须**显示「还有 N 个未显示」。把 30 个邻居当成全部，
 * 会让用户以为 `DB00176` 只有 30 个相互作用，而它真实是 2,249。
 *
 * 同理，`ordering` 说明选择依据是 id 字典序而不是重要性——投影把它带出去，
 * 让界面能如实标注，而不是暗示「这是最重要的 30 个」。
 *
 * ## 与详情投影的区别
 *
 * 详情投影（`project-detail.ts`）把空值剔除、不渲染空区块。这里相反：
 * 图即使为空也要说明「没有关系」，因为「查了但没有」和「没查」对分析来说是
 * 两个不同结论，而这个区块本来就是为「看关系」而存在的。
 */

/** 图上要画的一个节点。 */
export interface NetworkNode {
  readonly id: string;
  readonly label: string;
  readonly kind: 'center' | 'drug' | 'protein';
  /** 库外节点只显示名称、不给链接（点了会 404 的链接比没有更糟）。 */
  readonly inCatalogue: boolean;
}

/** 图上要画的一条边。 */
export interface NetworkLink {
  readonly from: string;
  readonly to: string;
  readonly kind: 'interaction' | 'target';
}

/** 界面用的邻域视图模型。 */
export interface NetworkView {
  readonly center: NetworkNode;
  readonly nodes: readonly NetworkNode[];
  readonly links: readonly NetworkLink[];
  /** 真实度数：来自后端 `count(*)`，不是 `nodes.length`。 */
  readonly degree: { readonly interactions: number; readonly targets: number };
  /** 被上限截掉的邻居数。 */
  readonly truncated: number;
  /** 是否完整（未截断）。 */
  readonly complete: boolean;
  /**
   * 选择依据是否为「按 id 排序」而非重要性。
   *
   * 恒为 `true`：后端当前只提供这种排序。留在视图模型里是为了让界面必须
   * 处理这句话，而不是默认它是重要性排序。
   */
  readonly idOrdered: boolean;
}

export function projectNetwork(network: MedicineNetwork): NetworkView {
  const center: NetworkNode = {
    id: network.center.id,
    label: network.center.name,
    kind: 'center',
    inCatalogue: true
  };

  const nodes: NetworkNode[] = network.neighbours.map((neighbour) => ({
    id: neighbour.id,
    label: neighbour.name,
    kind: neighbour.nodeKind,
    inCatalogue: neighbour.inCatalogue
  }));

  const links: NetworkLink[] = network.edges.map((edge) => ({
    from: network.center.id,
    to: edge.neighbourId,
    kind: edge.kind
  }));

  return {
    center,
    nodes,
    links,
    degree: network.degree,
    truncated: network.truncated,
    complete: network.truncated === 0,
    idOrdered: network.ordering === 'drugbank_id_asc'
  };
}

/** 图是否为空（没有任何邻居关系）。 */
export function isNetworkEmpty(view: NetworkView): boolean {
  return view.nodes.length === 0;
}
