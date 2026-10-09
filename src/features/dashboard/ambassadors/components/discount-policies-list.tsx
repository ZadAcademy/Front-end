"use client";

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BadgePercent, CheckCircle2, PauseCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetDiscountPoliciesQuery,
  useUpdateDiscountPolicyMutation,
} from '../hooks/use-ambassadors-api';
import { DiscountPolicyResponse } from '../lib/types/ambassador-types';
import DiscountPolicyCard from './discount-policy-card';
import DiscountPolicyModal from './discount-policy-modal';

export default function DiscountPoliciesList() {
  const t = useTranslations('Dashboard.ambassadors');

  const {
    data: policies = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetDiscountPoliciesQuery();
  const updateMutation = useUpdateDiscountPolicyMutation();

  /* ─── Modal state ─── */
  const [editingPolicy, setEditingPolicy] =
    useState<DiscountPolicyResponse | null>(null);

  /* ─── Which card is currently toggling ─── */
  const [togglingType, setTogglingType] = useState<number | null>(null);

  const sortedPolicies = useMemo(
    () => [...policies].sort((a, b) => a.type - b.type),
    [policies]
  );

  const activeCount = policies.filter((p) => p.isActive).length;

  /* ─── Handlers ─── */
  const handleToggleActive = (
    policy: DiscountPolicyResponse,
    isActive: boolean
  ) => {
    setTogglingType(policy.type);
    updateMutation.mutate(
      {
        type: policy.type,
        payload: {
          percent: policy.percent,
          isActive,
          minItems: policy.minItems,
          maxItems: policy.maxItems,
          grantExpiryDays: policy.grantExpiryDays,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            isActive
              ? t('toasts.activated', { defaultValue: 'Policy activated' })
              : t('toasts.deactivated', { defaultValue: 'Policy deactivated' })
          );
        },
        onError: (error) => {
          toast.error(
            error.message ||
              t('toasts.toggleFailed', { defaultValue: 'Failed to update policy status' })
          );
        },
        onSettled: () => setTogglingType(null),
      }
    );
  };

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 bg-white rounded-2xl border border-black/5 text-center">
        <p className="text-red-500 font-cairo-medium-base">
          {t('error', { defaultValue: 'Failed to load discount policies' })}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blueNormal text-white font-cairo-bold-sm hover:bg-blueNormalHover transition-colors cursor-pointer"
        >
          <RefreshCw className="size-4" />
          {t('retry', { defaultValue: 'Retry' })}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Hero header ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blueNormal to-indigo-600 p-6 sm:p-8 text-white shadow-md">
        <div className="absolute -top-16 -end-16 size-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-10 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
              <BadgePercent className="size-7" />
            </div>
            <div>
              <h1 className="font-cairo-bold-2xl">
                {t('title', { defaultValue: 'Zad Ambassadors' })}
              </h1>
              <p className="font-cairo-regular-base text-white/80 mt-1 max-w-xl">
                {t('subtitle', {
                  defaultValue: 'Manage the discount policies granted through the ambassadors program.',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur px-4 py-2.5">
              <CheckCircle2 className="size-5 text-emerald-300" />
              <div className="flex flex-col leading-tight">
                <span className="font-cairo-bold-lg">{activeCount}</span>
                <span className="font-cairo-regular-xs text-white/75">
                  {t('stats.active', { defaultValue: 'Active' })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur px-4 py-2.5">
              <PauseCircle className="size-5 text-white/70" />
              <div className="flex flex-col leading-tight">
                <span className="font-cairo-bold-lg">{policies.length - activeCount}</span>
                <span className="font-cairo-regular-xs text-white/75">
                  {t('stats.inactive', { defaultValue: 'Inactive' })}
                </span>
              </div>
            </div>
            <button
              id="ambassador-policies-refresh"
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title={t('refresh', { defaultValue: 'Refresh' })}
              className="size-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`size-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Policies grid ─── */}
      {sortedPolicies.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-black/5 text-center text-greyNormal font-cairo-medium-base">
          {t('empty', { defaultValue: 'No discount policies found.' })}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sortedPolicies.map((policy) => (
            <DiscountPolicyCard
              key={policy.id}
              policy={policy}
              onEdit={setEditingPolicy}
              onToggleActive={handleToggleActive}
              isToggling={togglingType === policy.type}
            />
          ))}
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editingPolicy && (
        <DiscountPolicyModal
          isOpen={!!editingPolicy}
          onClose={() => setEditingPolicy(null)}
          policy={editingPolicy}
        />
      )}
    </div>
  );
}
