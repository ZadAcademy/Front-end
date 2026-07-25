import { useTranslations } from 'next-intl';
import { Info, CheckCircle2 } from 'lucide-react';
import { CourseDetailsApiResponse } from '../lib/types/course-details-api';

interface CourseRequirementsProps {
  course: CourseDetailsApiResponse;
}

export default function CourseRequirements({ course }: CourseRequirementsProps) {
  const t = useTranslations('CourseDetails.content');

  return (
    <div className="flex flex-col gap-5  ">
      <div className="flex items-center gap-3 pb-4">
        <Info className="size-6 text-orangeNormal" />
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('requirements')}</h2>
      </div>
      
      <ul className="flex flex-col gap-3.5 bg-white p-4 rounded-lg shadow-md">
        {course.prerequisites.map((req) => (
          <li key={req.id} className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-orangeNormal shrink-0 mt-0.5" />
            <span className="font-cairo-medium-base text-greyDark">{req.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
