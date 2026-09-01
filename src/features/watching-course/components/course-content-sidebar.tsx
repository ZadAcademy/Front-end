'use client';

// ─── Course Content Sidebar ───
// Shows the course sections and lessons in an expandable accordion.
// Highlights the currently active lesson, and allows clicking
// to navigate between lessons.

import { useTranslations } from 'next-intl';
import { PlayCircle, FileText, Loader2, ChevronDown } from 'lucide-react';
import { LessonType, LessonDto } from '@/features/dashboard/courses/lib/types/lesson';
import { SectionDto } from '@/features/dashboard/courses/lib/types/section';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion';

interface CourseContentSidebarProps {
  sections: SectionDto[];
  activeLessonId: string;
  onLessonClick: (lessonId: string) => void;
  isLoading: boolean;
}

// ─── Format helper for duration ───
function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function CourseContentSidebar({
  sections,
  activeLessonId,
  onLessonClick,
  isLoading,
}: CourseContentSidebarProps) {
  const t = useTranslations('WatchingCourse');
  // Calculate total lessons across all sections
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-7 h-7 animate-spin text-blueNormal" />
      </div>
    );
  }

  // ─── Find which section contains the active lesson (for default open state) ───
  const activeSectionId = sections.find((s) =>
    s.lessons.some((l) => l.id === activeLessonId)
  )?.id;

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* ─── Header ─── */}
      <div className="px-5 py-4 border-b border-black/5 bg-slate-50/70 shrink-0">
        <h3 className="font-cairo-bold-base text-greyDark tracking-tight">{t('courseContent')}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-cairo-medium-xs bg-blueNormal/10 text-blueNormal">
            {t('sectionsCount', { count: sections.length })}
          </span>
          <span className="text-xs text-greyNormal">•</span>
          <span className="text-xs font-cairo-medium-xs text-greyNormal">
            {t('lessonsCount', { count: totalLessons })}
          </span>
        </div>
      </div>

      {/* ─── Sections Accordion ─── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Accordion
          className="flex flex-col"
          defaultValue={activeSectionId ? [`section-${activeSectionId}`] : undefined}
        >
          {sections.map((section, sectionIdx) => (
            <AccordionItem
              key={section.id}
              value={`section-${section.id}`}
              className="border-b border-black/5 last:border-none"
            >
              <AccordionTrigger className="px-5 py-3.5 hover:bg-slate-50/80 hover:no-underline transition-colors group">
                <div className="flex flex-col items-start gap-1 text-start w-full pe-3">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-cairo-bold-sm text-greyDark group-hover:text-blueNormal transition-colors line-clamp-1">
                      {sectionIdx + 1}. {section.name}
                    </span>
                  </div>
                  <span className="font-cairo-medium-xs text-greyNormal/70">
                    {t('lessonsCount', { count: section.lessons.length })}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-1 pt-0">
                <ul className="flex flex-col gap-0.5 px-2">
                  {section.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isVideo =
                        lesson.lessonType === LessonType.GoogleDriveVideo ||
                        String(lesson.lessonType) === 'GoogleDriveVideo';
                      const isPdf =
                        lesson.lessonType === LessonType.Pdf ||
                        String(lesson.lessonType) === 'Pdf';

                      const durationText = isVideo && lesson.video?.durationInSeconds
                        ? formatDuration(lesson.video.durationInSeconds)
                        : null;

                      const pageCountText = isPdf && lesson.pdf?.pageCount
                        ? `${lesson.pdf.pageCount} صفحة`
                        : null;

                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => {
                              console.log('[Sidebar] Navigating to lesson:', lesson.id, lesson.title);
                              onLessonClick(lesson.id);
                            }}
                            className={`
                              w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
                              text-start transition-all cursor-pointer group
                              ${isActive
                                ? 'bg-gradient-to-r from-blueNormal/15 via-blueNormal/5 to-transparent text-blueNormal shadow-xs'
                                : 'hover:bg-slate-100/70 text-greyDark'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {/* Icon Container */}
                              <div
                                className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isActive
                                    ? isVideo
                                      ? 'bg-blueNormal text-white shadow-xs'
                                      : 'bg-orange-500 text-white shadow-xs'
                                    : isVideo
                                    ? 'bg-blueNormal/10 text-blueNormal group-hover:bg-blueNormal group-hover:text-white'
                                    : 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
                                }`}
                              >
                                {isVideo ? (
                                  <PlayCircle className="size-4" />
                                ) : (
                                  <FileText className="size-4" />
                                )}
                              </div>

                              {/* Title & Metadata */}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span
                                  className={`font-cairo-medium-sm leading-snug line-clamp-2 ${
                                    isActive ? 'font-cairo-bold-sm text-blueNormal' : 'text-greyDark group-hover:text-black'
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                                {(durationText || pageCountText) && (
                                  <span className="text-[11px] font-cairo-medium-xs text-greyNormal/70 mt-0.5">
                                    {durationText || pageCountText}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
