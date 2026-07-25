
import { useTranslations } from 'next-intl';

/**
 * ListCoursesPage — Placeholder for the List Courses dashboard page.
 * Will be implemented with a data table, filters, and actions.
 */
export default function ListCoursesPage() {
  const t = useTranslations('Dashboard.pages');

  return (
    <div>
      <h1 className="font-cairo-bold-2xl text-greyDark">
        {t('listCourses')}
      </h1>
    </div>
  );
}
