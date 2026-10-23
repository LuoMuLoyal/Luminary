import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./service', () => ({
  refresh: vi.fn()
}));

import { refresh as requestRefresh } from './service';
import { refreshSession } from './session-refresh';

const mockedRefresh = vi.mocked(requestRefresh);

const RESPONSE = {
  user: {
    id: 'u1',
    email: 'a@b.c',
    nickname: null,
    avatar: null,
    emailVerified: true,
    emailVerifiedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  expiresIn: 900
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('refreshSession', () => {
  it('并发调用只发一次轮换请求', async () => {
    // 这是整个单飞的意义：Lucent 的轮换是一次性的，第二次必然失败并导致登出。
    mockedRefresh.mockResolvedValue(RESPONSE);

    const results = await Promise.all([refreshSession(), refreshSession(), refreshSession()]);

    expect(mockedRefresh).toHaveBeenCalledTimes(1);
    expect(results).toHaveLength(3);
    expect(new Set(results.map((r) => r.expiresIn))).toEqual(new Set([900]));
  });

  it('落定之后再调会真的重新请求', async () => {
    mockedRefresh.mockResolvedValue(RESPONSE);

    await refreshSession();
    await refreshSession();

    expect(mockedRefresh).toHaveBeenCalledTimes(2);
  });

  it('并发失败也只发一次请求，所有调用方都收到失败', async () => {
    let reject!: (reason: unknown) => void;
    mockedRefresh.mockReturnValue(
      new Promise((_resolve, rej) => {
        reject = rej;
      })
    );

    const a = refreshSession();
    const b = refreshSession();
    reject(new Error('no session'));

    await expect(a).rejects.toThrow('no session');
    await expect(b).rejects.toThrow('no session');
    expect(mockedRefresh).toHaveBeenCalledTimes(1);
  });
});
