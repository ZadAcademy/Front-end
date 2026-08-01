
import { useTranslations } from 'next-intl';
import { CourseCard } from '@/shared/components/course-card';
import { CourseCardSkeleton } from '@/shared/skeletons/course-card-skeleton';
import { CoursesApiResponse } from '../lib/types/course-card-api';
import { useSession } from 'next-auth/react';

interface CoursesGridProps {
  courseData?: CoursesApiResponse;
  isLoading?: boolean;
  isError?: boolean;
}

export default function CoursesGrid({courseData ,isLoading,isError }: CoursesGridProps) {
  const t = useTranslations('HomePage.filter');
  const { status } = useSession();
  const isAuth = status === 'authenticated';

  const getTranslatedLevel = (level: string) => {
    switch (String(level).toLowerCase()) {
      case '0':
      case 'beginner':
        return t('beginner');
      case '1':
      case 'intermediate':
        return t('intermediate');
      case '2':
      case 'advanced':
      case 'expert':
        return t('expert');
      default:
        return level; // Fallback to raw string if unknown
    }
  };

  /* ─── Loading state ─── */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  /* ─── Error state ─── */
  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-cairo-medium-lg text-red-500">
          {t('error')}
        </p>
      </div>
    );
  }

  /* ─── Empty state ─── */
  if (!courseData?.items?.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="font-cairo-medium-lg text-greyNormal">
          {t('noCoursesFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courseData.items?.map((course) => (
        <CourseCard
          key={course.id}
          courseId={course.id}
          level={getTranslatedLevel(course.level)}
          title={course.title}
          shortDescription={course.shortDescription}
          instructorName={course.instructorName}
          numberOfLessons={course.numberOfLessons}
          numberOfStudents={course.numberOfStudents}
          rating={course.rating}
          courseHours={course.courseHours}
          price={isAuth ? (course.resolvedPrice?.price ?? course.price ?? undefined) : undefined}
          currencyCode={isAuth ? course.resolvedPrice?.currencyCode : undefined}
        />
      ))}
    </div>
  );
}
