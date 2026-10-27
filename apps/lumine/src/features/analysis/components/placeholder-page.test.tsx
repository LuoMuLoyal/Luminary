import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/lib/i18n';
import { PlaceholderPage } from './placeholder-page';

/**
 * 这一组测试存在的理由：i18next 的键格式是 `<ns>:<path>`，写成 `<ns>.<path>`
 * 不会报错，而是**把键原样渲染到界面上**。所以这里锁住「不残留键」。
 */
describe('占位页', () => {
  it('渲染能力说明，且不残留 i18n 键', () => {
    const html = renderToStaticMarkup(
      <I18nextProvider i18n={i18n}>
        <PlaceholderPage
          descriptionKey='drug.description'
          capabilityKey='drug.capability'
          icon='pill'
        />
      </I18nextProvider>
    );

    // 描述与能力说明有译文。
    expect(html).toContain('Targets, mechanism and druggability for a single drug');

    // 未翻译的键会原样出现在 DOM 里，这是最容易被漏掉的失败形态。
    expect(html).not.toMatch(/analysis[:.]drug/);
    expect(html).not.toMatch(/analysis[:.]placeholder/);
  });

  it('不再渲染页面大标题（面包屑已是当前页指示器）', () => {
    // 回归：页面标题曾与面包屑末项、侧边栏高亮项重复出现三次。
    // PageContainer 现在只渲染描述，标题由面包屑承担。
    const html = renderToStaticMarkup(
      <I18nextProvider i18n={i18n}>
        <PlaceholderPage
          descriptionKey='drug.description'
          capabilityKey='drug.capability'
          icon='pill'
        />
      </I18nextProvider>
    );

    expect(html).not.toContain('<h1');
    expect(html).not.toContain('Drug Analysis');
  });

  it('三个分析页的文案键在两种语言下都有译文', () => {
    const keys = [
      ['analysis', 'drug.description'],
      ['analysis', 'combination.description'],
      ['analysis', 'structure.description'],
      ['analysis', 'combination.capability'],
      ['analysis', 'structure.capability']
    ] as const;

    for (const lng of ['en', 'zh-CN']) {
      for (const [ns, key] of keys) {
        const value = i18n.getFixedT(lng)(`${ns}:${key}`);
        expect(value, `${lng} 缺少 ${ns}:${key}`).not.toBe(`${ns}:${key}`);
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});
