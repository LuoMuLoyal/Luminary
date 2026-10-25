import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAppForm } from '@/lib/form';
import { forgotPassword, resetPassword } from '@/features/auth/api/service';
import { authErrorKey } from '@/features/auth/api/errors';

/**
 * 忘记密码流程（发码 → 改密，就地展开）。
 *
 * ## 为什么要做这个入口
 *
 * 登录页原先写的是「忘记密码暂不支持，请联系管理员」。但 Lucent 早就有
 * `POST /auth/forgot-password`（发码）与 `POST /auth/reset-password`（改密），
 * 契约里都在，Flutter 端也在用。那句话既让用户做了无谓的人工求助，
 * 也是在界面上错误地描述了后端的能力。
 *
 * ## 就地展开而不是独立路由
 *
 * 重置成功后的动作是**重新登录**，用户本来就在登录页。跳出去再跳回来会把
 * 已经填好的邮箱丢掉。
 *
 * ## 冷却时间来自服务端
 *
 * `forgotPassword` 响应带 `cooldown`，**不写死 60**——写死会造成
 * 「按钮亮了但服务端还没放行」的 429。
 */

const emailSchema = z.email('auth.validation.emailInvalid');
const resetSchema = z.object({
  email: emailSchema,
  code: z.string().min(1, 'auth.validation.codeRequired'),
  password: z.string().min(8, 'auth.validation.passwordTooShort')
});

interface ForgotPasswordFormProps {
  /** 重置成功或用户取消时回调，由父组件回到密码登录。 */
  onDone: () => void;
}

export function ForgotPasswordForm({ onDone }: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendErrorKey, setSendErrorKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { email: '', code: '', password: '' },
    validators: { onSubmit: resetSchema },
    onSubmit: async ({ value }) => {
      setErrorKey(null);

      try {
        await resetPassword({ email: value.email, code: value.code, password: value.password });
        toast.success(t('auth.message.passwordReset'));
        onDone();
      } catch (error) {
        setErrorKey(authErrorKey(error));
      }
    }
  });

  /** 发码并启动倒计时。冷却期间禁用按钮，避免拿 429 当反馈。 */
  async function handleSendCode() {
    const emailResult = emailSchema.safeParse(form.getFieldValue('email'));

    if (!emailResult.success) {
      setSendErrorKey('auth.validation.emailInvalid');
      return;
    }

    setSendErrorKey(null);
    setSending(true);

    try {
      const { cooldown: seconds } = await forgotPassword({ email: emailResult.data });
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
      <FieldDescription>{t('auth.forgotPassword.description')}</FieldDescription>

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

        {/* 验证码输入框与「发送」按钮并排，彼此隔开：按钮是输入框旁边的独立控件，
            不内联进输入框边框。 */}
        <form.AppField
          name='code'
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('auth.field.code')}</FieldLabel>
                <div className='flex items-center gap-2'>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    placeholder={t('auth.field.codePlaceholder')}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    className='shrink-0'
                    disabled={cooldown > 0 || sending}
                    onClick={() => void handleSendCode()}
                  >
                    {cooldown > 0
                      ? t('auth.action.resendIn', { seconds: cooldown })
                      : sending
                        ? t('auth.action.sending')
                        : t('auth.action.sendCode')}
                  </Button>
                </div>
                {sendErrorKey !== null && (
                  <p role='alert' className='text-destructive text-sm'>
                    {t(sendErrorKey)}
                  </p>
                )}
                {isInvalid && (
                  <FieldError id={`${field.name}-error`} errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />

        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField
              label={t('auth.forgotPassword.newPassword')}
              type='password'
              autoComplete='new-password'
              placeholder={t('auth.field.passwordHint')}
            />
          )}
        />
      </FieldGroup>

      {errorKey !== null && (
        <p role='alert' className='text-destructive text-sm'>
          {t(errorKey)}
        </p>
      )}

      <form.AppForm>
        <form.SubmitButton className='w-full'>{t('auth.action.setPassword')}</form.SubmitButton>
      </form.AppForm>

      <Button type='button' variant='ghost' className='w-full' onClick={onDone}>
        {t('auth.forgotPassword.back')}
      </Button>
    </form>
  );
}
