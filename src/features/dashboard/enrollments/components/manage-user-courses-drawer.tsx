'use client';

import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { X, Search, Loader2 } from 'lucide-react';
import { AdminUserEnrollment } from '../lib/types/enrollments-types';
import { useDashboardCourses } from '@/features/dashboard/courses/hooks/use-dashboard-courses';
import { Button } from '@/shared/ui/button';
import Image from '@/shared/ui/app-image';
import { useToggleEnrollmentMutation } from '../hooks/use-enrollments-api';
import { toast } from 'sonner';
import { ConfirmModal } from '@/features/notifications/components/admin/confirm-modal';
import { useDebounce } from '@/features/dashboard/orders/hooks/use-debounce';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserEnrollment | null;
}

export function ManageUserCoursesDrawer({ isOpen, onClose, user }: Props) {
  const t = useTranslations('Dashboard.enrollments');
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // We want to load a large number of courses to filter locally or use the dashboard courses hook.
  // The hook does server-side search, which is even better. We'll pass debounced search.
  const { courseData, isLoading, search, handleSearchChange } = useDashboardCourses(50); // Large page size
  
  const toggleMutation = useToggleEnrollmentMutation();

  const [pendingToggle, setPendingToggle] = useState<{
    courseId: string;
    courseTitle: string;
    isCurrentlyEnrolled: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      handleSearchChange('');
      setSearchTerm('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleSearchChange]);

  // Derive the set of enrolled course IDs
  const enrolledIds = useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(user.enrolledCourses.map(c => c.id.toString()));
  }, [user]);

  if (!isOpen || !mounted || !user) return null;

  const handleConfirmToggle = () => {
    if (!pendingToggle) return;
    
    toggleMutation.mutate({ userId: user.id, courseId: pendingToggle.courseId }, {
      onSuccess: () => {
        toast.success(pendingToggle.isCurrentlyEnrolled ? t('accessRemoved') : t('accessGranted'));
        setPendingToggle(null);
      },
      onError: (err) => {
        toast.error(err.message || t('toggleFailed'));
        setPendingToggle(null);
      }
    });
  };

  const handleSearchInput = (val: string) => {
    setSearchTerm(val);
    handleSearchChange(val);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right rtl:slide-in-from-left duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h2 className="font-cairo-bold-xl text-greyDarker leading-tight">{user.firstName} {user.lastName}</h2>
              <p className="text-sm font-cairo-medium-sm text-greyNormal">{user.email}</p>
            </div>
            <button onClick={onClose} className="p-2 text-greyNormal hover:bg-black/5 rounded-full transition-colors">
              <X className="size-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-greyLightActive" />
            <input 
              type="text"
              placeholder={t('searchCourses')}
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full h-10 pl-10 rtl:pl-4 rtl:pr-10 pr-4 rounded-lg bg-gray-50 border border-black/5 font-cairo-medium-sm focus:border-blueNormal outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-blueNormal" />
            </div>
          ) : courseData?.items.length === 0 ? (
            <div className="text-center py-10 text-greyNormal font-cairo-medium-base">
              {t('noCoursesFound')}
            </div>
          ) : (
            courseData?.items.map(course => {
              const isEnrolled = enrolledIds.has(course.id.toString());
              return (
                <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl border border-black/5 hover:border-black/10 transition-colors bg-white">
                  <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                    <Image 
                      src={course.cardImageUrl || '/images/placeholder.png'} 
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cairo-bold-sm text-greyDark truncate">{course.title}</h4>
                    <span className={`text-[11px] font-cairo-bold-sm px-2 py-0.5 rounded-full ${isEnrolled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {isEnrolled ? t('status.Enrolled') : t('status.NotEnrolled')}
                    </span>
                  </div>
                  
                  <Button
                    variant={isEnrolled ? 'outline' : 'primary'}
                    size="sm"
                    className="shrink-0 font-cairo-bold-sm h-8"
                    onClick={() => setPendingToggle({
                      courseId: course.id.toString(),
                      courseTitle: course.title,
                      isCurrentlyEnrolled: isEnrolled
                    })}
                  >
                    {isEnrolled ? t('remove') : t('enroll')}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 bg-gray-50">
          <p className="text-center text-sm font-cairo-medium-sm text-greyNormal">
            {t('enrolledInCount', { count: enrolledIds.size })}
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!pendingToggle}
        onClose={() => setPendingToggle(null)}
        title={pendingToggle?.isCurrentlyEnrolled ? t('modal.removeTitle') : t('modal.enrollTitle')}
        message={
          pendingToggle?.isCurrentlyEnrolled 
            ? t('modal.removeMessage', { user: user.firstName, course: pendingToggle?.courseTitle || '' })
            : t('modal.enrollMessage', { user: user.firstName, course: pendingToggle?.courseTitle || '' })
        }
        confirmText={pendingToggle?.isCurrentlyEnrolled ? t('remove') : t('enroll')}
        cancelText={t('cancel')}
        isDestructive={pendingToggle?.isCurrentlyEnrolled}
        isLoading={toggleMutation.isPending}
        onConfirm={handleConfirmToggle}
      />
    </div>,
    document.body
  );
}
