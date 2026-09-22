/* ─── Notification Types & Interfaces ─── */

export enum NotificationType {
  EnrollmentExpiry = 0,
  NewCoursePublished = 1,
  Announcement = 2,
  NewLessonAdded = 3,
  ReviewThankYou = 4,
  Welcome = 5,
  PriceAlert = 6,
  AdminCustom = 7,
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  isEnabled: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/* ─── Query Params ─── */
export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
}

export interface GetAdminHistoryParams {
  page?: number;
  pageSize?: number;
  type?: NotificationType;
}

/* ─── Admin Send ─── */
export interface SendNotificationRequest {
  title: string;
  message: string;
  type?: NotificationType;
  targetCourseId?: string | null;
  targetUserIds?: string[] | null;
}

export interface SendNotificationResponse {
  notificationId: string;
  recipientCount: number;
}

/* ─── Admin History ─── */
export interface AdminNotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId: string | null;
  sentAt: string;
  recipientCount: number;
}

/* ─── Expiry Management ─── */
export interface ExpiringEnrollmentItem {
  userId: string;
  userName: string;
  email: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  expiresAt: string;
  daysRemaining: number;
}

/* ─── Price Alert ─── */
export interface SendPriceAlertRequest {
  courseId: string;
  customMessage?: string | null;
}

export interface SendPriceAlertResponse {
  notificationId: string;
  recipientCount: number;
}
