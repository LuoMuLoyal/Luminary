import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ANALYSIS_NAMESPACE } from '@/lib/i18n';
import type {
  CountSummary,
  CrossRef,
  Metric,
  TargetRow,
  TextSection
} from '../application/project-detail';
import { MetricList, Section } from './metric-list';

/**
 * 详情视图 —— **只负责渲染已经有值的东西**。
 *
 * ## 这个组件里为什么没有一个「暂无数据」分支
 *
 * 因为拿不到空值。所有空值在 `application/project-detail.ts` 的投影阶段就被剔除了，
 * 传进来的每个数组要么有内容、要么是空数组。空数组的处理是**整块不渲染**，
 * 而不是渲染一行提示。
 *
 * 这样做的结果正是用户要的：有什么字段展示什么字段。缺毒性数据的药，
 * 页面上就没有毒性区块——不会出现一片"暂无数据"。
 *
 * ## 与「请求失败」的区别
 *
 * 失败不会走到这里：`resolveDetailState` 在更外层把失败分成了 `error` 状态，
 * 由 `RequestFailure` 渲染。所以本组件内不存在"没有内容"的可能性。
 */
export function DrugDetailView({
  name,
  id,
  subtitle,
  identity,
  counts,
  textSections,
  targets,
  pharmacokinetics,
  crossRefs
}: {
  name: string;
  id: string;
  subtitle: string | null;
  identity: readonly Metric[];
  counts: CountSummary;
  textSections: readonly TextSection[];
  targets: readonly TargetRow[];
  pharmacokinetics: readonly Metric[];
  crossRefs: readonly CrossRef[];
}) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-8'>
      <header className='flex flex-col gap-1'>
        <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>{name}</h1>
          <span className='text-muted-foreground font-mono text-sm'>{id}</span>
        </div>
        {subtitle && <p className='text-muted-foreground text-sm'>{subtitle}</p>}
      </header>

      <Counts counts={counts} />

      {identity.length > 0 && (
        <Section titleKey='section.identity'>
          <MetricList metrics={identity} />
        </Section>
      )}

      {textSections.length > 0 && (
        <Section titleKey='section.text'>
          <div className='flex flex-col gap-4'>
            {textSections.map((section) => (
              <div key={section.labelKey} className='flex flex-col gap-1'>
                <h3 className='text-sm font-medium'>
                  {t(`${ANALYSIS_NAMESPACE}:${section.labelKey}`)}
                </h3>
                {/* 长文本保持可读行宽，不铺满整个宽屏。 */}
                <p className='max-w-prose text-sm/relaxed whitespace-pre-line'>{section.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {targets.length > 0 && (
        <Section titleKey='section.targets'>
          <TargetTable rows={targets} />
        </Section>
      )}

      {pharmacokinetics.length > 0 && (
        <Section titleKey='section.pk'>
          <MetricList metrics={pharmacokinetics} />
        </Section>
      )}

      {crossRefs.length > 0 && (
        <Section titleKey='section.crossRefs'>
          <CrossRefTable rows={crossRefs} />
        </Section>
      )}
    </div>
  );
}

/**
 * 概览计数。
 *
 * 计数为 0 的项**不显示**——0 个靶点没有信息量，写出来只是噪音。
 * 这一条与「有什么展示什么」一致：0 就是没有。
 *
 * 这里没有「相互作用对象」一项：详情接口对相互作用是 `take: 200`，
 * 那个长度不是真实度数（`DB00176` 真实是 2,249）。宁可不显示，
 * 也不用截断值冒充总数，理由见 `project-detail.ts`。
 */
function Counts({ counts }: { counts: CountSummary }) {
  const { t } = useTranslation();

  const entries = (
    [
      ['counts.targets', counts.targets],
      ['counts.synonyms', counts.synonyms],
      ['counts.crossRefs', counts.crossRefs]
    ] as const
  ).filter(([, value]) => value > 0);

  if (entries.length === 0) return null;

  return (
    <dl className='flex flex-wrap gap-x-8 gap-y-3'>
      {entries.map(([key, value]) => (
        <div key={key} className='flex flex-col'>
          <dt className='text-muted-foreground text-xs'>{t(`${ANALYSIS_NAMESPACE}:${key}`)}</dt>
          <dd className='font-mono text-lg tabular-nums'>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TargetTable({ rows }: { rows: readonly TargetRow[] }) {
  const { t } = useTranslation();
  const head = (key: string) => t(`${ANALYSIS_NAMESPACE}:targets.${key}`);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{head('name')}</TableHead>
          <TableHead>{head('gene')}</TableHead>
          <TableHead>{head('kind')}</TableHead>
          <TableHead>{head('actions')}</TableHead>
          <TableHead>{head('species')}</TableHead>
          <TableHead>{head('uniprot')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.name}:${row.uniprotId ?? ''}`}>
            <TableCell className='font-medium'>{row.name}</TableCell>
            <TableCell>{row.geneName}</TableCell>
            <TableCell>{row.relationKind}</TableCell>
            <TableCell>
              {/* 作用方式可能多个，用 Badge 并列；空数组时不渲染任何东西。 */}
              {row.actions.length > 0 ? (
                <span className='flex flex-wrap gap-1'>
                  {row.actions.map((action) => (
                    <Badge key={action} variant='secondary'>
                      {action}
                    </Badge>
                  ))}
                </span>
              ) : null}
            </TableCell>
            <TableCell>{row.species}</TableCell>
            <TableCell className='font-mono text-xs'>{row.uniprotId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CrossRefTable({ rows }: { rows: readonly CrossRef[] }) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t(`${ANALYSIS_NAMESPACE}:crossRefs.resource`)}</TableHead>
          <TableHead>{t(`${ANALYSIS_NAMESPACE}:crossRefs.identifier`)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.resource}:${row.value}`}>
            <TableCell>{row.resource}</TableCell>
            <TableCell className='font-mono text-xs break-all'>
              {row.url ? (
                <a
                  href={row.url}
                  target='_blank'
                  rel='noreferrer'
                  className='text-primary underline underline-offset-4'
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * 详情加载骨架。
 *
 * 形状**匹配最终布局**（标题 + 计数 + 若干区块），不用转圈：
 * 骨架的意义是让布局提前稳定下来，一个居中的 spinner 做不到这件事。
 */
export function DrugDetailSkeleton() {
  return (
    <div className='flex flex-col gap-8' aria-busy='true'>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-40' />
      </div>
      <div className='flex gap-8'>
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className='h-12 w-24' />
        ))}
      </div>
      {[0, 1].map((index) => (
        <div key={index} className='flex flex-col gap-3'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-32 w-full' />
        </div>
      ))}
    </div>
  );
}
