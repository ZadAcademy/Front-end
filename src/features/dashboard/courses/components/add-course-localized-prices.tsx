'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Field, FieldLabel, FieldError } from '@/shared/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import { useCourseLocalizedPricesForm } from '../hooks/use-course-localized-prices-form';

export const SUPPORTED_COUNTRIES = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', currency: 'SAR' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', currency: 'EGP' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات', currency: 'AED' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', currency: 'KWD' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', currency: 'QAR' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', currency: 'JOD' },
  { code: 'US', nameEn: 'United States', nameAr: 'الولايات المتحدة', currency: 'USD' },
  { code: 'GB', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', currency: 'GBP' },
];

export function AddCourseLocalizedPrices() {
  const t = useTranslations('Dashboard.addCourse.localizedPrices');
  const tErrors = useTranslations('Dashboard.addCourse.errors');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const {
    form,
    priceFields,
    appendPrice,
    removePrice,
    onSubmit,
  } = useCourseLocalizedPricesForm();

  const inputClasses = (hasError: boolean) => `
    w-full h-12 px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-orangeNormal'}
  `;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h2 className="font-cairo-bold-xl text-greyDarker mb-2">{t('title')}</h2>
        <p className="font-cairo-medium-sm text-greyNormal">{t('description')}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {form.formState.errors.prices?.root && (
          <div className="p-3 bg-red-50 text-red-500 rounded-lg font-cairo-medium-sm">
            {tErrors('atLeastOnePriceRequired')}
          </div>
        )}

        <div className="space-y-4">
          {priceFields.map((fieldItem, index) => {
            const countryError = form.formState.errors.prices?.[index]?.countryCode;
            const priceError = form.formState.errors.prices?.[index]?.price;
            const discountError = form.formState.errors.prices?.[index]?.discountPrice;

            return (
              <div key={fieldItem.id} className="p-4 bg-greyLight/10 border border-greyLightActive rounded-xl relative">
                <div className="absolute top-4 end-4">
                  <button
                    type="button"
                    onClick={() => removePrice(index)}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    aria-label={t('remove')}
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 md:pt-0 md:pe-12">
                  {/* Country Selection */}
                  <Controller
                    name={`prices.${index}.countryCode`}
                    control={form.control}
                    render={({ field }) => (
                      <Field data-invalid={!!countryError}>
                        <FieldLabel className="font-cairo-semibold-sm text-greyDarker">
                          {t('country')} <span className="text-red-500 ms-1">*</span>
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            const country = SUPPORTED_COUNTRIES.find((c) => c.code === val);
                            if (country) {
                              form.setValue(`prices.${index}.currencyCode`, country.currency);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={`h-12 bg-white rounded-lg border focus:ring-1 focus:ring-orangeNormal outline-none ${
                              countryError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-orangeNormal'
                            }`}
                          >
                            <SelectValue placeholder={t('countryPlaceholder')}>
                              {field.value && SUPPORTED_COUNTRIES.find(c => c.code === field.value) 
                                ? `${isAr ? SUPPORTED_COUNTRIES.find(c => c.code === field.value)?.nameAr : SUPPORTED_COUNTRIES.find(c => c.code === field.value)?.nameEn} (${SUPPORTED_COUNTRIES.find(c => c.code === field.value)?.currency})`
                                : undefined}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {SUPPORTED_COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {isAr ? country.nameAr : country.nameEn} ({country.currency})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {countryError && <FieldError>{tErrors(countryError.message || 'generic')}</FieldError>}
                      </Field>
                    )}
                  />

                  {/* Price Input */}
                  <Controller
                    name={`prices.${index}.price`}
                    control={form.control}
                    render={({ field }) => (
                      <Field data-invalid={!!priceError}>
                        <FieldLabel className="font-cairo-semibold-sm text-greyDarker">
                          {t('price')} <span className="text-red-500 ms-1">*</span>
                        </FieldLabel>
                        <input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={t('pricePlaceholder')}
                          className={inputClasses(!!priceError)}
                        />
                        {priceError && <FieldError>{tErrors(priceError.message || 'generic')}</FieldError>}
                      </Field>
                    )}
                  />

                  {/* Discount Price Input */}
                  <Controller
                    name={`prices.${index}.discountPrice`}
                    control={form.control}
                    render={({ field }) => (
                      <Field data-invalid={!!discountError}>
                        <FieldLabel className="font-cairo-semibold-sm text-greyDarker">
                          {t('discountPrice')}
                        </FieldLabel>
                        <input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          value={field.value ?? ''}
                          placeholder={t('discountPricePlaceholder')}
                          className={inputClasses(!!discountError)}
                        />
                        {discountError && <FieldError>{tErrors(discountError.message || 'generic')}</FieldError>}
                      </Field>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4 gap-2 font-cairo-semibold-sm cursor-pointer"
          onClick={() => appendPrice({ id: uuidv4(), countryCode: '', currencyCode: '', price: 0, discountPrice: null })}
        >
          <Plus className="size-4" />
          {t('addPrice')}
        </Button>

        <div className="pt-6 flex justify-end border-t border-black/5">
          <Button type="submit" size="lg" className="font-cairo-bold-base px-8 h-12 cursor-pointer">
            {t('submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
