'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginForm } from '../hooks/use-login-form';
import { Button } from '@/shared/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/shared/ui/field';
import Link from 'next/link';

interface LoginFormProps {
  /** Called after successful login — used by modal to close itself */
  onSuccess?: () => void;
}

/**
 * LoginForm — Reusable login form component.
 * Works standalone on a page or inside a modal.
 * Uses shadcn Field components + Controller from react-hook-form.
 */
export default function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations('Auth.login');
  const { form, onSubmit } = useLoginForm(onSuccess);
  const { isSubmitting, errors } = form.formState;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-120 mx-auto">
      {/* Card container */}
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        {/* Title */}
        <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-center text-greyDarker mb-8">
          {t('title')}
        </h2>

        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {/* ─── Root error (server/auth error) ─── */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center mb-4 flex flex-col items-center gap-2">
                <FieldError className="font-cairo-medium-sm">
                  {errors.root.message === 'unverifiedEmail'
                    ? t('errors.unverifiedEmail')
                    : errors.root.message}
                </FieldError>
                {errors.root.message === 'unverifiedEmail' && (
                  <Link href={`/verify-account?email=${encodeURIComponent(form.getValues('email'))}`}>
                    <button type="button" className="mt-2 text-black  underline cursor-pointer font-cairo-semibold-sm">
                      {t('errors.verifyEmailButton')}
                    </button>
                  </Link>
                )}
              </div>
            )}

            {/* ─── Email Field ─── */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                    {t('email')}
                    <span className="text-red-500 ms-1">*</span>
                  </FieldLabel>
                  <input
                    {...field}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    autoComplete="email"
                    aria-invalid={!!fieldState.error}
                    className={`
                      w-full h-12 px-4 rounded-lg border bg-white
                      font-cairo-regular-base text-greyDarker
                      placeholder:text-greyLightActive
                      outline-none transition-colors duration-200
                      ${fieldState.error
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-greyLightActive focus:border-orangeNormal'
                      }
                    `}
                  />
                  {fieldState.error && (
                    <FieldError>
                      {t(`errors.${fieldState.error.message}`)}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            {/* ─── Password Field ─── */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                    {t('password')}
                    <span className="text-red-500 ms-1">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('passwordPlaceholder')}
                      autoComplete="current-password"
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 pe-12 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        placeholder:text-greyLightActive
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-greyLightActive focus:border-orangeNormal'
                        }
                      `}
                    />
                    {/* Show/hide password toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 -translate-y-1/2 inset-e-3 p-1 text-greyNormal hover:text-greyDarker transition-colors cursor-pointer bg-transparent border-none"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeOff className="size-5" />
                      )}
                    </button>
                  </div>
                  {fieldState.error && (
                    <FieldError>
                      {t(`errors.${fieldState.error.message}`)}
                    </FieldError>
                  )}

                  {/* Forgot password link */}
                  <Link
                    href="/forget-password"
                    className="font-cairo-semibold-sm text-greyNormal hover:text-orangeNormal transition-colors self-end mt-1"
                  >
                    {t('forgotPassword')}
                  </Link>
                </Field>
              )}
            />

            {/* ─── Submit Button ─── */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full h-12 font-cairo-bold-lg text-white rounded-lg cursor-pointer mt-2"
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>

            {/* ─── Register link ─── */}
            <p className="text-center font-cairo-medium-sm text-greyNormal mt-2">
              {t('noAccount')}{' '}
              <Link
                href="/register"
                className="text-blueNormal hover:text-blueNormalHover hover:underline font-cairo-bold-sm transition-colors"
              >
                {t('register')}
              </Link>
            </p>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
