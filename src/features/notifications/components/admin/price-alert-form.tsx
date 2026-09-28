'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BadgeDollarSign, Loader2 } from 'lucide-react';
import { useSendPriceAlertMutation } from '../../hooks/use-admin-notifications-api';
import { MetadataItem } from '@/shared/lib/types/metadata-types';
import { CourseSelector } from '@/shared/components/selectors/course-selector';

export default function PriceAlertForm() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const sendMutation = useSendPriceAlertMutation();

  const [selectedCourse, setSelectedCourse] = useState<MetadataItem | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    sendMutation.mutate(
      {
        courseId: selectedCourse.id,
        customMessage: customMessage.trim() || null,
      },
      {
        onSuccess: () => {
          setSelectedCourse(null);
          setCustomMessage('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 lg:p-8 flex flex-col gap-6 mb-32">
      <div className="flex items-center gap-3 pb-4 border-b border-black/5">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
          <BadgeDollarSign className="size-5 text-green-600" />
        </div>
        <h3 className="font-cairo-bold-xl text-greyDark">
          {t('priceAlertTitle', { defaultValue: 'Send Price Alert' })}
        </h3>
      </div>

      {/* Course Search Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('selectCourse', { defaultValue: 'Select Course' })}
        </label>
        
        <CourseSelector value={selectedCourse} onChange={setSelectedCourse} t={t} />
      </div>

      {/* Custom Message */}
      <div className="flex flex-col gap-2">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('customMessage', { defaultValue: 'Custom Message (Optional)' })}
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder={t('customMessagePlaceholder', { defaultValue: 'Add an optional message along with the alert...' })}
          rows={3}
          className="px-4 py-3 rounded-xl border border-black/10 bg-gray-50 font-cairo-medium-base text-greyDarker
                     outline-none focus:border-blueNormal focus:bg-white focus:ring-4 focus:ring-blueNormal/10 transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <div className="pt-2 border-t border-black/5">
        <button
          type="submit"
          disabled={sendMutation.isPending || !selectedCourse}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-600 text-white
                     font-cairo-bold-base hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20
                     cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendMutation.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <BadgeDollarSign className="size-5" />
          )}
          {t('sendAlert', { defaultValue: 'Send Alert' })}
        </button>
      </div>
    </form>
  );
}
