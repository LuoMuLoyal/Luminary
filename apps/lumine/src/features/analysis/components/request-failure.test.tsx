import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import i18n from '@/lib/i18n';
import type { ProblemDetails } from '@/lib/problem-details';
import { RequestFailure } from './request-failure';

function render(ui: React.ReactElement) {
  return renderToStaticMarkup(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

function problem(overrides: Partial<ProblemDetails> = {}): ProblemDetails {
  return {
    status: 0,
    code: 'NETWORK_ERROR',
    title: 'Network Error',
    detail: 'Failed to fetch',
    type: null,
    instance: null,
    ...overrides
  };
}

/**
 * 这一组测试锁住一个具体的线上观感问题：界面上曾显示
 * `Could not searchFailed to fetch`。
 *
 * 两个毛病：
 * 1. **两段文案没有分隔**，直接粘成一个词；
 * 2. **`Failed to fetch` 是浏览器给的英文原始信息**，面向开发者，不该给用户看。
 *
 * 所以这里同时验证「不泄露原始错误」与「文案本地化」。
 */
describe('请求失败展示', () => {
  it('网络失败显示本地化文案，不泄露浏览器原始错误', () => {
    const html = render(<RequestFailure problem={problem()} />);

    expect(html).toContain('Cannot reach the server');
    expect(html).toContain('Check your connection and try again.');

    // 浏览器原文与内部错误码都不该出现在用户界面上。
    expect(html).not.toContain('Failed to fetch');
    expect(html).not.toContain('NETWORK_ERROR');
  });

  it('服务端拒绝时显示服务端的 detail 与稳定错误码', () => {
    const html = render(
      <RequestFailure
        problem={problem({
          status: 404,
          code: 'MEDICINE_NOT_FOUND',
          title: 'Not Found',
          detail: 'Medicine not found'
        })}
      />
    );

    expect(html).toContain('Could not load this medicine');
    expect(html).toContain('Medicine not found');
    expect(html).toContain('MEDICINE_NOT_FOUND');
  });

  it('两种失败用不同标题，因为下一步动作不同', () => {
    const network = render(<RequestFailure problem={problem()} />);
    const rejected = render(<RequestFailure problem={problem({ status: 500, code: 'X' })} />);

    expect(network).toContain('Cannot reach the server');
    expect(rejected).toContain('Could not load this medicine');
  });

  it('提供重试按钮，文案是 Try Again', () => {
    const html = render(<RequestFailure problem={problem()} onRetry={() => undefined} />);

    expect(html).toContain('Try Again');
  });

  it('不提供 onRetry 时不渲染按钮', () => {
    const html = render(<RequestFailure problem={problem()} />);

    expect(html).not.toContain('Try Again');
  });

  it('中文下同样是本地化文案', () => {
    const zh = i18n.getFixedT('zh-CN');
    const html = renderToStaticMarkup(
      <I18nextProvider i18n={i18n}>
        <RequestFailure problem={problem()} />
      </I18nextProvider>
    );

    // 断言中文键确实有译文（不是回落成英文或键本身）。
    expect(zh('analysis:state.networkTitle')).toBe('无法连接服务器');
    expect(html).toContain('Cannot reach the server');
  });
});
