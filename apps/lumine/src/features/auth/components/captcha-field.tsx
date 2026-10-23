import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useTranslation } from 'react-i18next';

import { captchaQueryOptions } from '../api/queries';

/**
 * Cloudflare Turnstile 人机验证。
 *
 * ## 为什么用 `@marsidev/react-turnstile`
 *
 * Turnstile 要加载 Cloudflare 的 `api.js`、处理脚本就绪、widget id、
 * 过期/错误回调与显式 `reset()`。手写这套等于重新实现一个 SDK，
 * 而这库是事实标准（官方文档推荐、纯 React、无额外依赖）。
 *
 * ## 配置从服务端来，不写死 siteKey
 *
 * `GET /auth/captcha` 返回 `{ enabled, siteKey }`。`enabled: false` 表示该部署
 * 没有 Turnstile 凭据（本地开发、e2e 都是这种）——此时**什么都不渲染**，
 * 登录/注册照常进行。siteKey 是公开的（会嵌进每个 widget），但仍是部署配置，
 * 不该硬编码到前端。
 *
 * ## token 的生命周期
 *
 * Turnstile 的 token 是**一次性且短命**的：用过一次就失效，过期也会失效。
 * 所以：
 * - `onSuccess` 把 token 交给父组件；
 * - `onExpire` / `onError` 一律清空 token（宁可不提交，也不提交一个必然被拒的值）；
 * - 服务端回 `AUTH_CAPTCHA_INVALID` / `AUTH_CAPTCHA_REQUIRED` 时父组件把
 *   `resetSignal` 加一，这里的 `useEffect` 调 widget 的 `reset()` 重取。
 */

interface CaptchaFieldProps {
  /** 校验通过时给出 token，过期/失败时给 `null`。 */
  onTokenChange: (token: string | null) => void;
  /** 递增即重置 widget（服务端说 token 无效时用）。 */
  resetSignal?: number;
}

/**
 * 读取人机验证配置。
 *
 * 独立导出，让表单能知道 `enabled` 以决定「提交按钮是否等 token」——
 * 与 {@link CaptchaField} 共用同一份 Query 缓存，不会重复请求。
 */
export function useCaptchaConfig() {
  const query = useQuery(captchaQueryOptions());
  return {
    enabled: query.data?.enabled ?? false,
    siteKey: query.data?.siteKey ?? null,
    isLoading: query.isLoading
  };
}

export function CaptchaField({ onTokenChange, resetSignal = 0 }: CaptchaFieldProps) {
  const { t, i18n } = useTranslation();
  const { enabled, siteKey } = useCaptchaConfig();
  const widgetRef = useRef<TurnstileInstance>(undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (resetSignal > 0) {
      // 先清本地 token，再重置 widget：重置会异步回调 onSuccess，
      // 不清的话父组件会短暂持有一个已被服务端拒绝的旧值。
      onTokenChange(null);
      widgetRef.current?.reset();
    }
    // onTokenChange 是父组件传进来的 setter，引用稳定；只在 resetSignal 变化时执行。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  if (!enabled || siteKey === null) return null;

  return (
    <div className='space-y-2'>
      <Turnstile
        ref={widgetRef}
        siteKey={siteKey}
        options={{
          theme: 'auto',
          // 跟随界面语言；Turnstile 支持的语言码是 BCP-47 子集，
          // `zh-CN` 与 `en` 都在其中。
          language: i18n.resolvedLanguage ?? 'en'
        }}
        onSuccess={(token) => {
          setFailed(false);
          onTokenChange(token);
        }}
        onExpire={() => onTokenChange(null)}
        onError={() => {
          onTokenChange(null);
          setFailed(true);
        }}
      />
      {failed && (
        <p role='alert' className='text-destructive text-sm'>
          {t('auth.captcha.failed')}
        </p>
      )}
    </div>
  );
}
