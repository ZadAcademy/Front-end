'use client';

import { useTranslations } from 'next-intl';
import CourseFilter from './components/course-filter';
import CoursesGrid from './components/courses-grid';
import Pagination from './components/pagination';
import { useCourses } from './hooks/use-courses';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const {
    level,
    price,
    rating,
    search,
    handleLevelChange,
    handlePriceChange,
    handleRatingChange,
    handleSearchChange,
    handleReset,
    currentPage,
    totalPages,
    handlePageChange,
    courseData,
    isLoading,
    isError,
  } = useCourses(6, "Published");

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
            level={level}
            price={price}
            rating={rating}
            search={search}
            onLevelChange={handleLevelChange}
            onPriceChange={handlePriceChange}
            onRatingChange={handleRatingChange}
            onSearchChange={handleSearchChange}
            onReset={handleReset}
          />

          {/* ─── Courses Grid ─── */}
          <CoursesGrid
            courseData={courseData}
            isLoading={isLoading}
            isError={isError}
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
