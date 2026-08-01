'use client';

import { useTranslations } from 'next-intl';
import { Loader2, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { CourseListTable } from './components/course-list-table';
import { useCourses } from '@/features/home/hooks/use-courses';
import { Button } from '@/shared/ui/button';

export default function ListCoursesPage() {
  const t = useTranslations('Dashboard.pages');
  const tList = useTranslations('Dashboard.courseList');

  // We can fetch a larger page size for the dashboard table (e.g., 10 or 20)
  const {
    courseData,
    isLoading,
    isError,
    currentPage,
    totalPages,
    handlePageChange,
    search,
    handleSearchChange,
  } = useCourses(10);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-cairo-bold-2xl text-greyDark">
          {t('listCourses')}
        </h1>
        
        {/* Simple Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-black/5 bg-white font-cairo-regular-sm text-greyDarker outline-none focus:border-orangeNormal transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-greyLightActive" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orangeNormal" />
        </div>
      ) : isError ? (
        <div className="flex justify-center py-20 text-red-500 font-cairo-medium-base">
          Something went wrong while fetching courses.
        </div>
      ) : (
        <div className="space-y-4">
          <CourseListTable data={courseData?.items || []} />
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="primary"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="font-cairo-semibold-sm flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              {/* Previous Button: LTR wants < on left, RTL wants > on right */}
              <ChevronLeft className="h-4 w-4 rtl:hidden" />
              <ChevronRight className="h-4 w-4 hidden rtl:block" />
              {tList('pagination.previous')}
            </Button>
            
            <span className="font-cairo-medium-sm text-greyNormal">
              {tList('pagination.page')} {currentPage} {tList('pagination.of')} {Math.max(1, totalPages)}
            </span>
            
            <Button
              variant="primary"
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
              className="font-cairo-semibold-sm flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              {tList('pagination.next')}
              {/* Next Button: LTR wants > on right, RTL wants < on left */}
              <ChevronRight className="h-4 w-4 rtl:hidden" />
              <ChevronLeft className="h-4 w-4 hidden rtl:block" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
