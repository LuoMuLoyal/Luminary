import { describe, expect, it } from 'vitest';

import { parseProblemDetails } from './problem-details';

const RFC_TYPE = 'https://lucent.devluo.com/problems/auth/wrong-password';

describe('parseProblemDetails', () => {
  it('按 RFC 9457 字段解析', () => {
    const problem = parseProblemDetails(401, {
      type: RFC_TYPE,
      title: 'Unauthorized',
      status: 401,
      detail: '凭据无效',
      instance: '/api/v1/auth/login',
      code: 'AUTH_WRONG_PASSWORD'
    });

    expect(problem).toEqual({
      status: 401,
      code: 'AUTH_WRONG_PASSWORD',
      title: 'Unauthorized',
      detail: '凭据无效',
      type: RFC_TYPE,
      instance: '/api/v1/auth/login'
    });
  });

  it('响应体不是 Problem Details 时回落为 status 推导的文案', () => {
    const problem = parseProblemDetails(502, '<html>Bad Gateway</html>');

    expect(problem.status).toBe(502);
    expect(problem.code).toBeNull();
    expect(problem.title).toBe('Internal Server Error');
  });

  it('缺少 title 时用 status 兜底，不返回 undefined', () => {
    const problem = parseProblemDetails(404, { code: 'RESOURCE_NOT_FOUND' });

    expect(problem.title).toBe('Not Found');
    expect(problem.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('忽略非字符串字段，避免把脏数据透给 UI', () => {
    const problem = parseProblemDetails(400, {
      title: 42,
      detail: { nested: true },
      code: ['AUTH_WRONG_PASSWORD']
    });

    expect(problem.title).toBe('Bad Request');
    expect(problem.detail).toBeNull();
    expect(problem.code).toBeNull();
  });

  it('null / 数组 / 字符串响应体都不抛', () => {
    for (const body of [null, undefined, [], 'boom']) {
      expect(() => parseProblemDetails(500, body)).not.toThrow();
    }
  });

  it('5xx 与未知状态码归到 Internal Server Error', () => {
    expect(parseProblemDetails(503, {}).title).toBe('Internal Server Error');
    expect(parseProblemDetails(599, {}).title).toBe('Internal Server Error');
    expect(parseProblemDetails(418, {}).title).toBe('Request Failed');
  });

  it('4xx 常见状态码映射', () => {
    expect(parseProblemDetails(400, {}).title).toBe('Bad Request');
    expect(parseProblemDetails(401, {}).title).toBe('Unauthorized');
    expect(parseProblemDetails(403, {}).title).toBe('Forbidden');
    expect(parseProblemDetails(404, {}).title).toBe('Not Found');
    expect(parseProblemDetails(409, {}).title).toBe('Conflict');
    expect(parseProblemDetails(422, {}).title).toBe('Unprocessable Entity');
    expect(parseProblemDetails(429, {}).title).toBe('Too Many Requests');
  });
});
