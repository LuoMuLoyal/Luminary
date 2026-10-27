import { describe, expect, it } from 'vitest';

import type { ProblemDetails } from '@/lib/problem-details';
import { resolveDetailState } from './detail-state';

const selection = { id: 'DB00176', source: 'drugbank' as const };

const problem: ProblemDetails = {
  status: 404,
  code: 'MEDICINE_NOT_FOUND',
  title: 'Not Found',
  detail: null,
  type: null,
  instance: null
};

/**
 * 这一组测试锁住的是**「字段缺失」与「请求失败」不可混淆**这条不变量。
 *
 * 把失败渲染成空页面，用户会把「我们没查到」读成「这个药没有数据」——
 * 在药品数据上这是误导。所以下面每个用例都在验证这两种情况走不同的状态。
 */
describe('详情状态机', () => {
  it('未选中时是 empty，与"加载中"不同', () => {
    expect(
      resolveDetailState({
        selection: null,
        detail: undefined,
        problem: null,
        isPending: false
      })
    ).toEqual({ status: 'empty' });
  });

  it('未选中时即使查询在途也不是 loading', () => {
    // 没有选中就没有请求；若此处返回 loading，界面会为一个不存在的目标转圈。
    expect(
      resolveDetailState({
        selection: null,
        detail: undefined,
        problem: null,
        isPending: true
      }).status
    ).toBe('empty');
  });

  it('在途且无数据是 loading，并带上它所属的选择', () => {
    const state = resolveDetailState({
      selection,
      detail: undefined,
      problem: null,
      isPending: true
    });

    expect(state.status).toBe('loading');
    // 携带 selection 让「把 A 的响应渲染到 B 的界面」在类型层面不可能。
    expect(state).toHaveProperty('selection', selection);
  });

  it('有数据是 ready，并携带 selection 与载荷', () => {
    const detail = { name: 'Fluvoxamine' };

    expect(resolveDetailState({ selection, detail, problem: null, isPending: false })).toEqual({
      status: 'ready',
      selection,
      detail
    });
  });

  it('失败是 error，不是 ready 也不是 empty', () => {
    const state = resolveDetailState({
      selection,
      detail: undefined,
      problem,
      isPending: false
    });

    expect(state.status).toBe('error');
    expect(state).toHaveProperty('problem', problem);
  });

  it('失败优先于缓存：有旧数据 + 新请求失败时仍报错', () => {
    // React Query 在重新获取失败时会保留上一次的成功数据。若让数据优先，
    // 界面会把「查不到」伪装成「查到了旧值」。
    const state = resolveDetailState({
      selection,
      detail: { name: 'stale' },
      problem,
      isPending: false
    });

    expect(state.status).toBe('error');
  });

  it('失败优先于在途：正在重试时仍显示错误', () => {
    expect(
      resolveDetailState({ selection, detail: undefined, problem, isPending: true }).status
    ).toBe('error');
  });

  it('既无数据也无错误且不在途时退回 empty，不假装 ready', () => {
    // 查询被禁用（例如选择为空但状态未同步）时会走到这里。
    // 编造一个 ready 会让界面渲染 undefined 字段。
    expect(
      resolveDetailState({ selection, detail: undefined, problem: null, isPending: false }).status
    ).toBe('empty');
  });
});
