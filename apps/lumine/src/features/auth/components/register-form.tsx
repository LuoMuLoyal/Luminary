import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/lib/form';
import { describeAuthError } from '@/features/auth/api/errors';
import { sendVerificationCode } from '@/features/auth/api/service';
import { useSessionStore } from '@/features/auth/session';

/**
 * 注册表单。
 *
 * ## 三步而不是一个表单
 *
 * Lucent 的注册**必须带邮箱验证码**（`registerSchema.code` 必填），而验证码要先
 * 用 `POST /auth/send-verification-code` 发出去（`scene: 'register'`）。
 * 所以是：填邮箱 → 发码并倒计时 → 填验证码与密码 → 提交。
 *
 * ## 冷却时间来自服务端
 *
 * `sendVerificationCode` 的响应里带 `cooldown`（秒）。**不要在客户端写死 60**——
 * 服务端改配置时写死值会造成「按钮亮了但服务端还没放行」的 429。
 *
 * ## 密码沿用登录的强度口径
 *
 * 服务端注册与登录共用 `strongPasswordSchema()`，这里做同样的前置校验，
 * 免得用户填完验证码才被告知密码不合格。
 */

const emailSchema = z.email('请输入有效的邮箱地址');
const codeSchema = z.string().min(1, '请输入验证码');
const passwordSchema = z.string().min(8, '密码至少 8 位');
const nicknameSchema = z.string().max(20, '昵称最多 20 个字符');

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
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: '',
      code: '',
      password: '',
      nickname: ''
    },
    validators: {
      // `nickname` 空串等价于不填，交给提交时归一，不在这里拒绝。
      onSubmit: registerSchema
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      try {
        const user = await useSessionStore.getState().register({
          email: value.email,
          code: value.code,
          password: value.password,
          ...(value.nickname.trim().length > 0 && { nickname: value.nickname.trim() })
        });

        toast.success(`注册成功：${user.nickname ?? user.email}`);
        await navigate({ to: redirectTo ?? '/dashboard', replace: true });
      } catch (error) {
        setSubmitError(describeAuthError(error));
      }
    }
  });

  /** 发验证码并启动倒计时。冷却期间按钮禁用，避免拿 429 当反馈。 */
  async function handleSendCode() {
    const email = form.getFieldValue('email');
    const emailResult = emailSchema.safeParse(email);

    if (!emailResult.success) {
      setSendError(emailResult.error.issues[0]?.message ?? '请输入有效的邮箱地址');
      return;
    }

    setSendError(null);
    setSending(true);

    try {
      const { cooldown: seconds } = await sendVerificationCode({
        email: emailResult.data,
        scene: 'register'
      });
      setCooldown(seconds);
      toast.success('验证码已发送，请查收邮箱');
    } catch (error) {
      setSendError(describeAuthError(error));
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
              label='邮箱'
              type='email'
              autoComplete='email'
              placeholder='you@example.com'
            />
          )}
        />

        {/* 验证码与「发送」按钮在同一行：两者是同一个动作的两半，
            分开两处会让用户以为按钮只管下半部分。 */}
        <form.AppField
          name='code'
          children={(field) => (
            <div className='space-y-2'>
              <field.TextField
                label='邮箱验证码'
                inputMode='numeric'
                autoComplete='one-time-code'
                placeholder='请输入邮箱收到的验证码'
              />
              <Button
                type='button'
                variant='outline'
                className='w-full'
                disabled={cooldown > 0 || sending}
                onClick={() => void handleSendCode()}
              >
                {cooldown > 0
                  ? `${String(cooldown)} 秒后可重新发送`
                  : sending
                    ? '发送中…'
                    : '发送验证码'}
              </Button>
              {sendError !== null && (
                <p role='alert' className='text-destructive text-sm'>
                  {sendError}
                </p>
              )}
            </div>
          )}
        />

        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField
              label='密码'
              type='password'
              autoComplete='new-password'
              placeholder='至少 8 位，建议使用口令短语'
            />
          )}
        />

        <form.AppField
          name='nickname'
          children={(field) => (
            <field.TextField
              label='昵称'
              autoComplete='nickname'
              placeholder='可选，最多 20 个字符'
            />
          )}
        />
      </FieldGroup>

      {submitError !== null && (
        <p role='alert' className='text-destructive text-sm'>
          {submitError}
        </p>
      )}

      <form.AppForm>
        <form.SubmitButton className='w-full'>创建账号</form.SubmitButton>
      </form.AppForm>

      <FieldDescription className='text-center'>
        注册即表示同意服务条款与隐私政策。
      </FieldDescription>
    </form>
  );
}
