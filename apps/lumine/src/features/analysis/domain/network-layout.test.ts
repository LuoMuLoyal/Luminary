import { describe, expect, it } from 'vitest';

import {
  INNER_RING_RADIUS,
  OUTER_RING_RADIUS,
  layoutNeighbours,
  type LayoutNeighbour
} from './network-layout';

function neighbour(id: string, nodeKind: 'drug' | 'protein'): LayoutNeighbour {
  return { id, nodeKind };
}

/** 到中心的距离（舍入到整像素，便于断言）。 */
function radiusOf(position: { x: number; y: number }): number {
  return Math.round(Math.hypot(position.x, position.y));
}

describe('layoutNeighbours — 两圈放射布局', () => {
  it('把靶点放内圈、相互作用放外圈', () => {
    const layout = layoutNeighbours([
      neighbour('D1', 'drug'),
      neighbour('P1', 'protein'),
      neighbour('D2', 'drug')
    ]);

    expect(radiusOf(layout.positions['P1']!)).toBe(INNER_RING_RADIUS);
    expect(radiusOf(layout.positions['D1']!)).toBe(OUTER_RING_RADIUS);
    expect(radiusOf(layout.positions['D2']!)).toBe(OUTER_RING_RADIUS);
  });

  it('中心恒在原点', () => {
    const layout = layoutNeighbours([]);
    expect(layout.center).toEqual({ x: 0, y: 0 });
  });

  it('空输入不产生任何位置', () => {
    expect(layoutNeighbours([]).positions).toEqual({});
  });

  it('单个邻居落在正上方（不随机、不歪斜）', () => {
    const layout = layoutNeighbours([neighbour('P1', 'protein')]);
    const position = layout.positions['P1']!;

    expect(position.x).toBe(0);
    expect(position.y).toBe(-INNER_RING_RADIUS);
  });

  it('同一圈内均匀分布，且关于纵轴对称', () => {
    const layout = layoutNeighbours([
      neighbour('D1', 'drug'),
      neighbour('D2', 'drug'),
      neighbour('D3', 'drug'),
      neighbour('D4', 'drug')
    ]);

    // 四个点应为「上、右、下、左」。
    expect(layout.positions['D1']!.x).toBe(0);
    expect(layout.positions['D1']!.y).toBe(-OUTER_RING_RADIUS);
    expect(layout.positions['D3']!.y).toBe(OUTER_RING_RADIUS);
    expect(layout.positions['D2']!.x).toBe(OUTER_RING_RADIUS);
    expect(layout.positions['D4']!.x).toBe(-OUTER_RING_RADIUS);
  });

  it('布局是确定性的：同样输入两次结果完全相同', () => {
    const input: LayoutNeighbour[] = [
      neighbour('P1', 'protein'),
      neighbour('P2', 'protein'),
      neighbour('D1', 'drug')
    ];

    expect(layoutNeighbours(input)).toEqual(layoutNeighbours(input));
  });

  it('数量变化不会让已有节点换到另一圈', () => {
    const small = layoutNeighbours([neighbour('P1', 'protein')]);
    const large = layoutNeighbours([
      neighbour('P1', 'protein'),
      neighbour('P2', 'protein'),
      neighbour('P3', 'protein')
    ]);

    expect(radiusOf(small.positions['P1']!)).toBe(INNER_RING_RADIUS);
    expect(radiusOf(large.positions['P1']!)).toBe(INNER_RING_RADIUS);
  });

  it('每个邻居都有且只有一个位置', () => {
    const layout = layoutNeighbours([
      neighbour('P1', 'protein'),
      neighbour('D1', 'drug'),
      neighbour('D2', 'drug')
    ]);

    expect(Object.keys(layout.positions).toSorted()).toEqual(['D1', 'D2', 'P1']);
  });
});
