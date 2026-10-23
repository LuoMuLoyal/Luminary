import { describe, expect, it } from 'vitest';

import { ApiError, parseProblemDetails } from '@/lib/problem-details';
import { NetworkError } from '@/lib/api-client';
import { authErrorKey, captchaErrorKind, isSessionExpired } from './errors';

function apiError(status: number, code: string | null): ApiError {
  return new ApiError(parseProblemDetails(status, code === null ? {} : { code }));
}

describe('authErrorKey', () => {
  it('凭据失败映射到同一句文案（不暗示账号是否存在）', () => {
    expect(authErrorKey(apiError(401, 'AUTH_WRONG_PASSWORD'))).toBe('error.wrongCredentials');
  });

  it('人机验证相关错误可区分', () => {
    expect(authErrorKey(apiError(403, 'AUTH_CAPTCHA_REQUIRED'))).toBe('error.captchaRequired');
    expect(authErrorKey(apiError(403, 'AUTH_CAPTCHA_INVALID'))).toBe('error.captchaInvalid');
  });

  it('验证码过期与不匹配分开说', () => {
    expect(authErrorKey(apiError(400, 'AUTH_VERIFICATION_CODE_EXPIRED'))).toBe('error.codeExpired');
    expect(authErrorKey(apiError(400, 'AUTH_VERIFICATION_CODE_MISMATCH'))).toBe(
      'error.codeMismatch'
    );
  });

  it('未登记的 code 回落成服务端 detail', () => {
    const error = new ApiError(
      parseProblemDetails(409, {
        code: 'SOMETHING_NEW',
        detail: 'server supplied detail'
      })
    );

    expect(authErrorKey(error)).toBe('server supplied detail');
  });

  it('既无 code 也无 detail 时用通用 key', () => {
    expect(authErrorKey(apiError(503, null))).toBe('error.unknown');
  });

  it('网络失败有独立 key，而不是「密码错」', () => {
    expect(authErrorKey(new NetworkError('boom', new Error('x')))).toBe('error.network');
  });

  it('未知异常回落到通用 key', () => {
    expect(authErrorKey('weird')).toBe('error.unknown');
    expect(authErrorKey(undefined)).toBe('error.unknown');
  });
});

describe('captchaErrorKind', () => {
  it('区分「需要验证」与「验证被拒」', () => {
    expect(captchaErrorKind(apiError(403, 'AUTH_CAPTCHA_REQUIRED'))).toBe('required');
    expect(captchaErrorKind(apiError(403, 'AUTH_CAPTCHA_INVALID'))).toBe('invalid');
  });

  it('其它失败一律 null', () => {
    expect(captchaErrorKind(apiError(401, 'AUTH_WRONG_PASSWORD'))).toBeNull();
    expect(captchaErrorKind(new Error('x'))).toBeNull();
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
