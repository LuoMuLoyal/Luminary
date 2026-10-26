import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/lib/i18n';

/**
 * 渲染层测试。
 *
 * 之前的 bug 恰好只在这一层：`buildBreadcrumbs` 返回的键是对的，但组件用默认的
 * `t()` 去取 `nav` 命名空间的键，取不到就把键原样渲染出来。纯函数测试发现不了它，
 * 所以这里直接断言渲染结果里不出现键名。
 */
const pathname = vi.hoisted(() => ({ current: '/analysis/drug' }));

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: pathname.current })
}));

import { Breadcrumbs } from './breadcrumbs';

function render() {
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <Breadcrumbs />
    </I18nextProvider>
  );
}

describe('面包屑渲染', () => {
  it('英文下显示译名，不残留键名', async () => {
    await i18n.changeLanguage('en');
    const html = render();

    expect(html).toContain('Analysis');
    expect(html).toContain('Drug Analysis');
    // 键泄漏到界面是这次要修的形态，用正则连前缀一起挡掉。
    expect(html).not.toMatch(/nav[:.]/);
    expect(html).not.toMatch(/item\.drugAnalysis/);
  });

  it('中文下分区根也翻译，不再是英文路径段', async () => {
    await i18n.changeLanguage('zh-CN');
    const html = render();

    expect(html).toContain('分析');
    expect(html).toContain('单药分析');
    expect(html).not.toMatch(/nav[:.]/);

    await i18n.changeLanguage('en');
  });
});
