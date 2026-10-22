import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/lib/form';
import type { LoginRequest } from '@/features/auth/api/types';
import { describeAuthError } from '@/features/auth/api/errors';
import { useSessionStore } from '@/features/auth/session';

/**
 * 登录表单。
 *
 * ## 两种登录方式
 *
 * Lucent 的登录接受**密码或邮箱验证码二选一**（`loginSchema` 中两者皆可选）。
 * 这里把「验证码登录」做成可切换的第二种方式而不是并列字段：两个一起显示
 * 会让用户以为必须都填。
 *
 * ## 密码为什么要校验强度
 *
 * 服务端登录同样走 `strongPasswordSchema()`（≥8 位 + zxcvbn 评分）。前端只校验
 * 「非空」的话，弱密码在提交后只会得到看不出原因的 401。这里做同样强度的前置
 * 校验，是为了**在输入时就告诉用户**。
 *
 * ## 验证码长度不写死
 *
 * Lucent 的验证码长度是运行时配置（默认 6 位，接受 4–8 位），所以只校验非空。
 * 写死长度会在服务端改配置时把合法验证码挡在门外。
 */

const emailSchema = z.email('请输入有效的邮箱地址');
const passwordSchema = z.string().min(8, '密码至少 8 位');

const passwordLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const codeLoginSchema = z.object({
  email: emailSchema,
  code: z.string().min(1, '请输入验证码')
});

type LoginMode = 'password' | 'code';

interface LoginFormProps {
  /** 登录成功后的回跳路径；缺省去 `/dashboard`。 */
  redirectTo?: string;
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>('password');
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * 提交处理对两种模式相同，差别只在请求体字段，所以共用一个函数，
   * 两个表各自绑定自己的 `onSubmit`（TanStack Form 的字段类型是推断出来的，
   * 合并成一个表单会让 `defaultValues` 类型含糊）。
   */
  async function submit(input: LoginRequest) {
    setSubmitError(null);

    try {
      const user = await useSessionStore.getState().login(input);
      toast.success(`已登录：${user.nickname ?? user.email}`);
      await navigate({ to: redirectTo ?? '/dashboard', replace: true });
    } catch (error) {
      // 登录失败**不跳转**、也不清会话。文案展示在表单里而不是 toast：
      // toast 会飘走，而用户此刻正盯着这个表单找原因。
      setSubmitError(describeAuthError(error));
    }
  }

  return (
    <div className='space-y-4'>
      {mode === 'password' ? (
        <PasswordLoginForm onSubmit={submit} error={submitError} />
      ) : (
        <CodeLoginForm onSubmit={submit} error={submitError} />
      )}

      <Button
        type='button'
        variant='ghost'
        className='w-full'
        onClick={() => {
          setSubmitError(null);
          setMode(mode === 'password' ? 'code' : 'password');
        }}
      >
        {mode === 'password' ? '改用邮箱验证码登录' : '改用密码登录'}
      </Button>

      <FieldDescription className='text-center'>
        忘记密码暂不支持，请联系管理员重置。
      </FieldDescription>
    </div>
  );
}

function PasswordLoginForm({
  onSubmit,
  error
}: {
  onSubmit: (input: LoginRequest) => Promise<void>;
  error: string | null;
}) {
  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: passwordLoginSchema },
    onSubmit: async ({ value }) => {
      await onSubmit({ email: value.email, password: value.password });
    }
  });

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
        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField
              label='密码'
              type='password'
              autoComplete='current-password'
              placeholder='请输入密码'
            />
          )}
        />
      </FieldGroup>

      <SubmitError error={error} />

      <form.AppForm>
        <form.SubmitButton className='w-full'>登录</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

function CodeLoginForm({
  onSubmit,
  error
}: {
  onSubmit: (input: LoginRequest) => Promise<void>;
  error: string | null;
}) {
  const form = useAppForm({
    defaultValues: { email: '', code: '' },
    validators: { onSubmit: codeLoginSchema },
    onSubmit: async ({ value }) => {
      await onSubmit({ email: value.email, code: value.code });
    }
  });

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
        <form.AppField
          name='code'
          children={(field) => (
            <field.TextField
              label='邮箱验证码'
              inputMode='numeric'
              autoComplete='one-time-code'
              placeholder='请输入邮箱收到的验证码'
            />
          )}
        />
      </FieldGroup>

      <SubmitError error={error} />

      <form.AppForm>
        <form.SubmitButton className='w-full'>登录</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

/** 提交失败提示。用 `role='alert'` 让读屏软件也能立刻读到。 */
function SubmitError({ error }: { error: string | null }) {
  if (error === null) return null;

  return (
    <p role='alert' className='text-destructive text-sm'>
      {error}
    </p>
  );
}
