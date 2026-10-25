import { useTranslation } from 'react-i18next';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { LanguageMenuItems } from './language-menu-items';

/**
 * 登录/注册页右上角的语言切换。
 *
 * ## 为什么表单页要单独有一个
 *
 * `LanguageMenuItems` 原本只挂在账号菜单里，而账号菜单只在登录后的侧边栏出现。
 * 于是登录/注册页——恰恰是最需要切换语言的页面——没有任何入口：一个只读得懂
 * 中文的用户在英文默认界面里找不到「切中文」的地方，也没法去账号菜单找。
 *
 * ## 菜单项复用而不是复制
 *
 * 展开后的选项直接复用 {@link LanguageMenuItems}，与账号菜单里的那份保持同一
 * 行为（含「关闭动画后再切」的处理）。这里只补一个触发按钮。
 *
 * ## 当前语言直接显示在按钮上
 *
 * 图标-only 的按钮在登录页这种空场景里看不出是做什么的；把 `English` /
 * `简体中文` 写在按钮上，用户不必点开就知道这里能换语言。
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  // `resolvedLanguage` 是 i18next 归一过的值（en / zh-CN），但类型上是 string。
  const currentLabel =
    SUPPORTED_LANGUAGES.find((language) => language === current) !== undefined
      ? LANGUAGE_LABELS[current as (typeof SUPPORTED_LANGUAGES)[number]]
      : (current ?? '');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' aria-label={t('language.label')}>
          <Icons.palette className='size-4' />
          <span>{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-36'>
        <LanguageMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
