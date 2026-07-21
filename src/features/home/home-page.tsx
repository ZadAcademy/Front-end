'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import CourseFilter, { type FilterState } from './components/course-filter';
import CoursesGrid from './components/courses-grid';
import Pagination from './components/pagination';

/**
 * HomePage — Root component for the authenticated home page.
 * Assembles: page title, course filter, courses grid, and pagination.
 *
 * Architecture:
 * - Filter state lives here and is passed to both the filter UI and the grid.
 * - The grid uses TanStack Query (via useCourses hook) to fetch data.
 * - Pagination totalPages comes from the API response (via onTotalPagesChange).
 * - When the real API is ready, only `courses-api.ts` needs updating.
 */
export default function HomePage() {
  const t = useTranslations('HomePage');

  /* ─── Filter state ─── */
  const [filters, setFilters] = useState<FilterState>({
    level: 'all',
    price: 'all',
    rating: 'all',
  });

  /* ─── Pagination state ─── */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ─── Handle page change ─── */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of courses section smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ─── Handle filter change — reset pagination when filters change ─── */
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  /* ─── Receive totalPages from the grid/API response ─── */
  const handleTotalPagesChange = useCallback((pages: number) => {
    setTotalPages(pages);
  }, []);

  return (
    <div className="pt-20 pb-12">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">

          {/* ─── Page Title ─── */}
          <h1 className="font-cairo-bold-3xl text-greyDark">
            {t('title')}
          </h1>

          {/* ─── Filter Panel ─── */}
          <CourseFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* ─── Courses Grid (powered by TanStack Query) ─── */}
          <CoursesGrid
            currentPage={currentPage}
            filters={filters}
            onTotalPagesChange={handleTotalPagesChange}
          />

          {/* ─── Pagination ─── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
