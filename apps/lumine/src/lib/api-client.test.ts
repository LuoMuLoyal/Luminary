import { afterEach, describe, expect, it, vi } from 'vitest';

import { NetworkError, request } from './api-client';
import { ApiError } from './problem-details';

interface FetchCall {
  url: string;
  init: RequestInit;
}

function mockFetch(response: Response): FetchCall[] {
  const calls: FetchCall[] = [];
  vi.stubGlobal('fetch', (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return Promise.resolve(response);
  });
  return calls;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/problem+json' }
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request', () => {
  it('默认头与调用方头合并，而不是整体替换', async () => {
    const calls = mockFetch(jsonResponse(200, { ok: true }));

    await request('/probe', {
      method: 'POST',
      body: { a: 1 },
      headers: { 'X-Trace-Id': 'trace-1' }
    });

    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers).toMatchObject({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Trace-Id': 'trace-1'
    });
  });

  it('调用方可以覆盖默认头', async () => {
    const calls = mockFetch(jsonResponse(200, {}));

    await request('/probe', { headers: { Accept: 'text/plain' } });

    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.Accept).toBe('text/plain');
  });

  it('无 body 时不设置 Content-Type', async () => {
    const calls = mockFetch(jsonResponse(200, {}));

    await request('/probe');

    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBeUndefined();
    expect(calls[0].init.body).toBeUndefined();
  });

  it('路径拼到 /api/v1 之下，并且默认带 cookie', async () => {
    const calls = mockFetch(jsonResponse(200, {}));

    await request('/auth/session');

    expect(calls[0].url).toMatch(/\/api\/v1\/auth\/session$/);
    expect(calls[0].init.credentials).toBe('include');
  });

  it('可以显式关闭 cookie', async () => {
    const calls = mockFetch(jsonResponse(200, {}));

    await request('/health', { credentials: 'omit' });

    expect(calls[0].init.credentials).toBe('omit');
  });

  it('4xx 抛 ApiError 并保留稳定错误码', async () => {
    mockFetch(
      jsonResponse(401, { status: 401, code: 'AUTH_WRONG_PASSWORD', title: 'Unauthorized' })
    );

    await expect(request('/auth/login', { method: 'POST', body: {} })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      code: 'AUTH_WRONG_PASSWORD'
    });
  });

  it('5xx 的 HTML 错误页也能归一成 ApiError', async () => {
    mockFetch(
      new Response('<html>502</html>', { status: 502, headers: { 'content-type': 'text/html' } })
    );

    const error = await request('/auth/login').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(502);
    expect((error as ApiError).code).toBeNull();
  });

  it('204 返回 null 而不是解析失败', async () => {
    mockFetch(new Response(null, { status: 204 }));

    await expect(request('/auth/session')).resolves.toBeNull();
  });

  it('fetch 抛错时包成 NetworkError，不吞掉原始原因', async () => {
    const cause = new TypeError('Failed to fetch');
    vi.stubGlobal('fetch', () => Promise.reject(cause));

    const error = await request('/auth/login').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(NetworkError);
    expect((error as NetworkError).cause).toBe(cause);
  });
});
