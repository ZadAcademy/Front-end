"use client";

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { X, Loader2, Percent, Info } from 'lucide-react';
import { useDiscountPolicyForm } from '../hooks/use-discount-policy-form';
import { DiscountPolicyResponse } from '../lib/types/ambassador-types';
import { getAmbassadorTypeConfig } from '../lib/constants/ambassador-types-config';
import ToggleSwitch from './toggle-switch';

interface DiscountPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: DiscountPolicyResponse | null;
}

/** Parse a numeric input: empty => null */
const parseNullableInt = (value: string): number | null =>
  value === '' ? null : Number(value);

export default function DiscountPolicyModal({
  isOpen,
  onClose,
  policy,
}: DiscountPolicyModalProps) {
  const t = useTranslations('Dashboard.ambassadors');
  const tModal = useTranslations('Dashboard.ambassadors.modal');
  const tErrors = useTranslations('Dashboard.ambassadors.errors');

  const { form, onSubmit, isSubmitting } = useDiscountPolicyForm({
    policy,
    onClose,
  });

  if (!isOpen || !policy) return null;

  const config = getAmbassadorTypeConfig(policy.type);
  const Icon = config.icon;

  const inputClasses = (hasError: boolean) => `
    w-full h-12 px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-blueNormal'}
  `;

  const renderError = (message?: string) =>
    message ? (
      <span className="text-red-500 text-sm font-cairo-medium-sm">
        {tErrors(message || 'generic')}
      </span>
    ) : null;

  const renderHint = (text: string) => (
    <span className="text-greyLightActive text-xs font-cairo-regular-xs">{text}</span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl flex items-center justify-center ${config.iconClass}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="font-cairo-bold-xl text-greyDark">
                {tModal('title', { defaultValue: 'Edit Discount Policy' })}
              </h3>
              <p className="font-cairo-medium-sm text-greyNormal">
                {t(`types.${config.key}.name`, { defaultValue: policy.typeName })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="discount-policy-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            noValidate
          >
            {/* Active toggle */}
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-gray-50 px-4 py-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor="discount-policy-is-active"
                      className="font-cairo-semibold-base text-greyDarker cursor-pointer"
                    >
                      {tModal('isActive', { defaultValue: 'Policy active' })}
                    </label>
                    {renderHint(
                      tModal('isActiveHint', {
                        defaultValue: 'When disabled, this discount will not be applied to students.',
                      })
                    )}
                  </div>
                  <ToggleSwitch
                    id="discount-policy-is-active"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />

            {/* Percent */}
            <Controller
              name="percent"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="discount-policy-percent"
                    className="font-cairo-semibold-base text-greyDarker"
                  >
                    {tModal('percent', { defaultValue: 'Discount percentage' })} *
                  </label>
                  <div className="relative">
                    <input
                      id="discount-policy-percent"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      max={100}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={Number.isNaN(field.value) ? '' : field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? NaN : Number(e.target.value))
                      }
                      placeholder="10"
                      className={`${inputClasses(!!fieldState.error)} pe-11`}
                    />
                    <Percent className="absolute top-1/2 -translate-y-1/2 end-4 size-4 text-greyNormal pointer-events-none" />
                  </div>
                  {renderError(fieldState.error?.message)}
                </div>
              )}
            />

            {/* Min / Max items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['minItems', 'maxItems'] as const).map((name) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`discount-policy-${name}`}
                        className="font-cairo-semibold-base text-greyDarker"
                      >
                        {tModal(name, {
                          defaultValue: name === 'minItems' ? 'Minimum items' : 'Maximum items',
                        })}
                      </label>
                      <input
                        id={`discount-policy-${name}`}
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={0}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(parseNullableInt(e.target.value))}
                        placeholder={tModal('noLimitPlaceholder', { defaultValue: 'Leave empty for no limit' })}
                        className={inputClasses(!!fieldState.error)}
                      />
                      {renderError(fieldState.error?.message)}
                    </div>
                  )}
                />
              ))}
            </div>

            {/* Grant expiry days */}
            <Controller
              name="grantExpiryDays"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="discount-policy-grantExpiryDays"
                    className="font-cairo-semibold-base text-greyDarker"
                  >
                    {tModal('grantExpiryDays', { defaultValue: 'Grant expiry (days)' })}
                  </label>
                  <input
                    id="discount-policy-grantExpiryDays"
                    type="number"
                    inputMode="numeric"
                    step={1}
                    min={1}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(parseNullableInt(e.target.value))}
                    placeholder={tModal('neverExpiresPlaceholder', { defaultValue: 'Leave empty to never expire' })}
                    className={inputClasses(!!fieldState.error)}
                  />
                  {renderError(fieldState.error?.message) ??
                    renderHint(
                      tModal('grantExpiryDaysHint', {
                        defaultValue: 'Number of days the granted discount stays valid for the student.',
                      })
                    )}
                </div>
              )}
            />

            {/* Info note */}
            <div className="flex items-start gap-2 rounded-xl bg-blueLight/40 border border-blueNormal/10 px-4 py-3">
              <Info className="size-4 text-blueNormal shrink-0 mt-0.5" />
              <p className="font-cairo-regular-sm text-greyDarker">
                {tModal('note', {
                  defaultValue: 'Leave optional fields empty to remove the limit.',
                })}
              </p>
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
            {tModal('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            id="discount-policy-submit"
            type="submit"
            form="discount-policy-form"
            disabled={isSubmitting}
            className="bg-blueNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {tModal('saveChanges', { defaultValue: 'Save Changes' })}
          </button>
        </div>
      </div>
    </div>
  );
}
