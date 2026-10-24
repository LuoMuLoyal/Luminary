import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, parseProblemDetails } from '@/lib/problem-details';
import { NetworkError } from '@/lib/api-client';

vi.mock('@/features/auth/api/session-refresh', () => ({
  refreshSession: vi.fn()
}));

vi.mock('@/features/auth/api/service', () => ({
  getAccount: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn()
}));

import * as authApi from '@/features/auth/api/service';
import { refreshSession } from '@/features/auth/api/session-refresh';
import { useSessionStore } from './session';

const mocked = vi.mocked(authApi);
const mockedRefresh = vi.mocked(refreshSession);

const USER = {
  id: 'u1',
  email: 'a@b.c',
  nickname: '测试',
  avatar: null,
  emailVerified: true,
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

/** GET /account 的响应形状：比会话用户多 hasPassword / lastLoginAt / linkedIdentities。 */
const ACCOUNT = {
  id: 'u1',
  email: 'a@b.c',
  nickname: '测试',
  avatar: null,
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  hasPassword: true,
  lastLoginAt: null,
  linkedIdentities: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

function apiError(status: number, code: string): ApiError {
  return new ApiError(parseProblemDetails(status, { code }));
}

beforeEach(() => {
  vi.resetAllMocks();
  useSessionStore.setState({ status: 'unknown', user: null });
});

describe('会话状态', () => {
  it('初始状态是 unknown，而不是 anonymous', () => {
    // 三态的意义：unknown 表示「还没问过服务端」，把它当 false 会让刷新时闪登录页。
    expect(useSessionStore.getState().status).toBe('unknown');
    expect(useSessionStore.getState().user).toBeNull();
  });

  it('bootstrap 成功 → authenticated', async () => {
    mocked.getAccount.mockResolvedValue(ACCOUNT);

    await useSessionStore.getState().bootstrap();

    expect(useSessionStore.getState().status).toBe('authenticated');
    expect(useSessionStore.getState().user?.id).toBe('u1');
  });

  it('bootstrap 遇到 401 时先静默续期，续期成功仍在登录态', async () => {
    // access token 过期 ≠ 会话结束：refresh cookie 还活着就该自动续上，
    // 而不是把用户踢去登录页。
    mocked.getAccount.mockRejectedValueOnce(apiError(401, 'AUTH_TOKEN_EXPIRED'));
    mockedRefresh.mockResolvedValue({ user: USER, expiresIn: 900 });

    await useSessionStore.getState().bootstrap();

    expect(mockedRefresh).toHaveBeenCalledTimes(1);
    expect(useSessionStore.getState().status).toBe('authenticated');
    // 续期已带回用户，不必再打一次 /account。
    expect(mocked.getAccount).toHaveBeenCalledTimes(1);
  });

  it('bootstrap 续期失败 → anonymous，不抛错', async () => {
    mocked.getAccount.mockRejectedValue(apiError(401, 'AUTH_TOKEN_EXPIRED'));
    mockedRefresh.mockRejectedValue(apiError(401, 'AUTH_REFRESH_TOKEN_INVALID'));

    await expect(useSessionStore.getState().bootstrap()).resolves.toBeUndefined();
    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('bootstrap 遇到非会话失效错误不触发续期', async () => {
    mocked.getAccount.mockRejectedValue(apiError(503, 'DEPENDENCY_UNAVAILABLE'));

    await useSessionStore.getState().bootstrap();

    expect(mockedRefresh).not.toHaveBeenCalled();
    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('refresh 成功写入用户与登录态', async () => {
    mockedRefresh.mockResolvedValue({ user: USER, expiresIn: 900 });

    const user = await useSessionStore.getState().refresh();

    expect(user.id).toBe('u1');
    expect(useSessionStore.getState().status).toBe('authenticated');
  });

  it('bootstrap 遇到网络错误也回到 anonymous，而不是卡在 unknown', async () => {
    mocked.getAccount.mockRejectedValue(new NetworkError('offline', null));

    await useSessionStore.getState().bootstrap();

    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('login 成功写入用户', async () => {
    mocked.login.mockResolvedValue({ user: USER, expiresIn: 900 });

    const user = await useSessionStore.getState().login({
      email: 'a@b.c',
      password: 'x'
    });

    expect(user.id).toBe('u1');
    expect(useSessionStore.getState().status).toBe('authenticated');
  });

  it('login 失败不改变登录态，也不吞掉错误', async () => {
    mocked.login.mockRejectedValue(apiError(401, 'AUTH_WRONG_PASSWORD'));

    await expect(
      useSessionStore.getState().login({ email: 'a@b.c', password: 'bad' })
    ).rejects.toBeInstanceOf(ApiError);

    expect(useSessionStore.getState().status).toBe('unknown');
  });

  it('register 成功即登录，无需再调 login', async () => {
    mocked.register.mockResolvedValue({ user: USER, expiresIn: 900 });

    await useSessionStore.getState().register({
      email: 'a@b.c',
      password: 'x',
      code: '123456'
    });

    expect(mocked.login).not.toHaveBeenCalled();
    expect(useSessionStore.getState().status).toBe('authenticated');
  });

  it('logout 即使服务端失败也要清空本地登录态', async () => {
    useSessionStore.setState({ status: 'authenticated', user: USER });
    mocked.logout.mockRejectedValue(new NetworkError('offline', null));

    await expect(useSessionStore.getState().logout()).rejects.toBeInstanceOf(NetworkError);
    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(useSessionStore.getState().user).toBeNull();
  });

  it('会话失效的 401 触发清理', () => {
    useSessionStore.setState({ status: 'authenticated', user: USER });

    useSessionStore.getState().handleRequestFailure(apiError(401, 'AUTH_TOKEN_EXPIRED'));

    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('登录表单的 401 不清登录态', () => {
    useSessionStore.setState({ status: 'authenticated', user: USER });

    useSessionStore.getState().handleRequestFailure(apiError(401, 'AUTH_WRONG_PASSWORD'));

    expect(useSessionStore.getState().status).toBe('authenticated');
  });
});
