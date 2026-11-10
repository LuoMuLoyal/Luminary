/**
 * 邻域图的**放射布局**（纯函数，不依赖 React 与 @xyflow）。
 *
 * ## 为什么不用力导向
 *
 * 力导向每次打开形状都不一样，同一份数据两次访问看起来是两个图。药品分析页是
 * 读数工具，图的形状应当**稳定可预期**：同样的药永远是同样的样子，用户第二次
 * 来看时能凭位置认出来。
 *
 * 而且 30 个节点根本不需要力导向——那是百级以上才用的。
 *
 * ## 为什么靶点在内圈、相互作用在外圈
 *
 * 靶点通常个位数且是「这个药作用于什么」的结论，相互作用则是大量同质的伙伴。
 * 内圈离中心近、视觉权重高，正好对应信息密度：读图的人第一眼先看到靶点，
 * 再往外看相互作用。
 *
 * ## 领域纯度
 *
 * 不 import 任何东西（ADR-0024：`domain/` 不依赖框架）。邻居只需要 `id` 与
 * `nodeKind`，因此这里用结构化最小值而不是契约类型。
 */

/** 布局入参：只要求能区分「靶点 / 药物」两类。 */
export interface LayoutNeighbour {
  readonly id: string;
  readonly nodeKind: 'drug' | 'protein';
}

/** 画布坐标。 */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** 布局结果：每个邻居的坐标 + 中心点。 */
export interface RadialLayout {
  readonly center: Point;
  readonly positions: Readonly<Record<string, Point>>;
}

/** 中心点（画布原点）。 */
export const LAYOUT_CENTER: Point = { x: 0, y: 0 };

/** 靶点所在内圈半径。 */
export const INNER_RING_RADIUS = 190;

/** 相互作用所在外圈半径。 */
export const OUTER_RING_RADIUS = 340;

/**
 * 把邻居排成两圈。
 *
 * 同一圈内**均匀分布**：数量为 n 时第 i 个的角度是 `2πi/n`，从正上方开始
 * （`-π/2`），这样布局关于纵轴对称，不会因为起点随机而显得歪斜。
 *
 * @param neighbours 邻居列表；顺序决定同一圈内的排位。
 */
export function layoutNeighbours(neighbours: readonly LayoutNeighbour[]): RadialLayout {
  const targets = neighbours.filter((item) => item.nodeKind === 'protein');
  const drugs = neighbours.filter((item) => item.nodeKind === 'drug');

  const positions: Record<string, Point> = {};

  assignRing(targets, INNER_RING_RADIUS, positions);
  assignRing(drugs, OUTER_RING_RADIUS, positions);

  return { center: LAYOUT_CENTER, positions };
}

/** 把一个集合均匀铺在一个圆环上。 */
function assignRing(
  items: readonly LayoutNeighbour[],
  radius: number,
  into: Record<string, Point>
): void {
  const count = items.length;
  if (count === 0) return;

  for (let index = 0; index < count; index += 1) {
    const item = items[index];
    if (!item) continue;

    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count;
    into[item.id] = {
      x: round(radius * Math.cos(angle)),
      y: round(radius * Math.sin(angle))
    };
  }
}

/** 保留一位小数：坐标是像素，多余精度只是噪音，也让测试断言稳定。 */
function round(value: number): number {
  return Math.round(value * 10) / 10;
}
