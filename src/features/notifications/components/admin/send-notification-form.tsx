'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Send, Loader2, Users, BookOpen, UserPlus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSendNotificationMutation } from '../../hooks/use-admin-notifications-api';
import { NotificationType } from '../../lib/types/notification-types';
import { CourseSelector } from '@/shared/components/selectors/course-selector';
import { UserMultiSelector } from '@/shared/components/selectors/user-multi-selector';
import { sendNotificationSchema, SendNotificationFormValues } from '../../lib/schemas/send-notification-schema';

/* ════════════════════════════════════════════════════════════
   Main Send Notification Form
   ════════════════════════════════════════════════════════════ */
export default function SendNotificationForm() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const sendMutation = useSendNotificationMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      message: '',
      targetMode: 'all',
      selectedCourse: null,
      selectedUsers: [],
    },
  });

  const targetMode = watch('targetMode');

  const onSubmit = (data: SendNotificationFormValues) => {
    const payload: any = {
      title: data.title.trim(),
      message: data.message.trim(),
      type: 2, // 2 = Announcement
      broadcastToAll: data.targetMode === 'all',
    };

    if (data.targetMode === 'course' && data.selectedCourse?.id) {
      payload.targetCourseId = data.selectedCourse.id;
    }
    if (data.targetMode === 'users' && data.selectedUsers?.length) {
      payload.targetUserIds = data.selectedUsers.map((u: any) => u.id);
    }

    sendMutation.mutate(
      payload,
      {
        onSuccess: (result) => {
          toast.success(t('notificationSentCount', { 
            count: result.recipientCount.toString(), 
            defaultValue: `Notification sent to ${result.recipientCount} user(s)` 
          }));
          reset();
        },
      }
    );
  };

  const targetModes = [
    { key: 'all' as const, icon: Users, label: t('targetAll', { defaultValue: 'All Users' }) },
    { key: 'course' as const, icon: BookOpen, label: t('targetCourse', { defaultValue: 'Course Students' }) },
    { key: 'users' as const, icon: UserPlus, label: t('targetUsers', { defaultValue: 'Specific Users' }) },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 lg:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-black/5">
        <div className="w-10 h-10 bg-blueLight/30 rounded-xl flex items-center justify-center shrink-0">
          <Send className="size-5 text-blueNormal" />
        </div>
        <div>
          <h3 className="font-cairo-bold-xl text-greyDark">
            {t('sendTitle', { defaultValue: 'Send Notification' })}
          </h3>
          <p className="font-cairo-medium-xs text-greyNormal mt-0.5">
            {t('sendSubtitle', { defaultValue: 'Compose and send a notification to your users.' })}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('notifTitle', { defaultValue: 'Title' })}
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder={t('titlePlaceholder', { defaultValue: 'Notification title...' })}
          className={`h-12 px-4 rounded-xl border bg-gray-50 font-cairo-medium-sm text-greyDarker
                     outline-none focus:bg-white focus:ring-4 transition-all ${
                       errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal/10'
                     }`}
        />
        {errors.title && <p className="text-red-500 text-xs font-cairo-bold-sm">{errors.title.message}</p>}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('message', { defaultValue: 'Message' })}
        </label>
        <textarea
          {...register('message')}
          placeholder={t('messagePlaceholder', { defaultValue: 'Write the notification message...' })}
          rows={4}
          className={`px-4 py-3 rounded-xl border bg-gray-50 font-cairo-medium-sm text-greyDarker
                     outline-none focus:bg-white focus:ring-4 transition-all resize-none ${
                       errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal/10'
                     }`}
        />
        {errors.message && <p className="text-red-500 text-xs font-cairo-bold-sm">{errors.message.message}</p>}
      </div>

      {/* Target Mode */}
      <div className="flex flex-col gap-3">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('target', { defaultValue: 'Send To' })}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {targetModes.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setValue('targetMode', key, { shouldValidate: true });
                if (key !== 'course') setValue('selectedCourse', null, { shouldValidate: true });
                if (key !== 'users') setValue('selectedUsers', [], { shouldValidate: true });
              }}
              className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl font-cairo-bold-sm transition-all cursor-pointer border-2 ${targetMode === key
                ? 'bg-blueLight/20 border-blueNormal text-blueNormal shadow-sm'
                : 'bg-gray-50 border-transparent text-greyNormal hover:bg-gray-100'
                }`}
            >
              <Icon className="size-5" />
              <span className="text-xs text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional target inputs */}
      {targetMode === 'course' && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="font-cairo-bold-sm text-greyDark">
            {t('selectCourse', { defaultValue: 'Select Course' })}
          </label>
          <Controller
            control={control}
            name="selectedCourse"
            render={({ field: { value, onChange } }) => (
              <CourseSelector value={value} onChange={onChange} t={t} />
            )}
          />
          {errors.selectedCourse?.message && <p className="text-red-500 text-xs font-cairo-bold-sm">{errors.selectedCourse.message as string}</p>}
        </div>
      )}

      {targetMode === 'users' && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="font-cairo-bold-sm text-greyDark">
            {t('selectUsers', { defaultValue: 'Select Users' })}
          </label>
          <Controller
            control={control}
            name="selectedUsers"
            render={({ field: { value, onChange } }) => (
              <UserMultiSelector value={value || []} onChange={onChange} t={t} />
            )}
          />
          {errors.selectedUsers?.message && <p className="text-red-500 text-xs font-cairo-bold-sm">{errors.selectedUsers.message as string}</p>}
        </div>
      )}

      {/* Submit */}
      <div className="pt-2 border-t border-black/5">
        <button
          type="submit"
          disabled={sendMutation.isPending || !isValid}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blueNormal text-white
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
      </div>
    </form>
  );
}
