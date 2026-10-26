import { describe, expect, it } from 'vitest';

import i18n from '@/lib/i18n';

/**
 * 探针：确认 i18next 的命名空间解析方式。
 *
 * 背景：`nav.*` 的键此前用 `t('nav.item.drugAnalysis')` 取，返回的是键本身。
 * i18next 的键格式是 `<ns>:<path>` 而不是 `<ns>.<path>`，所以那样取不到。
 */
describe('i18n 命名空间解析', () => {
  it('nav 命名空间的键要用 ns 前缀或显式 ns 选项', () => {
    const t = i18n.getFixedT('en');

    expect(t('item.drugAnalysis', { ns: 'nav' })).toBe('Drug Analysis');
    expect(t('nav:item.drugAnalysis')).toBe('Drug Analysis');

    // 这个写法是错的，探针把它固定下来，避免以后又写回去。
    expect(t('nav.item.drugAnalysis')).toBe('nav.item.drugAnalysis');
  });

  it('auth 是 defaultNS，键可以直接取', () => {
    expect(i18n.getFixedT('en')('app.name')).toBe('Lumine');
  });
});
