'use client';

import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { Field, FieldGroup, FieldError } from '@/shared/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/components/ui/input-otp';
import { useOtpForm, OtpFormData } from '../hooks/use-otp-form';

interface OtpVerificationProps {
  /** The email to display to the user */
  email: string;
  /** Called when the user clicks "edit" to go back and change their email */
  onEditEmail?: () => void;
  /** Called with validated OTP data on submit */
  onSubmit: (data: OtpFormData) => void;
  /** Translation namespace — defaults to 'Auth.forgetPassword' */
  translationNamespace?: string;
  error?: string | null;
  isPending?: boolean;
}

/**
 * Shared OTP verification component.
 * Used by both forget-password and register flows.
 */
export default function OtpVerification({
  email,
  onEditEmail,
  onSubmit,
  translationNamespace = 'Auth.forgetPassword',
  error,
  isPending,
}: OtpVerificationProps) {
  const t = useTranslations(translationNamespace);

  const form = useOtpForm();
  const { isSubmitting } = form.formState;
  const loading = isPending || isSubmitting;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-center text-greyDarker mb-2">
        {t('otp.title')}
      </h2>
      <div className="text-center text-greyNormal font-cairo-medium-sm mb-8 flex items-center justify-center gap-1 flex-wrap">
        <span>{t('otp.description')}</span>
        <span className="font-cairo-bold-sm text-greyDarker" dir="ltr">{email}</span>
        {onEditEmail && (
          <button
            type="button"
            onClick={onEditEmail}
            className="text-orangeNormal hover:underline font-cairo-bold-sm ms-1 cursor-pointer"
          >
            {t('otp.edit')}
          </button>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8 flex flex-col items-center">
        <FieldGroup className="w-full">
          {error && (
            <FieldError className="text-center w-full bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-cairo-medium-sm mb-4">
              {error}
            </FieldError>
          )}
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className="flex flex-col items-center">
                <div dir="ltr" className="w-full flex justify-center">
                  <div className="flex gap-2 justify-center" dir="ltr">
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      dir="ltr"
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className={`w-12 h-14 text-center border rounded-lg text-xl font-bold transition-colors focus:ring-0 text-greyDark ${
                              fieldState.error
                                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                : 'border-orange-400 focus:border-orangeNormal focus:ring-1 focus:ring-orangeNormal'
                            }`}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                {fieldState.error && (
                  <FieldError className="mt-2 text-center w-full">
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
            className="w-full h-12 font-cairo-bold-lg text-white rounded-lg cursor-pointer mt-4"
          >
            {t('otp.submit')}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
