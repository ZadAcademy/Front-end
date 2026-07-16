'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/shared/ui/field';
import { useStep3Form } from '../hooks/use-forget-password-forms';
import { ForgetPasswordFormData } from '../lib/schema/forget-password.schema';

interface Step3ResetProps {
  onSubmit: (data: ForgetPasswordFormData) => void;
  error?: string | null;
  isPending?: boolean;
 
}

export default function Step3Reset({ onSubmit, error, isPending }: Step3ResetProps) {
  const t = useTranslations('Auth.forgetPassword');
  
  const form = useStep3Form();
  const { isSubmitting } = form.formState;
  const loading = isPending || isSubmitting;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-center text-greyDarker mb-8">
        {t('step3.title')}
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <FieldGroup>
          {error && (
            <FieldError className="w-full bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-cairo-medium-sm mb-4">
              {error}
            </FieldError>
          )}
          {/* Password Field */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('step3.password')}
                  <span className="text-red-500 ms-1">*</span>
                </FieldLabel>
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('step3.passwordPlaceholder')}
                    autoComplete="new-password"
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
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 -translate-y-1/2 inset-e-3 p-1 text-greyNormal hover:text-greyDarker transition-colors cursor-pointer bg-transparent border-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                  </button>
                </div>
                {fieldState.error && (
                  <FieldError>
                    {t(`errors.${fieldState.error.message}`)}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('step3.confirmPassword')}
                  <span className="text-red-500 ms-1">*</span>
                </FieldLabel>
                <div className="relative">
                  <input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('step3.confirmPasswordPlaceholder')}
                    autoComplete="new-password"
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
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 -translate-y-1/2 inset-e-3 p-1 text-greyNormal hover:text-greyDarker transition-colors cursor-pointer bg-transparent border-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                  </button>
                </div>
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
            {t('step3.submit')}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
