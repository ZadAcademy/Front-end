'use client';

import { CourseCard } from '@/shared/components/course-card';
import { useCourses } from '../hooks/use-courses';
import { type FilterState } from './course-filter';

interface CoursesGridProps {
  currentPage: number;
  filters: FilterState;
  onTotalPagesChange: (totalPages: number) => void;
}

/**
 * CoursesGrid — Displays a paginated grid of CourseCard components.
 * Powered by the useCourses TanStack Query hook.
 *
 * When the API is ready, the data will automatically flow through
 * the hook → API service → this grid. No changes needed here.
 */
export default function CoursesGrid({ currentPage, filters, onTotalPagesChange }: CoursesGridProps) {
  const { data, isLoading, isError } = useCourses(currentPage, filters);

  /* ─── Notify parent of total pages when data arrives ─── */
  if (data && data.totalPages) {
    onTotalPagesChange(data.totalPages);
  }

  /* ─── Loading state ─── */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-black/5 p-2.5 animate-pulse"
          >
            {/* Image placeholder */}
            <div className="w-full aspect-4/3 rounded-xl bg-gray-200" />
            {/* Content placeholder */}
            <div className="flex flex-col gap-3 mt-3">
              <div className="w-24 h-6 rounded-lg bg-gray-200" />
              <div className="w-3/4 h-5 rounded bg-gray-200" />
              <div className="w-full h-12 rounded bg-gray-100" />
              <div className="w-28 h-7 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ─── Error state ─── */
  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-cairo-medium-lg text-red-500">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  /* ─── Empty state ─── */
  if (!data?.data?.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-cairo-medium-lg text-greyNormal">
          No courses found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.map((course) => (
        <CourseCard
          key={course.id}
          category={course.category}
          title={course.title}
          description={course.description}
          lecturer={course.lecturer}
          stats={course.stats}
        />
      ))}
    </div>
  );
}
