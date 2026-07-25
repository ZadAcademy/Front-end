import { useTranslations } from 'next-intl';
import { PlayCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { CourseDetailsApiResponse } from '../lib/types/course-details-api';

interface CourseSyllabusProps {
  course: CourseDetailsApiResponse;
}

export default function CourseSyllabus({ course }: CourseSyllabusProps) {
  const t = useTranslations('CourseDetails.content');

  // Calculate totals
  const totalSections = course.syllabus.length;
  const totalLectures = course.syllabus.reduce((acc, curr) => acc + curr.lecturesCount, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('syllabus')}</h2>
        <div className="font-cairo-medium-sm text-greyNormal flex items-center gap-2">
          <span>{totalSections} {t('sections')}</span>
          <span className="w-1 h-1 rounded-full bg-greyNormal/50" />
          <span>{totalLectures} {t('lectures')}</span>
        </div>
      </div>

      {/* Accordion list */}
      <Accordion className="flex flex-col gap-3">
        {course.syllabus.map((section) => (
          <AccordionItem
            key={section.id}
            value={`section-${section.id}`}
            className="bg-blueLight/30 border border-blueNormal/10 rounded-xl overflow-hidden data-[state=open]:bg-blueLight/50 transition-colors"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-2 text-start">
                <span className="font-cairo-bold-md text-greyDark">{section.title}</span>
                <div className="font-cairo-medium-sm text-greyNormal shrink-0">
                  {section.lecturesCount} {t('lectures')} • {section.totalTime}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-1">
              <ul className="flex flex-col gap-3">
                {section.lectures.map((lecture) => (
                  <li key={lecture.id} className="flex items-center justify-between font-cairo-medium-sm text-greyDark bg-white p-3 rounded-lg border border-black/5">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="size-4 text-blueNormal shrink-0" />
                      <span>{lecture.title}</span>
                    </div>
                    <span className="text-greyNormal shrink-0">{lecture.duration}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
