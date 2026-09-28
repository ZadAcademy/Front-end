'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export default function WelcomePage() {
  const t = useTranslations('WelcomePage');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-black/5 p-8 md:p-12 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blueLight/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orangeLight/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-blueLight/10 text-blueNormal rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blueNormal/10 rotate-3">
              <Sparkles className="size-10" />
            </div>

            <h1 className="font-cairo-bold-3xl text-greyDark mb-4">
              {t('title', { defaultValue: 'Welcome to Zad Academy!' })}
            </h1>
            
            <p className="font-cairo-medium-base text-greyNormal max-w-lg mb-8 leading-relaxed">
              {t('subtitle', { defaultValue: 'We are thrilled to have you here. Explore our courses, start learning, and take your skills to the next level. Your journey begins now.' })}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/courses"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blueNormal text-white font-cairo-bold-base rounded-xl shadow-lg shadow-blueNormal/30 hover:bg-blueNormalHover hover:-translate-y-1 hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                <BookOpen className="size-5" />
                {t('browseCourses', { defaultValue: 'Browse Courses' })}
              </Link>
              
              <Link
                href="/home"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-greyDark font-cairo-bold-base rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto"
              >
                {t('goHome', { defaultValue: 'Go to Homepage' })}
                {isRTL ? <ArrowRight className="size-5 rotate-180" /> : <ArrowRight className="size-5" />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
