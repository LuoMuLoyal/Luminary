import { useTranslation } from 'react-i18next';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, setLanguage, type Language } from '@/lib/i18n';

/**
 * 语言切换菜单项。
 *
 * ## 没有标题行
 *
 * 曾有一行「Language」标签。触发按钮本身已经显示当前语言（`English` /
 * `简体中文`），账号菜单里的语言项又紧跟在账号信息下方，标题只是重复。
 *
 * ## 为什么放在账号菜单而不是主题区
 *
 * 主题是「这台机器看起来怎样」，语言是「这个人怎么读」——后者跟着账号走，
 * 与身份同类。主题工具条上已经有三个控件，再塞一个会把「个性化」和
 * 「可读性」混在一起。
 *
 * ## 菜单关闭后再切
 *
 * `DropdownMenuItem` 的 `onSelect` 里直接 `changeLanguage` 会让 Radix 在关闭
 * 动画期间重渲染整棵树，偶发闪烁。这里让选择先完成，再异步切语言。
 */
export function LanguageMenuItems() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  function change(language: Language) {
    // 先让 Radix 完成关闭，再切语言，避免关闭动画期间整树重渲染。
    queueMicrotask(() => {
      void setLanguage(language);
    });
  }

  return (
    <>
      {SUPPORTED_LANGUAGES.map((language) => (
        <DropdownMenuItem
          key={language}
          onSelect={() => change(language)}
          className='justify-between'
        >
          <span>{LANGUAGE_LABELS[language]}</span>
          {current === language && <Icons.check className='size-4' />}
        </DropdownMenuItem>
      ))}
    </>
  );
}
