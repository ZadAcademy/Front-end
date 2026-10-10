'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { EnrollmentsByUser } from './enrollments-by-user';
import { EnrollmentsByCourse } from './enrollments-by-course';
import { Users, BookOpen } from 'lucide-react';

export default function EnrollmentsPage() {
  const t = useTranslations('Dashboard.enrollments');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const view = searchParams.get('view') === 'courses' ? 'courses' : 'users';

  const setView = (newView: 'users' | 'courses') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="font-cairo-bold-2xl text-greyDarker">
          {t('pageTitle')}
        </h1>
        <p className="text-sm font-cairo-medium-sm text-greyNormal max-w-2xl">
          {t('pageSubtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setView('users')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-cairo-bold-sm transition-all whitespace-nowrap ${
            view === 'users' 
              ? 'bg-white text-blueNormal shadow-sm' 
              : 'text-greyNormal hover:text-greyDark hover:bg-black/5'
          }`}
        >
          <Users className="size-4" />
          {t('tabUsers')}
        </button>
        <button
          onClick={() => setView('courses')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-cairo-bold-sm transition-all whitespace-nowrap ${
            view === 'courses' 
              ? 'bg-white text-blueNormal shadow-sm' 
              : 'text-greyNormal hover:text-greyDark hover:bg-black/5'
          }`}
        >
          <BookOpen className="size-4" />
          {t('tabCourses')}
        </button>
      </div>

      <div className="pt-2">
        {view === 'users' ? <EnrollmentsByUser /> : <EnrollmentsByCourse />}
      </div>
    </div>
  );
}
