import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { BookOpen } from 'lucide-react';
import { MyCoursesGrid } from '@/features/profile/courses/components/my-courses-grid';

export default async function CoursesPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  
  const t = await getTranslations('Profile.sidebar');

  return (
    <div className="w-full max-w-4xl mx-auto py-8 lg:py-0">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8 sm:p-10">
        <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-greyDarker mb-8 border-b pb-4">
          {t('myCourses')}
        </h2>
        <MyCoursesGrid />
      </div>
    </div>
  );
}
