'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Play, Loader2, CalendarClock, AlertTriangle } from 'lucide-react';
import { useTriggerExpiryMutation, usePreviewExpiryQuery } from '../../hooks/use-admin-notifications-api';
import { ConfirmModal } from './confirm-modal';

export default function ExpiryManagement() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [days, setDays] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: previewData, isLoading: isPreviewLoading, isError: isPreviewError } = usePreviewExpiryQuery(days);
  const triggerMutation = useTriggerExpiryMutation();

  const handleTrigger = () => {
    setIsModalOpen(true);
  };

  const confirmTrigger = () => {
    triggerMutation.mutate(undefined, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
            <CalendarClock className="size-6 text-amber-500" />
          </div>
          <div>
            <h3 className="font-cairo-bold-xl text-greyDark">
              {t('expiryTitle', { defaultValue: 'Enrollment Expiry Check' })}
            </h3>
            <p className="font-cairo-medium-sm text-greyNormal max-w-xl mt-1">
              {t('expiryDesc', { defaultValue: 'Trigger the background job to check for expiring enrollments (6 months limit), send warning notifications, and deactivate expired ones.' })}
            </p>
          </div>
        </div>

        <button
          onClick={handleTrigger}
          disabled={triggerMutation.isPending}
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white
                     font-cairo-bold-base hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20
                     cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {triggerMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-5" />}
          {t('triggerCheck', { defaultValue: 'Run Expiry Check' })}
        </button>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="p-5 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
          <h4 className="font-cairo-bold-lg text-greyDark">
            {t('previewUpcoming', { defaultValue: 'Preview Upcoming Expirations' })}
          </h4>
          <div className="flex items-center gap-2">
            <label className="font-cairo-medium-sm text-greyNormal">
              {t('withinDays', { defaultValue: 'Within Days:' })}
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="h-9 px-3 rounded-lg border border-black/10 bg-white font-cairo-bold-sm text-greyDarker
                         outline-none focus:border-blueNormal transition-colors cursor-pointer"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={7}>7</option>
              <option value={14}>14</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-black/5 border-b border-black/5 font-cairo-bold-sm text-greyDark">
              <tr>
                <th className="px-5 py-3 text-start whitespace-nowrap">{t('user', { defaultValue: 'User' })}</th>
                <th className="px-5 py-3 text-start whitespace-nowrap">{t('course', { defaultValue: 'Course' })}</th>
                <th className="px-5 py-3 text-start whitespace-nowrap">{t('enrolledAt', { defaultValue: 'Enrolled' })}</th>
                <th className="px-5 py-3 text-start whitespace-nowrap">{t('expiresAt', { defaultValue: 'Expires' })}</th>
                <th className="px-5 py-3 text-center whitespace-nowrap">{t('daysRemaining', { defaultValue: 'Days Left' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-cairo-medium-sm text-greyDarker">
              {isPreviewLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="size-6 animate-spin text-blueNormal mx-auto" />
                  </td>
                </tr>
              ) : isPreviewError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                    {t('previewError', { defaultValue: 'Failed to load preview data.' })}
                  </td>
                </tr>
              ) : previewData?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-greyNormal">
                    {t('noExpirations', { defaultValue: 'No enrollments expiring in this timeframe.' })}
                  </td>
                </tr>
              ) : (
                previewData?.map((item, idx) => (
                  <tr key={`${item.userId}-${item.courseId}-${idx}`} className="hover:bg-black/5 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-cairo-bold-sm text-greyDark">{item.userName}</span>
                        <span className="text-xs text-greyNormal">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-cairo-bold-sm text-blueNormal max-w-[200px] truncate">
                      {item.courseTitle}
                    </td>
                    <td className="px-5 py-3 text-greyNormal">{formatDate(item.enrolledAt)}</td>
                    <td className="px-5 py-3 font-cairo-bold-sm text-amber-600">{formatDate(item.expiresAt)}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-cairo-bold-sm">
                        <AlertTriangle className="size-3" />
                        {item.daysRemaining}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmTrigger}
        title={t('expiryTitle', { defaultValue: 'Enrollment Expiry Check' })}
        message={t('confirmTrigger', { defaultValue: 'This will check all enrollments, send expiration notices, and deactivate expired ones. Proceed?' })}
        confirmText={t('triggerCheck', { defaultValue: 'Run Expiry Check' })}
        cancelText={t('cancel', { defaultValue: 'Cancel' })}
        isLoading={triggerMutation.isPending}
      />
    </div>
  );
}
