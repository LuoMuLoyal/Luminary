import { describe, expect, it } from 'vitest';

import i18n from '@/lib/i18n';
import { buildBreadcrumbs } from './use-breadcrumbs';

/**
 * 面包屑的标题来自 `nav-config`，属于 `nav` 命名空间。这里不渲染组件，
 * 只验证「哪些路径段解析到了键、这些键是否真有译文」——渲染层再拿错命名空间
 * 是另一个错误（见 `breadcrumbs.tsx` 用 `navT`）。
 */
describe('面包屑', () => {
  it('分区根与页面段都解析到 nav 键', () => {
    const items = buildBreadcrumbs('/analysis/drug');

    expect(items.map((i) => i.link)).toEqual(['/analysis', '/analysis/drug']);
    expect(items.every((i) => i.isKey)).toBe(true);
    expect(items.map((i) => i.title)).toEqual(['group.analysis', 'item.drugAnalysis']);
  });

  it('每个解析出的键在两种语言下都有译文', () => {
    const paths = ['/analysis/drug', '/analysis/combination', '/analysis/structure'];

    for (const path of paths) {
      for (const item of buildBreadcrumbs(path)) {
        if (!item.isKey) continue;
        for (const lng of ['en', 'zh-CN']) {
          const value = i18n.getFixedT(lng)(`nav:${item.title}`);
          expect(value, `${lng} 缺少 nav:${item.title}`).not.toBe(`nav:${item.title}`);
        }
      }
    }
  });

  it('中文下不再是英文路径段', () => {
    // 回归：`/analysis` 曾未登记，掉进兜底分支后固定显示英文 'Analysis'。
    const zh = i18n.getFixedT('zh-CN');
    const root = buildBreadcrumbs('/analysis/drug')[0];

    expect(root.isKey).toBe(true);
    expect(zh(`nav:${root.title}`)).toBe('分析');
  });

  it('未登记的路径原样显示，不编造译名', () => {
    const items = buildBreadcrumbs('/analysis/drug/DB00176');
    const last = items.at(-1);

    expect(last?.isKey).toBe(false);
    expect(last?.title).toBe('DB00176');
  });
});
