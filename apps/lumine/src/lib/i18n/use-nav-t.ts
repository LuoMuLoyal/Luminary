import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NAV_NAMESPACE } from './index';

/**
 * 取导航文案的翻译函数，**自动补上命名空间前缀**。
 *
 * ## 为什么需要这个 hook
 *
 * i18next 的完整键格式是 `<namespace>:<path>`，**不是** `<namespace>.<path>`。
 * 所以 `t('nav.item.drugAnalysis')` 取不到任何东西，i18next 会把键原样返回——
 * 界面上的表现是侧边栏直接显示 `nav.item.drugAnalysis`，而不是报错。
 * 这个失败形态很安静，编译期和运行时都不会拦住它。
 *
 * 这里把前缀固定住，调用点只写路径（`navT('item.drugAnalysis')`），
 * 没有机会写错分隔符。
 *
 * ## 为什么不用 `useTranslation('nav')`
 *
 * 那会把默认命名空间改成 `nav`，于是同一个组件里的 `t('app.name')`
 * （在 `auth` 命名空间下）会失效——用一个错误换另一个错误。
 * 这里保留默认命名空间，只给导航键补前缀。
 */
export function useNavT() {
  const { t } = useTranslation();

  return useCallback((key: string) => t(`${NAV_NAMESPACE}:${key}`), [t]);
}
