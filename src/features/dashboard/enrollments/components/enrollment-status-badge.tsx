import { useTranslations } from 'next-intl';
import { EnrollmentStatus } from '../lib/types/enrollments-types';
import { cn } from '@/shared/lib/utils/tailwind-cn';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: EnrollmentStatus;
  className?: string;
}

export function EnrollmentStatusBadge({ status, className }: Props) {
  const t = useTranslations('Dashboard.enrollments.status');

  const config = {
    Enrolled: {
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle2,
      label: t('Enrolled', { defaultValue: 'Enrolled' }),
    },
    PendingOrder: {
      color: 'bg-amber-100 text-amber-700',
      icon: AlertCircle,
      label: t('PendingOrder', { defaultValue: 'Pending Order' }),
    },
    NotEnrolled: {
      color: 'bg-gray-100 text-gray-700',
      icon: XCircle,
      label: t('NotEnrolled', { defaultValue: 'Not Enrolled' }),
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-cairo-bold-sm',
        config.color,
        className
      )}
      title={status === 'PendingOrder' ? t('pendingOrderTooltip', { defaultValue: 'User has an unapproved order for this course.' }) : undefined}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}
