import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/lib/i18n';
import { PlaceholderPage } from './placeholder-page';

/**
 * 这一组测试存在的理由：i18next 的键格式是 `<ns>:<path>`，写成 `<ns>.<path>`
 * 不会报错，而是**把键原样渲染到界面上**。占位页同时用两个命名空间，
 * 是最容易写错的地方，所以在这里锁住。
 */
describe('占位页', () => {
  it('渲染出标题与能力说明，且不残留 i18n 键', () => {
    const html = renderToStaticMarkup(
      <I18nextProvider i18n={i18n}>
        <PlaceholderPage
          titleKey='item.drugAnalysis'
          descriptionKey='drug.description'
          capabilityKey='drug.capability'
          icon='pill'
        />
      </I18nextProvider>
    );

    expect(html).toContain('Drug Analysis');
    // 未翻译的键会原样出现在 DOM 里，这是最容易被漏掉的失败形态。
    expect(html).not.toMatch(/nav[:.]item/);
    expect(html).not.toMatch(/analysis[:.]drug/);
  });

  it('三个分析页的键在两种语言下都有译文', () => {
    const keys = [
      ['nav', 'item.drugAnalysis'],
      ['nav', 'item.combinationAnalysis'],
      ['nav', 'item.structureAnalysis'],
      ['analysis', 'drug.description'],
      ['analysis', 'combination.description'],
      ['analysis', 'structure.description'],
      ['analysis', 'drug.capability'],
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
