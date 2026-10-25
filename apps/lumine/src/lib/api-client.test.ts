import { describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/problem-details';
import { createLucentClient, expectData, NetworkError } from './api-client';

/**
 * 覆盖类型化客户端的三件关键行为：
 *
 * 1. 非 2xx 一律变成带稳定 `code` 的 `ApiError`（认证分支靠它区分
 *    「需要人机验证」「验证码过期」「凭据错」）；
 * 2. 非 JSON 响应体（网关 HTML 错误页）不会让解析炸掉；
 * 3. 请求带 cookie——会话完全依赖它。
 *
 * 路径与载荷类型由生成的 OpenAPI 契约约束，所以这里不测「URL 拼得对不对」：
 * 拼错是编译错误，不是运行时错误。
 *
 * 用 `createLucentClient({ fetch })` 注入假 fetch：`openapi-fetch` 在创建时
 * 捕获 `fetch`，事后 stub 全局不会生效。
 */

function problemResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/problem+json' }
  });
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

/** 固定返回一个响应的客户端。 */
function clientReturning(response: Response) {
  return createLucentClient({ fetch: () => Promise.resolve(response) });
}

describe('problem details 中间件', () => {
  it('401 转成带稳定 code 的 ApiError', async () => {
    const client = clientReturning(
      problemResponse(401, {
        status: 401,
        code: 'AUTH_WRONG_PASSWORD',
        title: 'Unauthorized'
      })
    );

    const error = await client
      .POST('/api/v1/auth/browser/login', { body: { email: 'a@b.c' } })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect((error as ApiError).code).toBe('AUTH_WRONG_PASSWORD');
  });

  it('403 的人机验证码也能取到', async () => {
    const client = clientReturning(
      problemResponse(403, { status: 403, code: 'AUTH_CAPTCHA_REQUIRED' })
    );

    const error = await client
      .POST('/api/v1/auth/browser/login', { body: { email: 'a@b.c' } })
      .catch((e: unknown) => e);

    expect((error as ApiError).code).toBe('AUTH_CAPTCHA_REQUIRED');
  });

  it('HTML 网关错误页不会让解析炸掉', async () => {
    const client = clientReturning(
      new Response('<html>502</html>', {
        status: 502,
        headers: { 'content-type': 'text/html' }
      })
    );

    const error = await client.GET('/api/v1/account').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(502);
    expect((error as ApiError).code).toBeNull();
  });

  it('2xx 原样放行', async () => {
    const client = clientReturning(jsonResponse(200, { user: { id: 'u1' }, expiresIn: 900 }));

    const result = await client.POST('/api/v1/auth/browser/login', {
      body: { email: 'a@b.c' }
    });

    expect(result.error).toBeUndefined();
    expect(result.data?.expiresIn).toBe(900);
  });
});

describe('expectData', () => {
  const okResponse = new Response(null, { status: 200 });

  it('成功时直接返回 data', async () => {
    await expect(expectData({ data: { id: 'u1' }, response: okResponse })).resolves.toEqual({
      id: 'u1'
    });
  });

  it('error 存在时抛 ApiError（兜住中间件未命中的情况）', async () => {
    const response = new Response(null, { status: 500 });

    await expect(
      expectData({ error: { code: 'INTERNAL_ERROR' }, response })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('既无 data 也无 error 时抛 NetworkError，而不是返回 undefined', async () => {
    await expect(
      expectData({ response: new Response(null, { status: 204 }) })
    ).rejects.toBeInstanceOf(NetworkError);
  });
});

describe('客户端配置', () => {
  it('带 cookie 发请求（会话完全依赖它）', async () => {
    // `openapi-fetch` 把 baseOptions 编进 Request 对象，而不是 fetch 的第二个参数，
    // 所以要断言 Request.credentials。
    const requests: Request[] = [];
    const client = createLucentClient({
      fetch: (input: RequestInfo | URL) => {
        if (input instanceof Request) requests.push(input);
        return Promise.resolve(jsonResponse(200, { id: 'u1' }));
      }
    });

    await client.GET('/api/v1/account');

    expect(requests[0]?.credentials).toBe('include');
  });
});
