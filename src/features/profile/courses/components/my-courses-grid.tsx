'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { useMyCoursesQuery } from '../hooks/use-my-courses-api';
import { MyCourseCard } from './my-course-card';
import { CourseCardSkeleton } from '@/shared/skeletons/course-card-skeleton';
import Pagination from '@/features/dashboard/orders/components/pagination';
import { MyCourseItem } from '../lib/types/my-courses-types';

export function MyCoursesGrid() {
  const t = useTranslations('Profile.sidebar');
  const [page, setPage] = useState(1);
  const pageSize = 6; // Adjust based on grid layout

  const { data, isLoading, isError, refetch } = useMyCoursesQuery({
    page,
    pageSize,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-2xl border border-red-100 p-8">
        <AlertCircle className="size-12 text-red-500 mb-4" />
        <h3 className="font-cairo-bold-lg text-red-700 mb-2">
          {t('errorLoading', { defaultValue: 'Failed to load your courses' })}
        </h3>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-white text-red-600 rounded-lg border border-red-200 font-cairo-bold-sm hover:bg-red-50 transition-colors"
        >
          {t('tryAgain', { defaultValue: 'Try Again' })}
        </button>
      </div>
    );
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 0;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-24 bg-blueLight/30 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="size-12 text-blueNormal" />
        </div>
        <h3 className="font-cairo-bold-xl text-greyDarker mb-2">
          {t('noCoursesYet', { defaultValue: 'No courses enrolled yet' })}
        </h3>
        <p className="text-greyNormal font-cairo-medium-base max-w-md">
          {t('exploreCatalog', { defaultValue: "Looks like you haven't enrolled in any courses. Explore our catalog and start learning today!" })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((course: MyCourseItem) => (
          <MyCourseCard key={course.courseId} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center border-t border-black/5 pt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
