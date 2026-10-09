"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Pencil, Hash, CalendarClock, UserCheck } from 'lucide-react';
import { DiscountPolicyResponse } from '../lib/types/ambassador-types';
import { getAmbassadorTypeConfig } from '../lib/constants/ambassador-types-config';
import ToggleSwitch from './toggle-switch';

interface DiscountPolicyCardProps {
  policy: DiscountPolicyResponse;
  onEdit: (policy: DiscountPolicyResponse) => void;
  onToggleActive: (policy: DiscountPolicyResponse, isActive: boolean) => void;
  isToggling: boolean;
}

export default function DiscountPolicyCard({
  policy,
  onEdit,
  onToggleActive,
  isToggling,
}: DiscountPolicyCardProps) {
  const t = useTranslations('Dashboard.ambassadors');
  const locale = useLocale();
  const config = getAmbassadorTypeConfig(policy.type);
  const Icon = config.icon;

  const lastUpdate = policy.updatedAt ?? policy.createdAt;
  const formattedDate = lastUpdate
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(lastUpdate))
    : null;

  const noLimit = t('card.noLimit', { defaultValue: 'No limit' });

  const details = [
    {
      key: 'minItems',
      icon: Hash,
      label: t('card.minItems', { defaultValue: 'Min items' }),
      value: policy.minItems ?? noLimit,
      muted: policy.minItems == null,
    },
    {
      key: 'maxItems',
      icon: Hash,
      label: t('card.maxItems', { defaultValue: 'Max items' }),
      value: policy.maxItems ?? noLimit,
      muted: policy.maxItems == null,
    },
    {
      key: 'grantExpiryDays',
      icon: CalendarClock,
      label: t('card.grantExpiryDays', { defaultValue: 'Grant expiry' }),
      value:
        policy.grantExpiryDays != null
          ? t('card.days', {
              count: policy.grantExpiryDays,
              defaultValue: `${policy.grantExpiryDays} days`,
            })
          : t('card.never', { defaultValue: 'Never expires' }),
      muted: policy.grantExpiryDays == null,
    },
  ];

  return (
    <article
      id={`ambassador-policy-${policy.type}`}
      className={`
        group relative flex flex-col bg-white rounded-2xl border border-black/5 shadow-sm
        overflow-hidden transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
        ${policy.isActive ? '' : 'opacity-90'}
      `}
    >
      <div className="flex flex-col gap-5 p-6 flex-1">
        {/* ─── Header ─── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconClass}`}>
              <Icon className="size-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-cairo-bold-lg text-greyDark truncate">
                {t(`types.${config.key}.name`, { defaultValue: policy.typeName })}
              </h3>
              <p className="font-cairo-regular-sm text-greyNormal leading-relaxed mt-0.5">
                {t(`types.${config.key}.description`, { defaultValue: '' })}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <ToggleSwitch
              id={`ambassador-policy-toggle-${policy.type}`}
              checked={policy.isActive}
              isLoading={isToggling}
              onChange={(checked) => onToggleActive(policy, checked)}
              ariaLabel={t('card.toggleActive', { defaultValue: 'Toggle active' })}
            />
            <span
              className={`text-xs font-cairo-bold-sm ${
                policy.isActive ? 'text-emerald-600' : 'text-greyNormal'
              }`}
            >
              {policy.isActive
                ? t('status.active', { defaultValue: 'Active' })
                : t('status.inactive', { defaultValue: 'Inactive' })}
            </span>
          </div>
        </div>

        {/* ─── Percent ─── */}
        <div className="flex items-end gap-2">
          <span
            className={`font-cairo-bold-4xl leading-none bg-gradient-to-r ${config.accentClass} bg-clip-text text-transparent ${
              policy.isActive ? '' : 'grayscale'
            }`}
            dir="ltr"
          >
            {policy.percent}%
          </span>
          <span className="font-cairo-medium-sm text-greyNormal pb-1">
            {t('card.discount', { defaultValue: 'discount' })}
          </span>
        </div>

        {/* ─── Details ─── */}
        <div className="grid grid-cols-3 gap-3">
          {details.map((d) => (
            <div
              key={d.key}
              className="flex flex-col gap-1 rounded-xl bg-gray-50 border border-black/5 px-3 py-2.5"
            >
              <span className="flex items-center gap-1 font-cairo-medium-xs text-greyNormal">
                <d.icon className="size-3" />
                {d.label}
              </span>
              <span
                className={`font-cairo-bold-sm truncate ${
                  d.muted ? 'text-greyLightActive' : 'text-greyDark'
                }`}
              >
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-black/5 bg-gray-50/60">
        <div className="flex items-center gap-1.5 min-w-0 text-xs font-cairo-regular-sm text-greyNormal">
          <UserCheck className="size-3.5 shrink-0" />
          <span className="truncate">
            {policy.lastUpdatedByName
              ? t('card.lastUpdatedBy', {
                  name: policy.lastUpdatedByName,
                  defaultValue: `Updated by ${policy.lastUpdatedByName}`,
                })
              : t('card.neverUpdated', { defaultValue: 'Not updated yet' })}
            {formattedDate && <span className="text-greyLightActive"> · {formattedDate}</span>}
          </span>
        </div>

        <button
          id={`ambassador-policy-edit-${policy.type}`}
          type="button"
          onClick={() => onEdit(policy)}
          className="flex items-center gap-1.5 px-4 py-2 text-blueNormal bg-blueNormal/10 rounded-lg font-cairo-bold-sm hover:bg-blueNormal hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <Pencil className="size-3.5" />
          {t('card.edit', { defaultValue: 'Edit' })}
        </button>
      </div>
    </article>
  );
}
