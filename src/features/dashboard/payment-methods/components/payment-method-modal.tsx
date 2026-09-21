"use client";

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Controller } from 'react-hook-form';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { usePaymentMethodForm } from '../hooks/use-payment-method-form';
import { CountryPaymentMethodResponse } from '../lib/types/payment-method-types';
import { COUNTRIES } from '@/shared/lib/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMethod: CountryPaymentMethodResponse | null;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  editingMethod,
}: PaymentMethodModalProps) {
  const t = useTranslations('Dashboard.paymentMethods.modal');
  const tErrors = useTranslations('Dashboard.paymentMethods.errors');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    form,
    onSubmit,
    isSubmitting,
    isEditing,
    logoFile,
    setLogoFile,
    logoError,
    setLogoError,
  } = usePaymentMethodForm({ editingMethod, onClose });

  const inputClasses = (hasError: boolean) => `
    w-full h-12 px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-blueNormal'}
  `;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) setLogoError(null);
  };

  // Preview URL: new file takes priority, then existing logoUrl on edit
  const previewUrl = logoFile
    ? URL.createObjectURL(logoFile)
    : isEditing && editingMethod?.logoUrl
      ? editingMethod.logoUrl
      : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h3 className="font-cairo-bold-xl text-greyDark">
            {isEditing
              ? t('editTitle', { defaultValue: 'Edit Payment Method' })
              : t('createTitle', { defaultValue: 'Add Payment Method' })}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="payment-method-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Row 1: Country Code + Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Code */}
              <Controller
                name="countryCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-cairo-semibold-base text-greyDarker">
                      {t('countryCode', { defaultValue: 'Country Code' })} *
                    </label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`h-12 bg-white rounded-lg border focus:ring-1 focus:ring-blueNormal outline-none text-greyDarker font-cairo-regular-base ${fieldState.error ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-blueNormal'}`}
                      >
                        <SelectValue placeholder={t('countryCodePlaceholder', { defaultValue: 'Select Country' })}>
                          {field.value && COUNTRIES.find(c => c.code === field.value)
                            ? `${isAr ? COUNTRIES.find(c => c.code === field.value)?.nameAr : COUNTRIES.find(c => c.code === field.value)?.nameEn} (${field.value})`
                            : field.value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {isAr ? country.nameAr : country.nameEn} ({country.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="text-red-500 text-sm font-cairo-medium-sm">
                        {tErrors(fieldState.error.message || 'generic')}
                      </span>
                    )}
                  </div>
                )}
              />

              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-cairo-semibold-base text-greyDarker">
                      {t('title', { defaultValue: 'Title' })} *
                    </label>
                    <input
                      {...field}
                      type="text"
                      maxLength={150}
                      placeholder={t('titlePlaceholder', {
                        defaultValue: 'e.g. Vodafone Cash',
                      })}
                      className={inputClasses(!!fieldState.error)}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm font-cairo-medium-sm">
                        {tErrors(fieldState.error.message || 'generic')}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Account Identifier */}
            <Controller
              name="accountIdentifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label className="font-cairo-semibold-base text-greyDarker">
                    {t('accountIdentifier', {
                      defaultValue: 'Account / Wallet Number',
                    })}{' '}
                    *
                  </label>
                  <input
                    {...field}
                    type="text"
                    maxLength={250}
                    placeholder={t('accountIdentifierPlaceholder', {
                      defaultValue: 'e.g. 01012345678 or IBAN',
                    })}
                    className={inputClasses(!!fieldState.error)}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm font-cairo-medium-sm">
                      {tErrors(fieldState.error.message || 'generic')}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Instruction Description */}
            <Controller
              name="instructionDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label className="font-cairo-semibold-base text-greyDarker">
                    {t('instructionDescription', {
                      defaultValue: 'Payment Instructions',
                    })}{' '}
                    *
                  </label>
                  <textarea
                    {...field}
                    maxLength={2000}
                    rows={4}
                    placeholder={t('instructionDescriptionPlaceholder', {
                      defaultValue:
                        'Step-by-step instructions shown to the student...',
                    })}
                    className={`${inputClasses(!!fieldState.error)} min-h-[120px] py-3 resize-y`}
                  />
                  <div className="flex items-center justify-between">
                    {fieldState.error && (
                      <span className="text-red-500 text-sm font-cairo-medium-sm">
                        {tErrors(fieldState.error.message || 'generic')}
                      </span>
                    )}
                    <span className="text-greyLightActive text-xs font-cairo-regular-sm ms-auto">
                      {field.value?.length || 0}/2000
                    </span>
                  </div>
                </div>
              )}
            />

            {/* Logo Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-cairo-semibold-base text-greyDarker">
                {t('logo', { defaultValue: 'Logo' })}{' '}
                {!isEditing && '*'}
                {isEditing && (
                  <span className="text-greyLightActive font-cairo-regular-sm ms-1">
                    ({t('logoOptional', { defaultValue: 'optional — keep current if empty' })})
                  </span>
                )}
              </label>

              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-black/10 bg-black/5 flex items-center justify-center overflow-hidden shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="size-8 text-greyLightActive" />
                  )}
                </div>

                {/* Upload button */}
                <div className="flex flex-col gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-black/10 bg-white hover:bg-black/5 transition-colors cursor-pointer font-cairo-medium-sm text-greyDarker"
                  >
                    <Upload className="size-4" />
                    {logoFile
                      ? logoFile.name
                      : t('chooseLogo', { defaultValue: 'Choose logo file' })}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {logoError && (
                    <span className="text-red-500 text-sm font-cairo-medium-sm">
                      {tErrors(logoError)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ─── Footer ─── */}
        <div className="p-6 border-t border-black/5 bg-gray-50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-red-400 transition-colors cursor-pointer bg-red-500 text-white"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="submit"
            form="payment-method-form"
            disabled={isSubmitting}
            className="bg-blueNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isEditing
              ? t('saveChanges', { defaultValue: 'Save Changes' })
              : t('create', { defaultValue: 'Add Method' })}
          </button>
        </div>
      </div>
    </div>
  );
}
