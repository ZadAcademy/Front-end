import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import type { CourseDetailsApiResponse } from '../lib/api/course-details-api';

interface CourseObjectivesProps {
  course: CourseDetailsApiResponse;
}

export default function CourseObjectives({ course }: CourseObjectivesProps) {
  const t = useTranslations('CourseDetails.content');

  return (
    <div className="flex flex-col gap-10">
      
      {/* ─── What you will learn (Description) ─── */}
      <div className="flex flex-col gap-4">
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('whatYouWillLearn')}</h2>
        <p className="font-cairo-medium-base text-greyNormal leading-relaxed">
          {course.whatYouWillLearn}
        </p>
      </div>

      {/* ─── Skills you will gain ─── */}
      <div className="flex flex-col gap-5">
        <h3 className="font-cairo-bold-xl text-greyDark">{t('skills')}</h3>
        <div className="bg-blueLight/30 border border-blueNormal/10 rounded-2xl p-6 lg:p-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {course.skills.map((skill, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-blueNormal shrink-0 mt-0.5" />
                <span className="font-cairo-medium-base text-greyDark leading-snug">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
}
