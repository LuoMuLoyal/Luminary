import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import i18n from '@/lib/i18n';
import { DrugDetailView } from './drug-detail-view';

/**
 * 这一组测试锁住用户明确要求的那条规则，而且是在**渲染层**验证：
 *
 * > 有什么字段展示什么字段，不写「暂无数据」。
 *
 * 投影层已经剔除了空值（见 `application/project-detail.test.ts`），这里验证
 * 视图层确实**不渲染空区块**——包括不渲染任何形式的占位文案。
 */
function render(ui: React.ReactElement) {
  return renderToStaticMarkup(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

const emptyView = {
  name: 'Fluvoxamine',
  id: 'DB00176',
  subtitle: null,
  identity: [],
  counts: { targets: 0, synonyms: 0, crossRefs: 0 },
  textSections: [],
  targets: [],
  pharmacokinetics: [],
  crossRefs: []
};

describe('详情视图：有数据才渲染区块', () => {
  it('全部为空时只渲染标题，不出现任何空状态文案', () => {
    const html = render(<DrugDetailView {...emptyView} />);

    // 标题永远在。
    expect(html).toContain('Fluvoxamine');
    expect(html).toContain('DB00176');

    // 区块标题不该出现——没有内容就不该有区块外壳。
    for (const heading of [
      'Identity',
      'Description and mechanism',
      'Targets and mechanism',
      'Pharmacokinetics',
      'Cross references'
    ]) {
      expect(html, `不应渲染空区块：${heading}`).not.toContain(heading);
    }

    // 任何形式的「暂无数据」都不允许出现。
    expect(html).not.toMatch(/no data|暂无数据|N\/A|not available/i);
  });

  it('只有部分字段时，只渲染有数据的区块', () => {
    const html = render(
      <DrugDetailView
        {...emptyView}
        pharmacokinetics={[{ labelKey: 'pk.halfLife', value: '15 hours', mono: false }]}
      />
    );

    expect(html).toContain('Pharmacokinetics');
    expect(html).toContain('Half life');
    expect(html).toContain('15 hours');

    // 其余区块仍然不出现。
    expect(html).not.toContain('Targets and mechanism');
    expect(html).not.toContain('Cross references');
  });

  it('计数为 0 的项不显示，避免"0 个靶点"这种噪音', () => {
    const html = render(
      <DrugDetailView {...emptyView} counts={{ targets: 0, synonyms: 0, crossRefs: 0 }} />
    );

    expect(html).not.toContain('Interaction partners');
    expect(html).not.toContain('Synonyms');
  });

  it('有计数时显示真实数字', () => {
    const html = render(
      <DrugDetailView {...emptyView} counts={{ targets: 3, synonyms: 0, crossRefs: 9 }} />
    );

    expect(html).toContain('Targets');
    expect(html).toContain('>3<');
    expect(html).toContain('External references');
  });

  it('靶点表渲染作用方式，且 UniProt 是等宽', () => {
    const html = render(
      <DrugDetailView
        {...emptyView}
        targets={[
          {
            name: 'Cytochrome P450 3A4',
            geneName: 'CYP3A4',
            relationKind: 'enzyme',
            actions: ['inhibitor', 'substrate'],
            species: 'Human',
            uniprotId: 'P08684',
            pdbIds: []
          }
        ]}
      />
    );

    expect(html).toContain('Cytochrome P450 3A4');
    expect(html).toContain('CYP3A4');
    expect(html).toContain('inhibitor');
    expect(html).toContain('P08684');
    expect(html).toContain('font-mono');
  });

  it('交叉引用：只有带 URL 的才渲染成链接', () => {
    const html = render(
      <DrugDetailView
        {...emptyView}
        crossRefs={[
          { resource: 'PubChem', value: '5362119', url: null },
          {
            resource: 'Wikipedia',
            value: 'https://en.wikipedia.org/wiki/Lisinopril',
            url: 'https://en.wikipedia.org/wiki/Lisinopril'
          }
        ]}
      />
    );

    expect(html).toContain('5362119');
    // 外链必须带 target 与 rel，否则在 Tauri 的 WebView 里会顶掉当前页面。
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });
});
