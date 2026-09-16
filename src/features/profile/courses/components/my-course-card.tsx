'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Star, PlayCircle, Clock } from 'lucide-react';
import { MyCourseItem } from '../lib/types/my-courses-types';

interface MyCourseCardProps {
  course: MyCourseItem;
}

const levelTranslations: Record<string, Record<string, string>> = {
  en: {
    'Beginner': 'Beginner',
    'Intermediate': 'Intermediate',
    'Advanced': 'Advanced',
    'Expert': 'Expert'
  },
  ar: {
    'Beginner': 'مبتدئ',
    'Intermediate': 'متوسط',
    'Advanced': 'متقدم',
    'Expert': 'خبير'
  }
};

export function MyCourseCard({ course }: MyCourseCardProps) {
  const t = useTranslations('Profile.sidebar');
  const locale = useLocale();
  
  // Format the enrollment date
  const enrolledDate = new Date(course.enrolledAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const displayLevel = course.level ? (levelTranslations[locale]?.[course.level] || course.level) : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-2.5 flex flex-col transition-all duration-300 hover:shadow-md group h-full">
      <Link href={`/courses/${course.courseId}/learn`} className="contents">
        {/* ─── Image ─── */}
        <div className="w-full aspect-video rounded-xl flex items-center justify-center overflow-hidden bg-black/5">
          <Image
            src={course.cardImageUrl || "/images/courses/course-cover.jpg"}
            alt={course.title}
            width={600}
            height={600}
            className="rounded-xl border object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* ─── Content ─── */}
        <div className="flex flex-col gap-3 flex-1 mt-3">
          {/* Category/Level Badge */}
          <div className="self-start px-3 py-1 bg-blueLight/20 text-blueNormal font-cairo-semibold-sm rounded-lg border border-blueNormal/10">
            {displayLevel}
          </div>

          {/* Title */}
          <h3 className="font-cairo-bold-xl text-greyDarker leading-tight group-hover:text-blueNormal transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          {course.shortDescription && (
            <p className="font-cairo-medium-sm text-greyNormal line-clamp-2 leading-relaxed mt-1">
              {course.shortDescription}
            </p>
          )}

          {/* Spacer to push footer down */}
          <div className="flex-1" />

          {/* ─── Stats & Date ─── */}
          <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-greyNormal">
                <Star className="size-4 text-amber-400 fill-amber-400" />
                <span className="font-cairo-semibold-sm">{course.rating}</span>
                <span className="font-cairo-medium-xs">({course.totalReviews})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-greyNormal font-cairo-medium-sm">
              <Clock className="size-4 shrink-0" />
              <span>{enrolledDate}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* ─── Action Button ─── */}
      <div className="pt-3 border-t border-black/5 mt-3">
        <Link 
          href={`/courses/${course.courseId}/learn`}
          className="w-full bg-blueNormal text-white font-cairo-bold-base py-2.5 rounded-lg hover:bg-blueNormalHover transition-colors flex items-center justify-center gap-2"
        >
          <PlayCircle className="size-5 shrink-0" />
          {t('continueLearning', { defaultValue: 'Continue Learning' })}
        </Link>
      </div>
    </div>
  );
}
