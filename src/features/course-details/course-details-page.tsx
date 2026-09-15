'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCourseDetails } from './hooks/use-course-details';
import CourseHeader from './components/course-header';
import CourseSidebar from './components/course-sidebar';
import CourseObjectives from './components/course-objectives';
import CourseSyllabus from './components/course-syllabus';
import CourseRequirements from './components/course-requirements';
import CourseReviewsSection from '../reviews/components/course-reviews-section';
import { Loader2, Play, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEnrollmentStatusQuery } from './hooks/use-enrollment';
import { useCourseSections } from '@/features/dashboard/courses/hooks/use-section-api';

interface CourseDetailsPageProps {
  courseId: string;
}

export default function CourseDetailsPage({ courseId }: CourseDetailsPageProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('CourseDetails.sidebar');
  const { status } = useSession();
  const isAuth = status === 'authenticated';


  const { data: course, isLoading, isError } = useCourseDetails(courseId);
  const { data: enrollment, isLoading: isEnrollmentLoading } = useEnrollmentStatusQuery(courseId);
  const { data: sections = [] } = useCourseSections(courseId);

  const firstLesson = sections
    .sort((a, b) => a.order - b.order)
    .flatMap((s) => s.lessons.sort((a, b) => a.order - b.order))
    [0];
  const watchCourseHref = firstLesson
    ? `/${locale}/courses/${courseId}/learn/${firstLesson.id}`
    : '#';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-10 animate-spin text-blueNormal" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-cairo-medium-xl text-red-500">حدث خطأ في تحميل الكورس. حاول مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen lg:mt-16">

      {/* ─── Hero Section ─── */}
      <CourseHeader
        title={course.title}
        shortDescription={course.shortDescription || ''}
        level={course.level}
        isRTL={isRTL}
        detailImageUrl={course.detailImageUrl || '/images/courses/course-cover.jpg'}
      />

      {/* ─── Main Content Layout ─── */}
      {/* pb-24 on mobile gives space for the sticky bottom CTA bar */}
      <div className="mx-auto max-w-[1450px] w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-28 lg:pb-12">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 relative lg:items-start w-full">

          {/* Main Content (What you'll learn, Syllabus, Requirements) */}
          <div className="flex-1 w-full flex flex-col gap-12 order-2 lg:order-0 min-w-0">
            <CourseObjectives course={course} />
            <CourseSyllabus course={course} />
            <CourseRequirements course={course} />
          </div>

          {/* Sidebar — sticky on desktop, normal flow on mobile */}
          <div className="order-1 lg:order-0 w-full lg:w-auto">
            <CourseSidebar course={course} enrollment={enrollment?.data} isEnrollmentLoading={isEnrollmentLoading} watchCourseHref={watchCourseHref} />
          </div>

        </div>
      </div>

      {/* ─── Reviews Section (full-width, above footer) ─── */}
      <div className="w-full  py-12 lg:py-16 pb-28 lg:pb-16">
        <div className="mx-auto max-w-[1450px] w-full px-4 sm:px-6 lg:px-8">
          <CourseReviewsSection courseId={courseId} />
        </div>
      </div>

      {/* ─── Mobile Sticky Bottom CTA (like Udemy) ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 px-4 py-3 z-50 flex items-center justify-between shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        {enrollment?.data?.status === 'Enrolled' ? (
          <Link
            href={watchCourseHref}
            className="w-full px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-cairo-bold-lg shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="size-5 fill-white" />
            {isRTL ? 'متابعة التعلم' : 'Continue Learning'}
          </Link>
        ) : enrollment?.data?.status === 'PendingOrder' ? (
          <div className="w-full px-8 py-3 rounded-xl bg-amber-100 text-amber-700 font-cairo-bold-lg border border-amber-200 flex items-center justify-center gap-2">
            <Clock className="size-5" />
            {isRTL ? 'طلبك قيد المراجعة' : 'Order Pending Review'}
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {isAuth && course.resolvedPrice ? (
                <div className="flex items-center gap-2">
                  {course.resolvedPrice.discountPrice ? (
                    <>
                      <span className="font-cairo-bold-xl text-greyDark">{course.resolvedPrice.discountPrice} {course.resolvedPrice.currencyCode}</span>
                      <span className="font-cairo-medium-sm text-greyNormal line-through">{course.resolvedPrice.price} {course.resolvedPrice.currencyCode}</span>
                    </>
                  ) : (
                    <span className="font-cairo-bold-xl text-greyDark">{course.resolvedPrice.price} {course.resolvedPrice.currencyCode}</span>
                  )}
                </div>
              ) : isAuth && !course.resolvedPrice ? (
                <span className="font-cairo-bold-xl text-greyDark">مجاناً</span>
              ) : null}
              <span className="font-cairo-medium-xs text-greyNormal">شاملة الشهادة</span>
            </div>
            <Link
              href={isAuth ? `/courses/${courseId}/checkout` : '/login'}
              className="px-8 py-3 rounded-xl bg-blueNormal hover:bg-blueNormalHover text-white font-cairo-bold-lg shadow-lg shadow-blueNormal/20 cursor-pointer transition-colors"
            >
              {t('subscribeNow')}
            </Link>
          </>
        )}
      </div>

    </div>
  );
}
