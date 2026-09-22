import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../api/notifications-api';
import { GetNotificationsParams } from '../lib/types/notification-types';

/* ─── Query Keys ─── */
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: GetNotificationsParams) => ['notifications', 'list', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
  preferences: ['notifications', 'preferences'] as const,
};

/* ──────────────────────────────────────────────────────────
   Paginated notifications list
   ────────────────────────────────────────────────────────── */
export const useMyNotificationsQuery = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getMyNotifications(params),
  });
};

/* ──────────────────────────────────────────────────────────
   Unread count — polls every 60s for real-time badge
   ────────────────────────────────────────────────────────── */
export const useUnreadCountQuery = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: () => getUnreadCount(),
    refetchInterval: 60_000, // poll every 60 seconds
    refetchIntervalInBackground: false,
  });
};

/* ──────────────────────────────────────────────────────────
   Mark single notification as read
   ────────────────────────────────────────────────────────── */
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/* ──────────────────────────────────────────────────────────
   Mark all notifications as read
   ────────────────────────────────────────────────────────── */
export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/* ──────────────────────────────────────────────────────────
   Delete a notification
   ────────────────────────────────────────────────────────── */
export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/* ──────────────────────────────────────────────────────────
   Notification Preferences
   ────────────────────────────────────────────────────────── */
export const useNotificationPreferencesQuery = () => {
  return useQuery({
    queryKey: notificationKeys.preferences,
    queryFn: () => getNotificationPreferences(),
  });
};

export const useUpdatePreferencesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isEnabled: boolean) => updateNotificationPreferences(isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.preferences,
      });
    },
  });
};
