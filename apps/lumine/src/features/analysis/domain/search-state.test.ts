import { describe, expect, it } from 'vitest';

import type { ProblemDetails } from '@/lib/problem-details';
import { MIN_QUERY_LENGTH, resolveSearchState } from './search-state';

const problem: ProblemDetails = {
  status: 500,
  code: 'INTERNAL',
  title: 'Internal Server Error',
  detail: null,
  type: null,
  instance: null
};

const items = [{ id: 'DB00176' }, { id: 'DB00201' }];

describe('搜索状态机', () => {
  it('关键词太短时不发请求（idle），即使查询在途', () => {
    for (const query of ['', 'a', '  ']) {
      expect(
        resolveSearchState({
          query,
          items: undefined,
          pagination: undefined,
          problem: null,
          isPending: true
        }).status
      ).toBe('idle');
    }
  });

  it('恰好达到最小长度时进入查询', () => {
    expect('ab'.length).toBe(MIN_QUERY_LENGTH);

    expect(
      resolveSearchState({
        query: 'ab',
        items: undefined,
        pagination: undefined,
        problem: null,
        isPending: true
      }).status
    ).toBe('loading');
  });

  it('零结果是 empty，不是 idle', () => {
    // 合并这两者会让首次进入页面就显示「没有匹配」——对着空搜索框说没有匹配是错的。
    const state = resolveSearchState({
      query: 'zzzz',
      items: [],
      pagination: { page: 1, total: 0, totalPages: 0 },
      problem: null,
      isPending: false
    });

    expect(state.status).toBe('empty');
    expect(state.status).not.toBe('idle');
  });

  it('有结果是 results，并带上后端的分页信息', () => {
    const pagination = { page: 2, total: 42, totalPages: 3 };

    const state = resolveSearchState({
      query: 'flu',
      items,
      pagination,
      problem: null,
      isPending: false
    });

    expect(state).toEqual({ status: 'results', items, pagination });
  });

  it('缺少分页信息时退化成单页，不显示 undefined', () => {
    const state = resolveSearchState({
      query: 'flu',
      items,
      pagination: undefined,
      problem: null,
      isPending: false
    });

    expect(state).toHaveProperty('pagination', {
      page: 1,
      total: items.length,
      totalPages: 1
    });
  });

  it('搜索失败是 error，不是 empty', () => {
    // 把失败显示成「未找到药品」会让用户以为是自己拼错了。
    const state = resolveSearchState({
      query: 'flu',
      items: undefined,
      pagination: undefined,
      problem,
      isPending: false
    });

    expect(state.status).toBe('error');
    expect(state).not.toHaveProperty('items');
  });

  it('失败优先于已有结果', () => {
    expect(
      resolveSearchState({
        query: 'flu',
        items,
        pagination: { page: 1, total: 2, totalPages: 1 },
        problem,
        isPending: false
      }).status
    ).toBe('error');
  });
});
