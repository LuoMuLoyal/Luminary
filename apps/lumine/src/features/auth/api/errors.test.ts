import { describe, expect, it } from 'vitest';

import { ApiError, parseProblemDetails } from '@/lib/problem-details';
import { NetworkError } from '@/lib/api-client';
import { describeAuthError, isSessionExpired } from './errors';

function apiError(status: number, code: string | null): ApiError {
  return new ApiError(parseProblemDetails(status, code === null ? {} : { code }));
}

describe('describeAuthError', () => {
  it('凭据失败给统一文案，不暗示账号是否存在', () => {
    const copy = describeAuthError(apiError(401, 'AUTH_WRONG_PASSWORD'));
    expect(copy).toBe('邮箱或密码、验证码不正确');
  });

  it('人机验证相关错误可区分', () => {
    expect(describeAuthError(apiError(403, 'AUTH_CAPTCHA_REQUIRED'))).toBe('请先完成人机验证');
    expect(describeAuthError(apiError(403, 'AUTH_CAPTCHA_INVALID'))).toBe('人机验证未通过，请重试');
  });

  it('验证码过期与不匹配分开说', () => {
    expect(describeAuthError(apiError(400, 'AUTH_VERIFICATION_CODE_EXPIRED'))).toBe(
      '验证码已过期，请重新获取'
    );
    expect(describeAuthError(apiError(400, 'AUTH_VERIFICATION_CODE_MISMATCH'))).toBe(
      '验证码不正确'
    );
  });

  it('未登记的 code 回落到服务端 detail', () => {
    const error = new ApiError(
      parseProblemDetails(409, { code: 'SOMETHING_NEW', detail: '服务端给的说明' })
    );
    expect(describeAuthError(error)).toBe('服务端给的说明');
  });

  it('既无 code 也无 detail 时用状态码标题', () => {
    expect(describeAuthError(apiError(503, null))).toBe('Internal Server Error');
  });

  it('网络失败明确说连不上，而不是「密码错」', () => {
    expect(describeAuthError(new NetworkError('boom', new Error('x')))).toBe(
      '无法连接服务器，请检查网络'
    );
  });

  it('未知异常不返回空串', () => {
    expect(describeAuthError('weird')).toBe('操作失败，请稍后重试');
    expect(describeAuthError(undefined).length).toBeGreaterThan(0);
  });
});

describe('isSessionExpired', () => {
  it('会话过期的 401 判为 true', () => {
    expect(isSessionExpired(apiError(401, 'AUTH_REQUIRED'))).toBe(true);
    expect(isSessionExpired(apiError(401, 'AUTH_TOKEN_EXPIRED'))).toBe(true);
    expect(isSessionExpired(apiError(401, 'AUTH_REFRESH_TOKEN_INVALID'))).toBe(true);
    expect(isSessionExpired(apiError(401, null))).toBe(true);
  });

  it('登录表单填错的 401 不算会话过期', () => {
    expect(isSessionExpired(apiError(401, 'AUTH_WRONG_PASSWORD'))).toBe(false);
  });

  it('人机验证失败不算会话过期', () => {
    expect(isSessionExpired(apiError(403, 'AUTH_CAPTCHA_REQUIRED'))).toBe(false);
    expect(isSessionExpired(apiError(403, 'AUTH_CAPTCHA_INVALID'))).toBe(false);
  });

  it('非 ApiError 一律 false', () => {
    expect(isSessionExpired(new Error('x'))).toBe(false);
    expect(isSessionExpired(new NetworkError('x', null))).toBe(false);
  });
});
