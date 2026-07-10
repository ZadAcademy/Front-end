'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from '@/shared/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/shared/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import Link from 'next/link';
import { RegisterFormData } from '../libs/schema/register-schema';
import {
  EXPERIENCE_OPTIONS,
  SPECIALIZATION_OPTIONS,
} from '../libs/constants/register-options';

interface RegisterFieldsProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
}

export default function RegisterFields({ form, onSubmit }: RegisterFieldsProps) {
  const t = useTranslations('Auth.register');
  const { isSubmitting } = form.formState;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-center text-greyDarker mb-8">
        {t('title')}
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {/* ─── First Name & Last Name (side by side) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                    {t('firstName')}
                    <span className="text-red-500 ms-1">*</span>
                  </FieldLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder={t('firstNamePlaceholder')}
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

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                    {t('lastName')}
                    <span className="text-red-500 ms-1">*</span>
                  </FieldLabel>
                  <input
                    {...field}
                    type="text"
                    placeholder={t('lastNamePlaceholder')}
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
          </div>

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

          {/* ─── Phone Field ─── */}
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('phone')}
                  <span className="text-red-500 ms-1">*</span>
                </FieldLabel>
                <div dir="ltr" className="w-full">
                  <PhoneInput
                    international
                    defaultCountry="EG"
                    value={field.value}
                    onChange={(value) => field.onChange(value || '')}
                    placeholder={t('phonePlaceholder')}
                    className={`
                      w-full h-12 px-4 rounded-lg border bg-white
                      font-cairo-regular-base text-greyDarker
                      placeholder:text-greyLightActive
                      outline-none transition-colors duration-200
                      [&_.PhoneInputInput]:outline-none
                      [&_.PhoneInputInput]:bg-transparent
                      [&_.PhoneInputInput]:w-full
                      [&_.PhoneInputInput]:h-full
                      [&_.PhoneInputInput]:font-cairo-regular-base
                      ${fieldState.error
                        ? 'border-red-400 focus-within:border-red-500'
                        : 'border-greyLightActive focus-within:border-orangeNormal'
                      }
                    `}
                  />
                </div>
                {fieldState.error && (
                  <FieldError>
                    {t(`errors.${fieldState.error.message}`)}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* ─── Experience & Specialization Fields ─── */}
          
            <Controller
              name="experience"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                    {t('experience')}
                    <span className="text-red-500 ms-1">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-greyLightActive focus:border-orangeNormal'
                        }
                      `}
                    >
                      <SelectValue placeholder={t('experiencePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`experienceOptions.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError>
                      {t(`errors.${fieldState.error.message}`)}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="specialization"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                    {t('specialization')}
                    <span className="text-red-500 ms-1">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-greyLightActive focus:border-orangeNormal'
                        }
                      `}
                    >
                      <SelectValue placeholder={t('specializationPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALIZATION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`specializationOptions.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError>
                      {t(`errors.${fieldState.error.message}`)}
                    </FieldError>
                  )}
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

          {/* ─── Login link ─── */}
          <div className="mt-4 pt-6 border-t border-gray-200 text-center">
            <p className="font-cairo-medium-sm text-greyNormal">
              {t('hasAccount')}{' '}
              <Link
                href="/login"
                className="text-blueNormal hover:text-blueNormalHover hover:underline font-cairo-bold-sm transition-colors"
              >
                {t('login')}
              </Link>
            </p>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
