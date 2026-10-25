import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/lib/form';
import { register as registerAccount, sendVerificationCode } from '@/features/auth/api/service';
import { authErrorKey, captchaErrorKind } from '@/features/auth/api/errors';
import { useSessionStore } from '@/features/auth/session';
import { CaptchaField, useCaptchaConfig } from './captcha-field';

/**
 * 注册表单。
 *
 * ## 三步而不是一个表单
 *
 * Lucent 的注册**必须带邮箱验证码**，而验证码要先经
 * `POST /auth/send-verification-code`（`scene: 'register'`）发出去。
 * 所以是：填邮箱 → 发码并倒计时 → 填验证码与密码 → 提交。
 *
 * ## 冷却时间来自服务端
 *
 * 响应里带 `cooldown`（秒）。**不要在客户端写死 60**——服务端改配置时写死值会
 * 造成「按钮亮了但服务端还没放行」的 429。
 *
 * ## 文案全部走 i18n
 *
 * 校验消息是 key（schema 在模块加载时构造，取不到当前语言），
 * 由 `FieldError` 渲染时翻译。**这里不写任何人类可读文案。**
 */

const emailSchema = z.email('auth.validation.emailInvalid');
const codeSchema = z.string().min(1, 'auth.validation.codeRequired');
const passwordSchema = z.string().min(8, 'auth.validation.passwordTooShort');
const nicknameSchema = z.string();

const registerSchema = z.object({
  email: emailSchema,
  code: codeSchema,
  password: passwordSchema,
  nickname: nicknameSchema
});

interface RegisterFormProps {
  /** 注册成功后的回跳路径；缺省去 `/dashboard`。 */
  redirectTo?: string;
}

export default function RegisterForm({ redirectTo }: RegisterFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [sendErrorKey, setSendErrorKey] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  /**
   * 注册**每次都要**人机验证（Lucent 的 
egister 无条件 verify），
   * 所以只要部署启用了 Turnstile 就直接渲染 widget，不等报错。
   */
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const { enabled: captchaEnabled } = useCaptchaConfig();
  const captchaPending = captchaEnabled && captchaToken === null;

  // 倒计时每秒递减。用 effect 而不是递归定时器：组件卸载后定时器必须清掉，
  // 否则会对着已卸载的组件 setState。
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useAppForm({
    defaultValues: {
      email: '',
      code: '',
      password: '',
      nickname: ''
    },
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      setErrorKey(null);

      try {
        const { user } = await registerAccount({
          email: value.email,
          code: value.code,
          password: value.password,
          ...(value.nickname.trim().length > 0 && {
            nickname: value.nickname.trim()
          }),
          ...(captchaToken !== null && { captchaToken })
        });

        // 注册即登录（服务端已下发 cookie），同步本地会话态。
        useSessionStore.setState({ status: 'authenticated', user });

        toast.success(t('auth.message.signedUp', { name: user.nickname ?? user.email }));
        void navigate({ to: redirectTo ?? '/dashboard', replace: true });
      } catch (error) {
        if (captchaErrorKind(error) !== null) {
          // token 用掉或过期：重置重取，widget 会自己刷新。
          setCaptchaResetSignal((n) => n + 1);
        }
        setErrorKey(authErrorKey(error));
      }
    }
  });

  /** 发验证码并启动倒计时。冷却期间按钮禁用，避免拿 429 当反馈。 */
  async function handleSendCode() {
    const email = form.getFieldValue('email');
    const emailResult = emailSchema.safeParse(email);

    if (!emailResult.success) {
      setSendErrorKey('auth.validation.emailInvalid');
      return;
    }

    setSendErrorKey(null);
    setSending(true);

    try {
      const { cooldown: seconds } = await sendVerificationCode({
        email: emailResult.data,
        scene: 'register'
      });
      setCooldown(seconds);
      toast.success(t('auth.message.codeSent'));
    } catch (error) {
      setSendErrorKey(authErrorKey(error));
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      className='w-full space-y-4'
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField
          name='email'
          children={(field) => (
            <field.TextField
              label={t('auth.field.email')}
              type='email'
              autoComplete='email'
              placeholder={t('auth.field.emailPlaceholder')}
            />
          )}
        />

        {/* 验证码与「发送」按钮放在一起：两者是同一个动作的两半，
            分开两处会让用户以为按钮只管下半部分。 */}
        <form.AppField
          name='code'
          children={(field) => (
            <div className='space-y-2'>
              <field.TextField
                label={t('auth.field.code')}
                inputMode='numeric'
                autoComplete='one-time-code'
                placeholder={t('auth.field.codePlaceholder')}
              />
              <Button
                type='button'
                variant='outline'
                className='w-full'
                disabled={cooldown > 0 || sending}
                onClick={() => void handleSendCode()}
              >
                {cooldown > 0
                  ? t('auth.action.resendIn', { seconds: cooldown })
                  : sending
                    ? t('auth.action.sending')
                    : t('auth.action.sendCode')}
              </Button>
              {sendErrorKey !== null && (
                <p role='alert' className='text-destructive text-sm'>
                  {t(sendErrorKey)}
                </p>
              )}
            </div>
          )}
        />

        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField
              label={t('auth.field.password')}
              type='password'
              autoComplete='new-password'
              placeholder={t('auth.field.passwordHint')}
            />
          )}
        />

        <form.AppField
          name='nickname'
          children={(field) => (
            <field.TextField
              label={t('auth.field.nickname')}
              autoComplete='nickname'
              placeholder={t('auth.field.nicknamePlaceholder')}
            />
          )}
        />
      </FieldGroup>

      {errorKey !== null && (
        <p role='alert' className='text-destructive text-sm'>
          {t(errorKey)}
        </p>
      )}

      <CaptchaField onTokenChange={setCaptchaToken} resetSignal={captchaResetSignal} />
      {captchaPending && (
        <p className='text-muted-foreground text-sm'>{t('auth.captcha.required')}</p>
      )}

      <form.AppForm>
        <form.SubmitButton className='w-full' disabled={captchaPending}>
          {t('auth.action.signUp')}
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
