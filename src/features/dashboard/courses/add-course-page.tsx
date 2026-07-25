
import { useTranslations } from 'next-intl';
import { AddCourseBasicInfo } from './components/add-course-basic-info';
import { AddCourseLocalizedPrices } from './components/add-course-localized-prices';
import { AddCoursePreview } from './components/add-course-preview';

/**
 * AddCoursePage — Dashboard page for adding a course.
 * Contains multiple blocks/steps. Currently showing Basic Info, Prices, and Preview.
 */
export default function AddCoursePage() {
  const t = useTranslations('Dashboard.pages');

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      <div>
        <h1 className="font-cairo-bold-2xl text-greyDark mb-1">
          {t('addCourse')}
        </h1>
      </div>
      
      {/* Basic Info Block (Step 1) */}
      <AddCourseBasicInfo />

      {/* Localized Prices Block (Step 2) */}
      <AddCourseLocalizedPrices />

      {/* Course Preview Block (Step 3) */}
      <AddCoursePreview />
    </div>
  );
}
