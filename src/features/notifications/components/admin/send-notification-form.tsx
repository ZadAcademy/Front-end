'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Send, Loader2, ChevronDown } from 'lucide-react';
import { useSendNotificationMutation } from '../../hooks/use-admin-notifications-api';
import { NotificationType } from '../../lib/types/notification-types';
import { getNotificationTypeLabel } from '../../lib/notification-routes';

export default function SendNotificationForm() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const sendMutation = useSendNotificationMutation();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>(NotificationType.Announcement);
  const [targetMode, setTargetMode] = useState<'all' | 'course' | 'users'>('all');
  const [targetCourseId, setTargetCourseId] = useState('');
  const [targetUserIds, setTargetUserIds] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendMutation.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        type,
        targetCourseId: targetMode === 'course' ? targetCourseId.trim() || null : null,
        targetUserIds:
          targetMode === 'users'
            ? targetUserIds
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean)
            : null,
      },
      {
        onSuccess: () => {
          setTitle('');
          setMessage('');
          setTargetCourseId('');
          setTargetUserIds('');
        },
      }
    );
  };

  const typeOptions = Object.values(NotificationType)
    .filter((v) => typeof v === 'number')
    .map((v) => ({
      value: v as NotificationType,
      label: getNotificationTypeLabel(v as NotificationType, isRTL),
    }));

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-5">
      <h3 className="font-cairo-bold-xl text-greyDark">
        {t('sendTitle', { defaultValue: 'Send Notification' })}
      </h3>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('notifTitle', { defaultValue: 'Title' })}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('titlePlaceholder', { defaultValue: 'Notification title...' })}
          required
          className="h-11 px-4 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                     outline-none focus:border-blueNormal transition-colors"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('message', { defaultValue: 'Message' })}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder', { defaultValue: 'Write the notification message...' })}
          required
          rows={4}
          className="px-4 py-3 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                     outline-none focus:border-blueNormal transition-colors resize-none"
        />
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('type', { defaultValue: 'Type' })}
        </label>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(Number(e.target.value) as NotificationType)}
            className="w-full h-11 px-4 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                       outline-none focus:border-blueNormal transition-colors appearance-none cursor-pointer"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 size-4 text-greyNormal pointer-events-none`} />
        </div>
      </div>

      {/* Target Mode */}
      <div className="flex flex-col gap-1.5">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('target', { defaultValue: 'Send To' })}
        </label>
        <div className="flex gap-2">
          {(['all', 'course', 'users'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTargetMode(mode)}
              className={`px-4 py-2 rounded-xl font-cairo-bold-sm transition-all cursor-pointer border-none ${
                targetMode === mode
                  ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20'
                  : 'bg-black/5 text-greyNormal hover:bg-black/10'
              }`}
            >
              {mode === 'all'
                ? t('targetAll', { defaultValue: 'All Users' })
                : mode === 'course'
                ? t('targetCourse', { defaultValue: 'Course Students' })
                : t('targetUsers', { defaultValue: 'Specific Users' })}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional target inputs */}
      {targetMode === 'course' && (
        <div className="flex flex-col gap-1.5">
          <label className="font-cairo-bold-sm text-greyDark">
            {t('courseId', { defaultValue: 'Course ID' })}
          </label>
          <input
            type="text"
            value={targetCourseId}
            onChange={(e) => setTargetCourseId(e.target.value)}
            placeholder={t('courseIdPlaceholder', { defaultValue: 'Enter course ID...' })}
            required
            className="h-11 px-4 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                       outline-none focus:border-blueNormal transition-colors"
          />
        </div>
      )}

      {targetMode === 'users' && (
        <div className="flex flex-col gap-1.5">
          <label className="font-cairo-bold-sm text-greyDark">
            {t('userIds', { defaultValue: 'User IDs (comma separated)' })}
          </label>
          <textarea
            value={targetUserIds}
            onChange={(e) => setTargetUserIds(e.target.value)}
            placeholder={t('userIdsPlaceholder', {
              defaultValue: 'e.g. uuid-1, uuid-2, uuid-3',
            })}
            required
            rows={2}
            className="px-4 py-3 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                       outline-none focus:border-blueNormal transition-colors resize-none font-mono text-xs"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={sendMutation.isPending || !title.trim() || !message.trim()}
        className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-blueNormal text-white
                   font-cairo-bold-base hover:bg-blueNormalHover transition-colors shadow-lg shadow-blueNormal/20
                   cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sendMutation.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Send className="size-5" />
        )}
        {t('send', { defaultValue: 'Send Notification' })}
      </button>
    </form>
  );
}
