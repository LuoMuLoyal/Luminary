import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import i18n from '@/lib/i18n';
import { DrugAnalysisPage } from './drug-analysis-page';

/**
 * 容器层的状态分支测试。
 *
 * 这里验证的是**「哪个状态渲染哪个分支」**这条接线是否正确，而不是各分支长什么样
 * （那是 `drug-detail-view.test.tsx` 的事）。用 `renderToStaticMarkup` 走服务端渲染，
 * 因此 `useQuery` 处于「未开始」形态：选择为空时详情查询被禁用，正好覆盖空状态。
 */
function render(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </QueryClientProvider>
  );
}

const noop = () => undefined;

describe('单药分析容器：两栏布局', () => {
  it('未选中时左栏有搜索框，右栏提示去选一个', () => {
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='drugbank'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    expect(html).toContain('Name, CAS number or UNII');
    expect(html).toContain('Select a medicine');
    expect(html).toContain('Pick one from the list to see its details.');

    // 不该出现详情骨架，也不该出现错误。
    expect(html).not.toContain('Could not load this medicine');
  });

  it('两栏并排，且窄屏用 hidden 做单栏推入/弹出', () => {
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='drugbank'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    // HIG：宽屏两栏（lg:grid-cols-[...]），窄屏退化成单栏。
    expect(html).toContain('lg:grid-cols-');
    // 未选中时右栏在窄屏隐藏，选中时左栏隐藏——对应 push/pop。
    expect(html).toContain('hidden lg:block');
  });

  it('提示文案不提实现细节（URL / 缓存 / 刷新）', () => {
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='drugbank'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    // Apple HIG：提示只讲下一步动作，不讲实现。
    expect(html).not.toMatch(/URL/i);
    expect(html).not.toMatch(/cache/i);
    expect(html).not.toMatch(/refresh/i);
    expect(html).not.toMatch(/localStorage/i);
  });

  it('右栏提示没有图标，也没有边框与底衬', () => {
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='drugbank'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    // 图标曾与侧边栏「单药分析」的 pill 重复——同一个语境里同一个图标
    // 等于把同一句话说两遍，视觉上还像重复入口。
    expect(html).not.toContain('data-slot="empty-icon"');
    expect(html).not.toContain('data-slot="empty"');

    // 空状态不是卡片。搜索框与源切换本身有边框，所以只截取空状态那一段来断言，
    // 否则会把它们的边框一起误判（第一版就是这么写错的）。
    const emptyBlock = html.slice(html.indexOf('Select a medicine'));
    expect(emptyBlock).not.toMatch(/\bborder\b/);
    expect(emptyBlock).not.toContain('bg-muted');
    expect(emptyBlock).not.toContain('<svg');
  });

  it('两个知识源都可切换，且当前源被标记为选中', () => {
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='cn'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    expect(html).toContain('DrugBank');
    expect(html).toContain('Chinese leaflets');
    // aria-pressed 表达当前源，屏幕阅读器据此播报。
    expect(html).toContain('aria-pressed="true"');
  });

  it('未选中时详情查询被禁用，不发请求', () => {
    // selection 为 null 时 `enabled: false`，所以服务端渲染不会尝试取详情；
    // 若这条失效，SSR 会去打后端并在渲染期抛错。
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='drugbank'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    expect(html).not.toContain('Could not load this medicine');
    expect(html).toContain('Select a medicine');
  });

  it('渲染结果里不残留 i18n 键', () => {
    const html = render(
      <DrugAnalysisPage
        selection={null}
        source='drugbank'
        page={1}
        onSelect={noop}
        onSourceChange={noop}
        onPageChange={noop}
      />
    );

    // 命名空间分隔符写错时 i18next 会把键原样返回，这是最安静的失败形态。
    expect(html).not.toMatch(/analysis[:.]/);
    expect(html).not.toMatch(/nav[:.]/);
  });
});
