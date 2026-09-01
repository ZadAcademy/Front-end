import { useTranslations } from 'next-intl';
import { PlayCircle, FileText, Loader2 } from 'lucide-react';
import { useCourseSections } from '@/features/dashboard/courses/hooks/use-section-api';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';

import { LessonType } from '@/features/dashboard/courses/lib/types/lesson';


// Helper to format duration
const formatDuration = (seconds?: number) => {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface CourseSyllabusProps {
  course: any;
}

export default function CourseSyllabus({ course }: CourseSyllabusProps) {
  const t = useTranslations('CourseDetails.content');

  const { data: sections = [], isLoading } = useCourseSections(course?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-7 h-7 animate-spin text-blueNormal" />
      </div>
    );
  }

  const totalSections = sections.length;
  const totalLessons = sections.reduce((acc, curr) => acc + curr.lessons.length, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('syllabus')}</h2>
        <div className="font-cairo-medium-sm text-greyNormal flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60">
          <span className="text-blueNormal font-cairo-bold-sm">{totalSections} {t('sections')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-greyNormal/40" />
          <span>{totalLessons} {t('lectures')}</span>
        </div>
      </div>

      {/* Accordion list */}
      <Accordion className="flex flex-col gap-3">
        {sections.map((section, idx) => (
          <AccordionItem
            key={section.id}
            value={`section-${section.id}`}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs transition-all data-open:border-blueNormal/30 data-open:shadow-xs"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50/60 transition-colors group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pe-4 gap-2 text-start">
                <span className="font-cairo-bold-md text-greyDark group-hover:text-blueNormal transition-colors">
                  {idx + 1}. {section.name}
                </span>
                <span className="font-cairo-medium-xs text-greyNormal bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                  {section.lessons.length} {t('lectures')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-2">
              <ul className="flex flex-col gap-2">
                {section.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => {
                    const isVideo =
                      lesson.lessonType === LessonType.GoogleDriveVideo ||
                      String(lesson.lessonType) === 'GoogleDriveVideo' ||
                      (lesson.video !== null && lesson.video !== undefined);

                    const isPdf =
                      lesson.lessonType === LessonType.Pdf ||
                      String(lesson.lessonType) === 'Pdf' ||
                      (lesson.pdf !== null && lesson.pdf !== undefined);

                    const durationText = isVideo && lesson.video?.durationInSeconds
                      ? formatDuration(lesson.video.durationInSeconds)
                      : null;

                    const pageCountText = isPdf && lesson.pdf?.pageCount
                      ? `${lesson.pdf.pageCount} صفحة`
                      : null;

                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between font-cairo-medium-base text-greyDark bg-slate-50/70 p-3 rounded-xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-all hover:shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Icon Container */}
                          <div
                            className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isVideo
                                ? 'bg-blueNormal/10 text-blueNormal'
                                : 'bg-orange-500/10 text-orange-500'
                            }`}
                          >
                            {isVideo ? (
                              <PlayCircle className="size-4" />
                            ) : (
                              <FileText className="size-4" />
                            )}
                          </div>
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        {/* Metadata (duration or page count) */}
                        {(durationText || pageCountText) && (
                          <span className="text-xs font-cairo-medium-xs text-greyNormal/70 shrink-0 ms-3">
                            {durationText || pageCountText}
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
