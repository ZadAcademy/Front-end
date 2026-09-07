import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { BookOpen } from 'lucide-react';

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
        
        {/* Dummy Data UI */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-24 bg-blueNormal/10 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="size-12 text-blueNormal" />
          </div>
          <h3 className="font-cairo-bold-xl text-greyDarker mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-greyNormal font-cairo-medium-base max-w-md">
            Looks like you haven't enrolled in any courses. Explore our catalog and start learning today!
          </p>
        </div>
      </div>
    </div>
  );
}
