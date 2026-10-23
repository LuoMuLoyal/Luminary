import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { FieldDescription, FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/lib/form';
import type { LoginRequest } from '@/features/auth/api/types';
import { authErrorKey } from '@/features/auth/api/errors';
import { useSessionStore } from '@/features/auth/session';

/**
 * 登录表单。
 *
 * ## 两种登录方式
 *
 * Lucent 的登录接受**密码或邮箱验证码二选一**。这里把「验证码登录」做成可切换的
 * 第二种方式而不是并列字段：两个一起显示会让用户以为必须都填。
 *
 * ## 密码为什么要校验强度
 *
 * 服务端登录同样走 `strongPasswordSchema()`（≥8 位 + zxcvbn 评分）。前端只校验
 * 「非空」的话，弱密码在提交后只会得到看不出原因的 401。这里做同样强度的前置
 * 校验，是为了**在输入时就告诉用户**。
 *
 * ## 校验消息是 i18n key
 *
 * schema 在模块加载时构造，那时取不到当前界面语言，所以消息写成 key，
 * 由 `FieldError` 在渲染时翻译。**不要在这里写中文或英文文案。**
 */

/** 校验消息是 i18n key，不是文案（见上）。 */
const emailSchema = z.email('auth.validation.emailInvalid');
const passwordSchema = z.string().min(8, 'auth.validation.passwordTooShort');

const passwordLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const codeLoginSchema = z.object({
  email: emailSchema,
  code: z.string().min(1, 'auth.validation.codeRequired')
});

type LoginMode = 'password' | 'code';

interface LoginFormProps {
  /** 登录成功后的回跳路径；缺省去 `/dashboard`。 */
  redirectTo?: string;
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>('password');
  const [errorKey, setErrorKey] = useState<string | null>(null);

  /**
   * 提交处理对两种模式相同，差别只在请求体字段，所以共用一个函数；
   * 两个表单各自绑定自己的 `onSubmit`（字段类型由 `defaultValues` 推断，
   * 合并成一个表单会让类型含糊）。
   */
  async function submit(input: LoginRequest) {
    setErrorKey(null);

    try {
      const user = await useSessionStore.getState().login(input);
      toast.success(t('auth.message.signedIn', { name: user.nickname ?? user.email }));
      void navigate({ to: redirectTo ?? '/dashboard', replace: true });
    } catch (error) {
      // 登录失败**不跳转**、也不清会话；文案展示在表单里而不是 toast——
      // toast 会飘走，而用户此刻正盯着这个表单找原因。
      setErrorKey(authErrorKey(error));
    }
  }

  return (
    <div className='space-y-4'>
      {mode === 'password' ? (
        <PasswordLoginForm onSubmit={submit} errorKey={errorKey} />
      ) : (
        <CodeLoginForm onSubmit={submit} errorKey={errorKey} />
      )}

      <Button
        type='button'
        variant='ghost'
        className='w-full'
        onClick={() => {
          setErrorKey(null);
          setMode(mode === 'password' ? 'code' : 'password');
        }}
      >
        {mode === 'password' ? t('auth.action.useCode') : t('auth.action.usePassword')}
      </Button>

      <FieldDescription className='text-center'>{t('auth.footer.forgotPassword')}</FieldDescription>
    </div>
  );
}

interface FormProps {
  onSubmit: (input: LoginRequest) => Promise<void>;
  errorKey: string | null;
}

function PasswordLoginForm({ onSubmit, errorKey }: FormProps) {
  const { t } = useTranslation();
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
              label={t('auth.field.email')}
              type='email'
              autoComplete='email'
              placeholder={t('auth.field.emailPlaceholder')}
            />
          )}
        />
        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField
              label={t('auth.field.password')}
              type='password'
              autoComplete='current-password'
              placeholder={t('auth.field.passwordPlaceholder')}
            />
          )}
        />
      </FieldGroup>

      <SubmitError errorKey={errorKey} />

      <form.AppForm>
        <form.SubmitButton className='w-full'>{t('auth.action.signIn')}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

function CodeLoginForm({ onSubmit, errorKey }: FormProps) {
  const { t } = useTranslation();
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
              label={t('auth.field.email')}
              type='email'
              autoComplete='email'
              placeholder={t('auth.field.emailPlaceholder')}
            />
          )}
        />
        <form.AppField
          name='code'
          children={(field) => (
            <field.TextField
              label={t('auth.field.code')}
              inputMode='numeric'
              autoComplete='one-time-code'
              placeholder={t('auth.field.codePlaceholder')}
            />
          )}
        />
      </FieldGroup>

      <SubmitError errorKey={errorKey} />

      <form.AppForm>
        <form.SubmitButton className='w-full'>{t('auth.action.signIn')}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

/** 提交失败提示。用 `role='alert'` 让读屏软件也能立刻读到。 */
function SubmitError({ errorKey }: { errorKey: string | null }) {
  const { t } = useTranslation();
  if (errorKey === null) return null;

  return (
    <p role='alert' className='text-destructive text-sm'>
      {t(errorKey)}
    </p>
  );
}
