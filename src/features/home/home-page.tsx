'use client';

import { useTranslations } from 'next-intl';
import CourseFilter from './components/course-filter';
import CoursesGrid from './components/courses-grid';
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
    courseData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

          {/* ─── Load More ─── */}
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-orangeNormal text-white font-cairo-bold-base cursor-pointer rounded-lg hover:bg-[#E57B24] transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? t('loading', { defaultValue: 'Loading...' }) : t('loadMore', { defaultValue: 'Show More Courses' })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
