'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Search } from 'lucide-react';
import { useCourseUsersQuery } from '../hooks/use-enrollments-api';
import { useDashboardCourses } from '@/features/dashboard/courses/hooks/use-dashboard-courses';
import { EnrollmentStatusBadge } from './enrollment-status-badge';
import { ConfirmModal } from '@/features/notifications/components/admin/confirm-modal';
import { useToggleEnrollmentMutation } from '../hooks/use-enrollments-api';
import { EnrollmentStatus } from '../lib/types/enrollments-types';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export function EnrollmentsByCourse() {
  const t = useTranslations('Dashboard.enrollments');
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<EnrollmentStatus | 'All'>('All');

  // Fetch courses for the dropdown
  const { courseData, isLoading: isLoadingCourses } = useDashboardCourses(100);

  // Fetch users for the selected course
  const { data: usersData, isLoading: isLoadingUsers, isError } = useCourseUsersQuery(selectedCourseId);

  const toggleMutation = useToggleEnrollmentMutation();
  const [pendingToggle, setPendingToggle] = useState<{
    userId: string;
    userName: string;
    status: EnrollmentStatus;
  } | null>(null);

  // Client-side filtering
  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    return usersData.filter(u => {
      const matchesSearch = (u.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                            (u.email || '').toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || u.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [usersData, search, activeFilter]);

  // Compute summary stats
  const stats = useMemo(() => {
    if (!usersData) return { enrolled: 0, pending: 0, notEnrolled: 0 };
    return {
      enrolled: usersData.filter(u => u.status === 'Enrolled').length,
      pending: usersData.filter(u => u.status === 'PendingOrder').length,
      notEnrolled: usersData.filter(u => u.status === 'NotEnrolled').length,
    };
  }, [usersData]);

  const selectedCourseTitle = useMemo(() => {
    if (!selectedCourseId || !courseData) return '';
    return courseData.items.find(c => c.id.toString() === selectedCourseId)?.title || '';
  }, [selectedCourseId, courseData]);

  const handleConfirmToggle = () => {
    if (!pendingToggle || !selectedCourseId) return;
    
    toggleMutation.mutate({ userId: pendingToggle.userId, courseId: selectedCourseId }, {
      onSuccess: () => {
        toast.success(pendingToggle.status === 'Enrolled' ? t('accessRemoved') : t('accessGranted'));
        setPendingToggle(null);
      },
      onError: (err) => {
        toast.error(err.message || t('toggleFailed'));
        setPendingToggle(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Course Picker & Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full max-w-md space-y-1.5">
            <label className="text-sm font-cairo-bold-sm text-greyDark">{t('selectCourse')}</label>
            <Select value={selectedCourseId} onValueChange={(val) => val && setSelectedCourseId(val)} disabled={isLoadingCourses}>
              <SelectTrigger className="w-full h-11 bg-gray-50 border-black/5 font-cairo-medium-base focus:ring-blueNormal">
                <SelectValue placeholder={isLoadingCourses ? t('loading') : t('selectCoursePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {courseData?.items.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()} className="font-cairo-medium-sm">
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedCourseId && usersData && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-black/5">
            <button 
              onClick={() => setActiveFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-sm font-cairo-bold-sm transition-colors border ${activeFilter === 'All' ? 'bg-black text-white border-black' : 'bg-white text-greyDark border-black/10 hover:bg-gray-50'}`}
            >
              {t('all')} ({usersData.length})
            </button>
            <button 
              onClick={() => setActiveFilter('Enrolled')}
              className={`px-3 py-1.5 rounded-lg text-sm font-cairo-bold-sm transition-colors border ${activeFilter === 'Enrolled' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-white text-greyDark border-black/10 hover:bg-gray-50'}`}
            >
              {t('status.Enrolled')} ({stats.enrolled})
            </button>
            <button 
              onClick={() => setActiveFilter('PendingOrder')}
              className={`px-3 py-1.5 rounded-lg text-sm font-cairo-bold-sm transition-colors border ${activeFilter === 'PendingOrder' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-greyDark border-black/10 hover:bg-gray-50'}`}
            >
              {t('status.PendingOrder')} ({stats.pending})
            </button>
            <button 
              onClick={() => setActiveFilter('NotEnrolled')}
              className={`px-3 py-1.5 rounded-lg text-sm font-cairo-bold-sm transition-colors border ${activeFilter === 'NotEnrolled' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-white text-greyDark border-black/10 hover:bg-gray-50'}`}
            >
              {t('status.NotEnrolled')} ({stats.notEnrolled})
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      {selectedCourseId ? (
        <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-black/5 flex items-center justify-between">
            <h3 className="font-cairo-bold-base text-greyDark">{t('courseUsersList')}</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-greyLightActive" />
              <input
                type="text"
                placeholder={t('searchUsersInCourse')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 rtl:pl-3 rtl:pr-9 pr-3 rounded-lg border border-black/5 bg-gray-50 font-cairo-medium-sm focus:border-blueNormal outline-none transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-black/5 text-greyDark font-cairo-bold-sm">
                  <th className="py-3 px-6 font-medium">{t('colUser')}</th>
                  <th className="py-3 px-6 font-medium">{t('colStatus')}</th>
                  <th className="py-3 px-6 font-medium">{t('colEnrolledAt')}</th>
                  <th className="py-3 px-6 font-medium text-end">{t('colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Loader2 className="size-8 animate-spin text-blueNormal mx-auto" />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-red-500 font-cairo-medium-base">
                      {t('errorLoadingUsers')}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-greyNormal font-cairo-medium-base">
                      {search || activeFilter !== 'All' ? t('noUsersMatch') : t('noUsersFound')}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isEnrolled = user.status === 'Enrolled';
                    return (
                      <tr key={user.userId || (user as any).id} className="border-b border-black/5 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex flex-col min-w-0">
                            <span className="font-cairo-bold-sm text-greyDarker truncate">{user.fullName}</span>
                            <span className="text-xs font-cairo-medium-sm text-greyNormal truncate">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <EnrollmentStatusBadge status={user.status} />
                        </td>
                        <td className="py-3 px-6 text-sm font-cairo-medium-sm text-greyDark">
                          {user.enrolledAt ? new Date(user.enrolledAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-6 text-end">
                          <Button
                            variant={isEnrolled ? 'outline' : 'primary'}
                            size="sm"
                            onClick={() => setPendingToggle({
                              userId: user.userId || (user as any).id,
                              userName: user.fullName,
                              status: user.status
                            })}
                            className="font-cairo-bold-sm h-8 w-24"
                          >
                            {isEnrolled ? t('remove') : t('enroll')}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-black/5 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-full bg-blueNormal/10 text-blueNormal flex items-center justify-center mb-4">
            <Search className="size-8 opacity-50" />
          </div>
          <h3 className="font-cairo-bold-lg text-greyDark mb-2">{t('noCourseSelected')}</h3>
          <p className="font-cairo-medium-sm text-greyNormal max-w-sm">{t('noCourseSelectedDesc')}</p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingToggle}
        onClose={() => setPendingToggle(null)}
        title={pendingToggle?.status === 'Enrolled' ? t('modal.removeTitle') : t('modal.enrollTitle')}
        message={
          pendingToggle?.status === 'Enrolled' 
            ? t('modal.removeMessage', { user: pendingToggle?.userName || '', course: selectedCourseTitle })
            : pendingToggle?.status === 'PendingOrder'
              ? t('modal.enrollPendingMessage', { user: pendingToggle?.userName || '', course: selectedCourseTitle })
              : t('modal.enrollMessage', { user: pendingToggle?.userName || '', course: selectedCourseTitle })
        }
        confirmText={pendingToggle?.status === 'Enrolled' ? t('remove') : t('enroll')}
        cancelText={t('cancel')}
        isDestructive={pendingToggle?.status === 'Enrolled'}
        isLoading={toggleMutation.isPending}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
}
