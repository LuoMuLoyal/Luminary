import { ReactFlow, Background, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { ANALYSIS_NAMESPACE } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import type { NetworkView } from '../application/project-network';
import { layoutNeighbours } from '../domain/network-layout';

/**
 * 限流邻域图。
 *
 * ## 它刻意不是「把整个网络画出来」
 *
 * 实测单药相互作用度数中位数 542、`DB00176` 达 2,249。把这些全画出来是一团
 * 不可读的毛球，而且渲染成本会随度数爆炸。所以这里画的是**后端限流后的 30 个
 * 邻居**，并且：
 *
 * - 图上常驻「还有 N 个未显示」——**不是静默少画**。少了这句话，用户会把 30
 *   当成全部，那是对度数撒谎；
 * - 注明选择依据是「按 id 排序」而非重要性（后端的 `ordering` 字段）；
 * - 提供「展开更多」，让 2,249 度的药可以继续探索，而不是一次渲染。
 *
 * ## 为什么图例写明「仅含数据写明的关系」
 *
 * 本图只有事实边（数据里直接写明的相互作用与靶点边），没有任何推理边。
 * 把推断画得和数据一样就是误导（`PRODUCT.md` §4.3）。
 *
 * ## 布局
 *
 * 用 `domain/network-layout.ts` 的放射布局（纯函数、可单测），不用力导向：
 * 力导向每次打开形状都不同，而这是读数工具，形状应当稳定可复现。
 */

/** 画布高度。固定值而不是自适应：ReactFlow 需要父容器有确定高度。 */
const CANVAS_HEIGHT = 520;

export function RelationNetwork({
  view,
  onExpand,
  canExpand
}: {
  view: NetworkView;
  onExpand: () => void;
  canExpand: boolean;
}) {
  const { t } = useTranslation();

  const { nodes, edges } = useMemo(() => buildGraph(view), [view]);

  return (
    <div className='flex flex-col gap-3'>
      <div
        className='border-border bg-muted/20 overflow-hidden rounded-lg border'
        style={{ height: CANVAS_HEIGHT }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          // 只读画布：节点不可拖、不可连。拖动会让布局漂移，而布局的稳定性
          // 正是这个图相对力导向的取舍点；平移缩放仍然可用。
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={1.6}
        >
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>

      <Legend />

      {!view.complete && (
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-muted-foreground text-sm'>
            {t(`${ANALYSIS_NAMESPACE}:network.truncated`, { count: view.truncated })}
          </p>
          {canExpand && (
            <Button variant='outline' size='sm' onClick={onExpand}>
              {t(`${ANALYSIS_NAMESPACE}:network.expand`)}
            </Button>
          )}
        </div>
      )}

      {view.idOrdered && (
        <p className='text-muted-foreground text-xs'>
          {t(`${ANALYSIS_NAMESPACE}:network.orderingNote`)}
        </p>
      )}
    </div>
  );
}

/**
 * 契约视图 → ReactFlow 的节点与边。
 *
 * 节点坐标来自纯函数布局；边全部是事实边，因此统一实线，只用颜色区分
 * 「靶点」与「相互作用伙伴」。
 */
function buildGraph(view: NetworkView): { nodes: Node[]; edges: Edge[] } {
  const layout = layoutNeighbours(
    view.nodes.map((node) => ({
      id: node.id,
      nodeKind: node.kind === 'protein' ? 'protein' : 'drug'
    }))
  );

  const nodes: Node[] = [
    {
      id: view.center.id,
      position: layout.center,
      data: { label: view.center.label },
      // 中心节点用实心底，和邻居区分开。
      className:
        'rounded-md border border-primary bg-primary px-3 py-2 text-xs font-medium text-primary-foreground'
    },
    ...view.nodes.map((node) => ({
      id: node.id,
      position: layout.positions[node.id] ?? { x: 0, y: 0 },
      data: { label: node.label },
      className: cn(
        'max-w-[9rem] truncate rounded-md border bg-background px-2 py-1 text-xs',
        node.kind === 'protein' ? 'border-emerald-500/50' : 'border-border',
        // 库外节点用虚线边框提示「不可跳转」
        !node.inCatalogue && 'border-dashed opacity-80'
      )
    }))
  ];

  const edges: Edge[] = view.links.map((link) => ({
    id: `${link.from}->${link.to}`,
    source: link.from,
    target: link.to,
    // 事实边一律实线；用颜色区分靶点与相互作用。
    type: 'default',
    style: {
      stroke: link.kind === 'target' ? 'rgba(16,185,129,0.6)' : 'rgba(148,163,184,0.5)',
      strokeWidth: 1
    }
  }));

  return { nodes, edges };
}

/**
 * 图例。
 *
 * 必须写明「仅含事实边」：这个页面的其他区块会混入 AI 生成的结论，
 * 而图里一条推断都没有。不说明的话，用户会以为图上的边也是模型推出来的。
 */
function Legend() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-xs'>
      <span className='flex items-center gap-1.5'>
        <span className='size-2.5 rounded-sm border border-emerald-500/60 bg-emerald-500/20' />
        {t(`${ANALYSIS_NAMESPACE}:network.legend.target`)}
      </span>
      <span className='flex items-center gap-1.5'>
        <span className='bg-border size-2.5 rounded-sm border' />
        {t(`${ANALYSIS_NAMESPACE}:network.legend.interaction`)}
      </span>
      <span className='text-muted-foreground'>
        {t(`${ANALYSIS_NAMESPACE}:network.legend.factsOnly`)}
      </span>
    </div>
  );
}
