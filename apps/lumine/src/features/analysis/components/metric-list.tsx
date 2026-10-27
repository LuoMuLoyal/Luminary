import { useTranslation } from 'react-i18next';

import { Separator } from '@/components/ui/separator';
import { ANALYSIS_NAMESPACE } from '@/lib/i18n';
import type { Metric } from '../application/project-detail';

/**
 * 一组「标签 + 值」度量行。
 *
 * ## 为什么这里不判空
 *
 * 传入的 `metrics` 已在 `application/project-detail.ts` 里过滤过空值——投影阶段
 * 就把 `null` / 空串 / 空数组剔除了。所以这一层**拿不到空值**，也就不可能渲染出
 * 「暂无数据」。这不是靠自觉，是靠数据形状。
 *
 * 空数组时整块不渲染（返回 `null`），由调用处决定要不要包一层区块标题。
 *
 * ## 为什么数值用等宽
 *
 * 分子量、logP、TPSA 这些数字要纵向对齐才好扫读（taste-skill §7：
 * "font-mono for all numbers"）。
 */
export function MetricList({ metrics }: { metrics: readonly Metric[] }) {
  const { t } = useTranslation();

  if (metrics.length === 0) return null;

  return (
    <dl className='grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(9rem,auto)_1fr]'>
      {metrics.map((metric) => (
        <div key={metric.labelKey} className='contents'>
          <dt className='text-muted-foreground text-sm'>
            {t(`${ANALYSIS_NAMESPACE}:${metric.labelKey}`)}
          </dt>
          <dd className={metric.mono ? 'font-mono text-sm break-all' : 'text-sm break-words'}>
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * 带标题的区块。
 *
 * 区块标题本身**不表示"有数据"**——空内容的区块应当由调用处直接不渲染，
 * 而不是渲染一个只有标题的空壳。
 */
export function Section({
  titleKey,
  children
}: {
  /** `analysis` 命名空间下的标题键。 */
  titleKey: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <section className='flex flex-col gap-3'>
      <h2 className='text-sm font-medium tracking-wide uppercase'>
        {t(`${ANALYSIS_NAMESPACE}:${titleKey}`)}
      </h2>
      <Separator />
      {children}
    </section>
  );
}
