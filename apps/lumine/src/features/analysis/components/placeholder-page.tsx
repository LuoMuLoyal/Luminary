import { useTranslation } from 'react-i18next';

import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty';
import { ANALYSIS_NAMESPACE, NAV_NAMESPACE } from '@/lib/i18n';

/**
 * 尚未实现的页面占位。
 *
 * ## 为什么占位也要进 i18n
 *
 * 「占位」不是「可以写死」的理由：默认语言是英文，写死中文会让英文用户看到
 * 一段看不懂的文字；而占位页恰恰最容易被复制去当模板，写死一次会被抄到每一页。
 *
 * ## 键为什么要带命名空间前缀
 *
 * 标题来自 `nav`、能力说明来自 `analysis`，两个命名空间不同，所以这里显式
 * 拼接前缀（`<ns>:<path>`）而不是用 `useNavT()`。
 *
 * ## 为什么显示能力说明而不是「敬请期待」
 *
 * 这几个页面在 `PRODUCT.md` 里已有明确定义（数据来源、限制、依赖）。把结论
 * 摆在页面上，能让打开页面的人立刻知道这里将来做什么，而不是只看到空壳。
 */
export function PlaceholderPage({
  titleKey,
  descriptionKey,
  icon,
  capabilityKey
}: {
  /** `nav` 命名空间下的路径（不含 `nav:` 前缀）。 */
  titleKey: string;
  /** `analysis` 命名空间下的路径（不含 `analysis:` 前缀）。 */
  descriptionKey: string;
  icon: keyof typeof Icons;
  /** `analysis` 命名空间下的能力说明路径。 */
  capabilityKey?: string;
}) {
  const { t } = useTranslation();
  const Icon = Icons[icon];

  return (
    <PageContainer
      pageTitle={t(`${NAV_NAMESPACE}:${titleKey}`)}
      pageDescription={t(`${ANALYSIS_NAMESPACE}:${descriptionKey}`)}
    >
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icon />
          </EmptyMedia>
          <EmptyTitle>{t(`${ANALYSIS_NAMESPACE}:placeholder.title`)}</EmptyTitle>
          {capabilityKey && (
            <EmptyDescription>{t(`${ANALYSIS_NAMESPACE}:${capabilityKey}`)}</EmptyDescription>
          )}
        </EmptyHeader>
        <EmptyContent>
          <Badge variant='secondary'>{t(`${ANALYSIS_NAMESPACE}:placeholder.badge`)}</Badge>
        </EmptyContent>
      </Empty>
    </PageContainer>
  );
}
