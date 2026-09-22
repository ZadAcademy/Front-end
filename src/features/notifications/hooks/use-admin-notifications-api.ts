import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  sendNotification,
  getAdminHistory,
  adminDeleteNotification,
  triggerEnrollmentExpiry,
  previewEnrollmentExpiry,
  sendPriceAlert,
} from '../api/admin-notifications-api';
import {
  GetAdminHistoryParams,
  SendNotificationRequest,
  SendPriceAlertRequest,
} from '../lib/types/notification-types';

/* ─── Query Keys ─── */
export const adminNotificationKeys = {
  all: ['admin-notifications'] as const,
  history: (params?: GetAdminHistoryParams) =>
    ['admin-notifications', 'history', params] as const,
  expiryPreview: (days: number) =>
    ['admin-notifications', 'expiry-preview', days] as const,
};

/* ──────────────────────────────────────────────────────────
   Send Notification (broadcast or targeted)
   ────────────────────────────────────────────────────────── */
export const useSendNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendNotificationRequest) => sendNotification(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
      toast.success(`Notification sent to ${result.recipientCount} user(s)`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send notification');
    },
  });
};

/* ──────────────────────────────────────────────────────────
   Admin Notification History
   ────────────────────────────────────────────────────────── */
export const useAdminHistoryQuery = (params?: GetAdminHistoryParams) => {
  return useQuery({
    queryKey: adminNotificationKeys.history(params),
    queryFn: () => getAdminHistory(params),
  });
};

/* ──────────────────────────────────────────────────────────
   Admin Delete Notification
   ────────────────────────────────────────────────────────── */
export const useAdminDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId?: string }) =>
      adminDeleteNotification(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
      toast.success('Notification deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete notification');
    },
  });
};

/* ──────────────────────────────────────────────────────────
   Trigger Enrollment Expiry Check
   ────────────────────────────────────────────────────────── */
export const useTriggerExpiryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => triggerEnrollmentExpiry(),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
      toast.success(`Expiry check complete. ${count} action(s) taken.`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to trigger expiry check');
    },
  });
};

/* ──────────────────────────────────────────────────────────
   Preview Upcoming Expirations
   ────────────────────────────────────────────────────────── */
export const usePreviewExpiryQuery = (days = 7, enabled = true) => {
  return useQuery({
    queryKey: adminNotificationKeys.expiryPreview(days),
    queryFn: () => previewEnrollmentExpiry(days),
    enabled,
  });
};

/* ──────────────────────────────────────────────────────────
   Send Price Alert
   ────────────────────────────────────────────────────────── */
export const useSendPriceAlertMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendPriceAlertRequest) => sendPriceAlert(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
      toast.success(`Price alert sent to ${result.recipientCount} user(s)`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send price alert');
    },
  });
};
