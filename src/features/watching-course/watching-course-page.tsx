'use client';

// ─── Watching Course Page ───
// Main page for watching/viewing course lessons.
// Layout: sidebar (course content list) + main area (video or PDF).
// Uses the useWatchingCourse hook for state management and navigation.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, ChevronRight, ChevronLeft, Menu, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCourseDetails } from '@/features/course-details/hooks/use-course-details';
import { useWatchingCourse } from './hooks/use-watching-course';
import VideoPlayer from './components/video-player';
import PdfViewer from './components/pdf-viewer';
import CourseContentSidebar from './components/course-content-sidebar';

interface WatchingCoursePageProps {
  courseId: string;
  lessonId: string;
}

export default function WatchingCoursePage({ courseId, lessonId }: WatchingCoursePageProps) {
  const locale = useLocale();
  const t = useTranslations('WatchingCourse');
  const isRTL = locale === 'ar';
  const router = useRouter();

  // ─── Mobile sidebar toggle ───
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ─── Course details (for the title) ───
  const { data: course, isLoading: isCourseLoading } = useCourseDetails(courseId);

  // ─── Watching course state ───
  const {
    sections,
    activeLesson,
    activeLessonId,
    isSectionsLoading,
    isVideo,
    isPdf,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
    goToLesson,
  } = useWatchingCourse(courseId, lessonId);

  console.log('[WatchingCoursePage] Active lesson:', activeLesson);
  console.log('[WatchingCoursePage] Is video:', isVideo, '| Is PDF:', isPdf);

  // ─── Handle lesson navigation ───
  // When user clicks a lesson in the sidebar, update the URL and state
  const handleLessonClick = (newLessonId: string) => {
    console.log('[WatchingCoursePage] Navigating to lesson:', newLessonId);
    goToLesson(newLessonId);
    // Update the URL without full page reload
    router.push(`/${locale}/courses/${courseId}/learn/${newLessonId}`, { scroll: false });
    // Close mobile sidebar after selection
    setIsSidebarOpen(false);
  };

  // ─── Handle prev/next navigation ───
  const handlePrevious = () => {
    if (hasPrevious) {
      // Find the previous lesson ID
      const allLessons = sections.flatMap((s) =>
        s.lessons.sort((a, b) => a.order - b.order)
      );
      const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
      if (currentIndex > 0) {
        handleLessonClick(allLessons[currentIndex - 1].id);
      }
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const allLessons = sections.flatMap((s) =>
        s.lessons.sort((a, b) => a.order - b.order)
      );
      const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
      if (currentIndex < allLessons.length - 1) {
        handleLessonClick(allLessons[currentIndex + 1].id);
      }
    }
  };

  // ─── Loading State ───
  if (isCourseLoading || isSectionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 animate-spin text-blueNormal" />
          <span className="font-cairo-medium-sm text-greyNormal">
            {t('loadingContent')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ═══════════ Top Bar ═══════════ */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-greyDark"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>

          {/* Course title & lesson counter */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-cairo-bold-base text-greyDark line-clamp-1">
              {course?.title || t('courseContent')}
            </h1>

            {/* Position indicator pill */}
            {sections.length > 0 && activeLessonId && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-cairo-medium-xs bg-slate-100 text-greyDark shrink-0">
                {(() => {
                  const allLessons = sections.flatMap((s) => s.lessons.sort((a, b) => a.order - b.order));
                  const idx = allLessons.findIndex((l) => l.id === activeLessonId);
                  return idx !== -1 ? `${idx + 1} / ${allLessons.length}` : '';
                })()}
              </span>
            )}
          </div>
        </div>

        {/* Back to course link */}
        <button
          onClick={() => router.push(`/${locale}/courses/${courseId}`)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-blueNormal hover:bg-blueNormal/10 rounded-xl font-cairo-bold-sm transition-all cursor-pointer border border-blueNormal/20 shrink-0"
        >
          {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          <span>{t('backToCourse')}</span>
        </button>
      </div>

      {/* ═══════════ Main Content ═══════════ */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* ─── Sidebar (desktop: always visible, mobile: overlay) ─── */}
        {/* Mobile overlay backdrop */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            bg-white border-e border-slate-200/80 shrink-0
            w-[320px] lg:w-[340px] flex flex-col
            transition-transform duration-300 ease-in-out
            /* Desktop: always visible */
            lg:relative lg:translate-x-0
            /* Mobile: slide in/out overlay */
            fixed top-0 bottom-0 z-40 pt-[57px] lg:pt-0
            ${isRTL
              ? (isSidebarOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0')
              : (isSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0')
            }
          `}
        >
          <CourseContentSidebar
            sections={sections}
            activeLessonId={activeLessonId}
            onLessonClick={handleLessonClick}
            isLoading={isSectionsLoading}
          />
        </aside>

        {/* ─── Main Viewer Area ─── */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
          <div className="flex-1 flex flex-col">
            {/* ─── Content: Video or PDF (Full Width) ─── */}
            {activeLesson ? (
              <>
                {isVideo && (
                  <div className="w-full bg-black shadow-md">
                    <VideoPlayer
                      lessonId={activeLessonId}
                      title={activeLesson.title}
                    />
                  </div>
                )}
                {isPdf && activeLesson.pdfUrl && (
                  <div className="w-full bg-[#525659] shadow-md">
                    <PdfViewer
                      lessonId={activeLessonId}
                      title={activeLesson.title}
                      pdfUrl={activeLesson.pdfUrl}
                    />
                  </div>
                )}

                {/* Lesson Title (Below Video) */}
                <div className="p-5 sm:p-7 bg-white border-b border-slate-200/80 shadow-2xs">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-cairo-medium-xs bg-slate-100 text-greyDark">
                      {activeLesson.sectionName}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-cairo-medium-xs ${isVideo ? 'bg-blueNormal/10 text-blueNormal' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                      {isVideo ? 'فيديو' : 'ملف PDF'}
                    </span>
                  </div>
                  <h2 className="font-cairo-bold-2xl text-greyDark leading-tight">
                    {activeLesson.title}
                  </h2>
                </div>
              </>
            ) : (
              /* ─── No lesson selected / not found ─── */
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-sm">
                  <p className="font-cairo-bold-lg text-greyDark">
                    {t('lessonNotFound')}
                  </p>
                  <p className="font-cairo-medium-sm text-greyNormal mt-2">
                    {t('selectLessonPrompt')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════ Bottom Navigation Bar ═══════════ */}
          <div className="bg-white border-t border-slate-200/80 px-5 py-3.5 flex items-center justify-between shrink-0 shadow-2xs sticky bottom-0 z-20">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-cairo-bold-sm
                transition-all cursor-pointer border
                ${hasPrevious
                  ? 'text-greyDark bg-white hover:bg-slate-100 border-slate-200 shadow-2xs active:scale-98'
                  : 'text-greyNormal/40 bg-slate-50 border-slate-100 cursor-not-allowed'
                }
              `}
            >
              {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              <span>{t('previousLesson')}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-cairo-bold-sm
                transition-all cursor-pointer
                ${hasNext
                  ? 'bg-blueNormal hover:bg-blueNormalHover text-white shadow-xs hover:shadow-md active:scale-98'
                  : 'bg-slate-100 text-greyNormal/40 border border-slate-200/50 cursor-not-allowed'
                }
              `}
            >
              <span>{t('nextLesson')}</span>
              {isRTL ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
