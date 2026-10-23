import { describe, expect, it, vi } from 'vitest';

import { singleFlight } from './single-flight';

/** 一个可手动落定的 Promise，用来断言「并发调用只跑一次」。 */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('singleFlight', () => {
  it('并发调用只执行一次 run，且共享同一个结果', async () => {
    const gate = deferred<string>();
    const run = vi.fn(() => gate.promise);
    const call = singleFlight(run);

    const first = call();
    const second = call();
    const third = call();

    // 同一引用：调用方看到的是同一个 Promise。
    expect(first).toBe(second);
    expect(second).toBe(third);
    expect(run).toHaveBeenCalledTimes(1);

    gate.resolve('token');
    await expect(Promise.all([first, second, third])).resolves.toEqual(['token', 'token', 'token']);
  });

  it('落定之后再次调用会真的重跑（不是缓存）', async () => {
    let n = 0;
    const call = singleFlight(() => Promise.resolve(++n));

    await expect(call()).resolves.toBe(1);
    await expect(call()).resolves.toBe(2);
  });

  it('失败不会被记住，重试能重跑', async () => {
    let attempt = 0;
    const call = singleFlight(() => {
      attempt += 1;
      return attempt === 1 ? Promise.reject(new Error('boom')) : Promise.resolve('ok');
    });

    await expect(call()).rejects.toThrow('boom');
    await expect(call()).resolves.toBe('ok');
    expect(attempt).toBe(2);
  });

  it('并发调用共享同一个失败', async () => {
    const gate = deferred<never>();
    const run = vi.fn(() => gate.promise);
    const call = singleFlight(run);

    const first = call();
    const second = call();

    gate.reject(new Error('network'));
    await expect(first).rejects.toThrow('network');
    await expect(second).rejects.toThrow('network');
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('先落定的调用清空后，新调用不会复用旧结果', async () => {
    let n = 0;
    const call = singleFlight(async () => {
      n += 1;
      return n;
    });

    const a = await call();
    const b = await call();

    expect(a).toBe(1);
    expect(b).toBe(2);
  });
});
