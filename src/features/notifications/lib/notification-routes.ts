import { NotificationItem, NotificationType } from './types/notification-types';

/**
 * Resolves the destination URL when a user clicks a notification.
 * Uses type + referenceId to build the appropriate Next.js route.
 */
export function getNotificationDestination(notification: NotificationItem): string {
  const { type, referenceId } = notification;

  switch (type) {
    case NotificationType.NewCoursePublished:
    case NotificationType.PriceAlert:
    case NotificationType.ReviewThankYou:
    case NotificationType.NewLessonAdded:
    case NotificationType.EnrollmentExpiry:
      return referenceId ? `/courses/${referenceId}` : '/courses';

    case NotificationType.Announcement:
      return referenceId ? `/posts/${referenceId}` : '/posts';

    case NotificationType.Welcome:
    case NotificationType.AdminCustom:
    default:
      return referenceId ? `/courses/${referenceId}` : '/courses';
  }
}

/**
 * Returns a user-friendly label for the notification type.
 */
export function getNotificationTypeLabel(type: NotificationType, isArabic: boolean): string {
  const labels: Record<NotificationType, { ar: string; en: string }> = {
    [NotificationType.EnrollmentExpiry]: { ar: 'انتهاء الاشتراك', en: 'Enrollment Expiry' },
    [NotificationType.NewCoursePublished]: { ar: 'كورس جديد', en: 'New Course' },
    [NotificationType.Announcement]: { ar: 'إعلان', en: 'Announcement' },
    [NotificationType.NewLessonAdded]: { ar: 'درس جديد', en: 'New Lesson' },
    [NotificationType.ReviewThankYou]: { ar: 'شكر على التقييم', en: 'Review Thanks' },
    [NotificationType.Welcome]: { ar: 'ترحيب', en: 'Welcome' },
    [NotificationType.PriceAlert]: { ar: 'تنبيه سعر', en: 'Price Alert' },
    [NotificationType.AdminCustom]: { ar: 'رسالة مخصصة', en: 'Custom Message' },
  };
  return labels[type]?.[isArabic ? 'ar' : 'en'] ?? (isArabic ? 'إشعار' : 'Notification');
}
