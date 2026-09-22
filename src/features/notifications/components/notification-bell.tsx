'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import {
  useUnreadCountQuery,
  useMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../hooks/use-notifications-api';
import { getNotificationDestination } from '../lib/notification-routes';
import { getNotificationTypeLabel } from '../lib/notification-routes';
import { NotificationItem } from '../lib/types/notification-types';

/**
 * NotificationBell — Replaces the static bell in the navbar.
 * Shows unread count badge + dropdown with latest notifications.
 */
export default function NotificationBell() {
  const t = useTranslations('Notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ─── Queries ─── */
  const { data: unreadCount = 0 } = useUnreadCountQuery();
  const { data: notificationsData, isLoading } = useMyNotificationsQuery({
    page: 1,
    pageSize: 15,
  });

  /* ─── Mutations ─── */
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  const notifications = notificationsData?.items ?? [];

  /* ─── Close dropdown on outside click ─── */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ─── Handlers ─── */
  const handleNotificationClick = useCallback(
    async (notification: NotificationItem) => {
      if (!notification.isRead) {
        markAsReadMutation.mutate(notification.id);
      }
      setIsOpen(false);
      const destination = getNotificationDestination(notification);
      router.push(destination);
    },
    [markAsReadMutation, router]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  /* ─── Time ago helper ─── */
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return isRTL ? 'الآن' : 'Just now';
    if (minutes < 60) return isRTL ? `${minutes} د` : `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isRTL ? `${hours} س` : `${hours}h`;
    const days = Math.floor(hours / 24);
    return isRTL ? `${days} ي` : `${days}d`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ─── Bell Button ─── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full
                   hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-none"
        aria-label={t('bell', { defaultValue: 'Notifications' })}
      >
        <Bell className="size-5 text-greyDark" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 flex items-center justify-center
                           text-[10px] font-bold text-white bg-red-500 rounded-full leading-none
                           shadow-sm shadow-red-500/30 animate-in zoom-in duration-200">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ─── Dropdown Panel ─── */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 end-0 w-80 sm:w-96
                     bg-white rounded-2xl shadow-xl border border-black/10
                     z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-gray-50 to-white border-b border-black/5">
            <h3 className="font-cairo-bold-lg text-greyDark">
              {t('title', { defaultValue: 'Notifications' })}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-1.5 text-xs text-blueNormal hover:text-blueNormalHover
                           font-cairo-bold-sm cursor-pointer bg-transparent border-none disabled:opacity-50
                           transition-colors"
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="size-3.5" />
                )}
                {t('markAllRead', { defaultValue: 'Mark all read' })}
              </button>
            )}
          </div>

          {/* ── List ── */}
          <div className="max-h-80 overflow-y-auto divide-y divide-black/5">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="size-6 animate-spin text-blueNormal mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="size-10 text-greyLightActive mx-auto mb-3" />
                <p className="font-cairo-medium-sm text-greyNormal">
                  {t('empty', { defaultValue: 'No notifications yet' })}
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`flex gap-3 p-4 cursor-pointer hover:bg-black/[0.02] transition-colors ${
                    !item.isRead ? 'bg-blueLight/10' : ''
                  }`}
                >
                  {/* Unread indicator */}
                  <div className="shrink-0 mt-1.5">
                    {!item.isRead ? (
                      <span className="block w-2.5 h-2.5 rounded-full bg-blueNormal shadow-sm shadow-blueNormal/30" />
                    ) : (
                      <span className="block w-2.5 h-2.5 rounded-full bg-transparent" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-cairo-bold-sm text-greyDark line-clamp-1">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-greyLightActive whitespace-nowrap font-cairo-medium-xs shrink-0">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="font-cairo-medium-sm text-greyNormal mt-1 leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-cairo-bold-xs text-blueNormal bg-blueLight/30 px-2 py-0.5 rounded-full">
                      {getNotificationTypeLabel(item.type, isRTL)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Footer ── */}
          <div className="p-2 text-center bg-gray-50/50 border-t border-black/5">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/notifications');
              }}
              className="text-xs font-cairo-bold-sm text-blueNormal hover:text-blueNormalHover
                         cursor-pointer bg-transparent border-none transition-colors"
            >
              {t('viewAll', { defaultValue: 'View all notifications' })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
