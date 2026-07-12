'use client';

import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/shared/ui/field';
import Link from 'next/link';
import { useStep1Form } from '../hooks/use-forget-password-forms';
import { EmailVerifyFormData } from '../lib/schema/email-verify.scehma';

interface Step1EmailProps {
  email: string;
  onSubmit: (data: EmailVerifyFormData) => void;
  error?: string | null;
  isPending?: boolean;
}

export default function Step1Email({ email, onSubmit, error, isPending }: Step1EmailProps) {
  const t = useTranslations('Auth.forgetPassword');
  
  const form = useStep1Form(email);
  const { isSubmitting } = form.formState;
  const loading = isPending || isSubmitting;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-center text-greyDarker mb-2">
        {t('step1.title')}
      </h2>
      <p className="text-center text-greyNormal font-cairo-medium-sm mb-8">
        {t('step1.description')}
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <FieldGroup>
          {error && (
            <FieldError className="w-full bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-cairo-medium-sm mb-4">
              {error}
            </FieldError>
          )}
          {/* Email Field */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('step1.email')}
                  <span className="text-red-500 ms-1">*</span>
                </FieldLabel>
                <input
                  {...field}
                  type="email"
                  placeholder={t('step1.emailPlaceholder')}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full h-12 font-cairo-bold-lg text-white rounded-lg cursor-pointer mt-2"
          >
            {t('step1.submit')}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="font-cairo-medium-sm text-greyNormal">
          {t('step1.noAccount')}{' '}
          <Link
            href="/register"
            className="text-orangeNormal hover:text-orangeHover hover:underline font-cairo-bold-sm transition-colors"
          >
            {t('step1.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
