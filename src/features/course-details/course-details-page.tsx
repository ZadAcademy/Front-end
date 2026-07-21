'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCourseDetails } from './hooks/use-course-details';
import CourseHeader from './components/course-header';
import CourseSidebar from './components/course-sidebar';
import CourseObjectives from './components/course-objectives';
import CourseSyllabus from './components/course-syllabus';
import CourseRequirements from './components/course-requirements';
import { Loader2 } from 'lucide-react';

interface CourseDetailsPageProps {
  courseId: string;
}

export default function CourseDetailsPage({ courseId }: CourseDetailsPageProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('CourseDetails.sidebar');

  const { data: course, isLoading, isError } = useCourseDetails(courseId);

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
        description={course.description}
        level={course.category}
        isRTL={isRTL}
      />

      {/* ─── Main Content Layout ─── */}
      {/* pb-24 on mobile gives space for the sticky bottom CTA bar */}
      <div className="mx-auto max-w-[1450px] w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-28 lg:pb-12">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 relative items-start">

          {/* Main Content (What you'll learn, Syllabus, Requirements) */}
          <div className="flex-1 flex flex-col gap-12 order-2 lg:order-none min-w-0">
            <CourseObjectives course={course} />
            <CourseSyllabus course={course} />
            <CourseRequirements course={course} />
          </div>

          {/* Sidebar — sticky on desktop, normal flow on mobile */}
          <div className="order-1 lg:order-none w-full lg:w-auto">
            <CourseSidebar course={course} />
          </div>

        </div>
      </div>

      {/* ─── Mobile Sticky Bottom CTA (like Udemy) ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 px-4 py-3 z-50 flex items-center justify-between shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="font-cairo-bold-xl text-greyDark">مجاناً</span>
          <span className="font-cairo-medium-xs text-greyNormal">شاملة الشهادة</span>
        </div>
        <button className="px-8 py-3 rounded-xl bg-blueNormal hover:bg-blueNormalHover text-white font-cairo-bold-lg shadow-lg shadow-blueNormal/20 cursor-pointer transition-colors">
          {t('subscribeNow')}
        </button>
      </div>

    </div>
  );
}
