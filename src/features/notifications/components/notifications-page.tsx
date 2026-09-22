'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Bell, Trash2, Check, Loader2, Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import {
  useMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useNotificationPreferencesQuery,
  useUpdatePreferencesMutation,
} from '../hooks/use-notifications-api';
import { getNotificationDestination, getNotificationTypeLabel } from '../lib/notification-routes';
import { NotificationItem } from '../lib/types/notification-types';

export default function NotificationsPage() {
  const t = useTranslations('Notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  /* ─── State ─── */
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const pageSize = 10;

  /* ─── Queries ─── */
  const isReadParam = filter === 'all' ? undefined : filter === 'read';
  const { data: notificationsData, isLoading } = useMyNotificationsQuery({
    page: currentPage,
    pageSize,
    isRead: isReadParam,
  });
  const { data: preferences } = useNotificationPreferencesQuery();

  /* ─── Mutations ─── */
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllMutation = useMarkAllAsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();
  const updatePrefsMutation = useUpdatePreferencesMutation();

  const notifications = notificationsData?.items ?? [];
  const totalPages = notificationsData?.totalPages ?? 1;

  /* ─── Handlers ─── */
  const handleClick = useCallback(
    (notification: NotificationItem) => {
      if (!notification.isRead) {
        markAsReadMutation.mutate(notification.id);
      }
      const dest = getNotificationDestination(notification);
      router.push(dest);
    },
    [markAsReadMutation, router]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleMarkRead = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation]
  );

  /* ─── Time formatting ─── */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterTabs = [
    { key: 'all' as const, label: t('filterAll', { defaultValue: 'All' }) },
    { key: 'unread' as const, label: t('filterUnread', { defaultValue: 'Unread' }) },
    { key: 'read' as const, label: t('filterRead', { defaultValue: 'Read' }) },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 pb-20 pt-24 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent shrink-0"
              title="Go back"
            >
              {isRTL ? <ArrowRight className="size-5 text-greyDark" /> : <ArrowLeft className="size-5 text-greyDark" />}
            </button>
            <div className="w-12 h-12 rounded-2xl bg-blueNormal/10 flex items-center justify-center shrink-0">
              <Bell className="size-6 text-blueNormal" />
            </div>
            <div>
              <h1 className="font-cairo-bold-2xl text-greyDark">
                {t('pageTitle', { defaultValue: 'Notifications' })}
              </h1>
              <p className="font-cairo-medium-sm text-greyNormal">
                {t('pageSubtitle', { defaultValue: 'Stay updated with your latest activity' })}
              </p>
            </div>
          </div>

          {/* Preferences toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blueNormal/10 text-blueNormal
                         font-cairo-bold-sm hover:bg-blueNormal/20 transition-colors cursor-pointer border-none
                         disabled:opacity-50"
            >
              {markAllMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {t('markAllRead', { defaultValue: 'Mark all read' })}
            </button>

            {/* Notification toggle */}
            {preferences && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                <span className="font-cairo-semibold-sm text-greyDark">
                  {t('receiveNotifications', { defaultValue: 'Receive Notifications' })}
                </span>
                <button
                  onClick={() => updatePrefsMutation.mutate(!preferences.isEnabled)}
                  disabled={updatePrefsMutation.isPending}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 cursor-pointer border-none ${
                    preferences.isEnabled ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.isEnabled}
                >
                  <span
                    className={`absolute inline-block h-4 w-4 rounded-full bg-white transition-all shadow-sm ${
                      preferences.isEnabled ? 'start-[26px]' : 'start-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Filter Tabs ─── */}
        <div className="flex items-center gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-cairo-bold-sm transition-all cursor-pointer border-none ${filter === tab.key
                  ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20'
                  : 'bg-white text-greyNormal hover:bg-black/5 border border-black/5'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── List ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="size-8 animate-spin text-blueNormal mx-auto" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="size-12 text-greyLightActive mx-auto mb-4" />
              <p className="font-cairo-medium-lg text-greyNormal">
                {t('noNotifications', { defaultValue: 'No notifications to show' })}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`flex items-start gap-4 p-5 cursor-pointer hover:bg-black/[0.02] transition-colors group ${!item.isRead ? 'bg-blueLight/5' : ''
                    }`}
                >
                  {/* Unread dot */}
                  <div className="shrink-0 mt-2">
                    {!item.isRead ? (
                      <span className="block w-3 h-3 rounded-full bg-blueNormal shadow-sm shadow-blueNormal/30" />
                    ) : (
                      <span className="block w-3 h-3 rounded-full bg-greyLightActive/30" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-cairo-bold-base text-greyDark line-clamp-1 ${!item.isRead ? '' : 'opacity-70'
                        }`}>
                        {item.title}
                      </h3>
                      <span className="text-xs text-greyLightActive whitespace-nowrap font-cairo-medium-xs shrink-0 mt-0.5">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="font-cairo-medium-sm text-greyNormal mt-1.5 leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-cairo-bold-xs text-blueNormal bg-blueLight/30 px-2.5 py-0.5 rounded-full">
                      {getNotificationTypeLabel(item.type, isRTL)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!item.isRead && (
                      <button
                        onClick={(e) => handleMarkRead(e, item.id)}
                        className="p-2 text-blueNormal bg-blueNormal/10 rounded-lg hover:bg-blueNormal hover:text-white
                                   transition-colors cursor-pointer border-none"
                        title={t('markRead', { defaultValue: 'Mark as read' })}
                      >
                        <Check className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-500 hover:text-white
                                 transition-colors cursor-pointer border-none disabled:opacity-50"
                      title={t('delete', { defaultValue: 'Delete' })}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5
                         font-cairo-medium-sm text-greyDark hover:bg-black/5 transition-colors
                         cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              {t('prev', { defaultValue: 'Previous' })}
            </button>
            <span className="font-cairo-bold-sm text-greyDark">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5
                         font-cairo-medium-sm text-greyDark hover:bg-black/5 transition-colors
                         cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('next', { defaultValue: 'Next' })}
              {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
