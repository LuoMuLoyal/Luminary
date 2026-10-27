import { useTranslation } from 'react-i18next';

import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ANALYSIS_NAMESPACE } from '@/lib/i18n';
import type { ProblemDetails } from '@/lib/problem-details';

/**
 * 请求失败的展示。
 *
 * ## 为什么失败必须单独成一个组件
 *
 * 这是本页最重要的一条界线：**「字段缺失」与「请求失败」不能长得一样**。
 *
 * - 字段缺失 → 那个区块**不渲染**（用户要求：有什么展示什么，不写"暂无数据"）。
 * - 请求失败 → **必须显式报错**，否则用户会把「我们没查到」读成「这个药没有数据」。
 *
 * 在药品数据上，后者是误导而不是体验问题。所以错误态有独立组件、独立文案，
 * 不复用任何"空"的样式。
 *
 * ## 为什么要把「连不上」和「服务端拒绝」分开说
 *
 * 两者的下一步动作完全不同：前者检查网络，后者是服务端的问题。
 *
 * 而且**不能把 `problem.detail` 直接显示给用户**：网络失败的 detail 是浏览器给的
 * 原始字符串（`Failed to fetch`），是英文的、面向开发者的。所以这里按 `status`
 * 分支：`0` 表示请求根本没拿到 HTTP 响应，走本地化的通用文案；有状态码时才展示
 * 服务端的 detail（那个可能已被后端本地化）。
 */
export function RequestFailure({
  problem,
  onRetry,
  titleKey
}: {
  problem: ProblemDetails;
  onRetry?: () => void;
  /** `analysis` 命名空间下的标题键；缺省按「连不上 / 服务端拒绝」自动选。 */
  titleKey?: string;
}) {
  const { t } = useTranslation();

  // status 0 = 没有 HTTP 响应（网络中断、DNS 失败、CORS 被拦）。
  const isTransportFailure = problem.status === 0;

  const resolvedTitleKey =
    titleKey ?? (isTransportFailure ? 'state.networkTitle' : 'state.unavailable');

  return (
    <Alert variant='destructive'>
      <Icons.alertCircle />
      <AlertTitle>{t(`${ANALYSIS_NAMESPACE}:${resolvedTitleKey}`)}</AlertTitle>
      <AlertDescription>
        <span>
          {isTransportFailure
            ? t(`${ANALYSIS_NAMESPACE}:state.networkBody`)
            : // 服务端的 detail 可能已本地化；没有就退回标题，不编造原因。
              (problem.detail ?? problem.title)}
        </span>
        {/* 稳定错误码只在服务端给的情况下展示——它是排查用的，不是给用户读的。
            网络失败没有服务端码，显示 'NETWORK_ERROR' 只会造成困惑。 */}
        {!isTransportFailure && problem.code && (
          <span className='text-muted-foreground ml-2 font-mono text-xs'>{problem.code}</span>
        )}
        {onRetry && (
          <div className='mt-3'>
            <Button variant='outline' size='sm' onClick={onRetry}>
              {t(`${ANALYSIS_NAMESPACE}:state.retry`)}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
