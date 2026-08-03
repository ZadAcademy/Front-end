import { User, Clock, SquarePlay, Image as ImageIcon, Star } from 'lucide-react';
import { CourseCardProps } from '../lib/types/course';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';


export function CourseCard({
  level,
  title,
  shortDescription,
  instructorName,
  numberOfLessons,
  numberOfStudents,
  rating,
  courseHours,
  price,
  discountPrice,
  currencyCode,
  courseId,
  isAuth = true,
}: CourseCardProps) {
  const t = useTranslations('CourseCard');

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-black/5 p-2.5 flex flex-col transition-all duration-300 hover:shadow-md group h-full"
    >
      <Link href={`/courses/${courseId}`} className="contents">
      {/* ─── Image Placeholder ─── */}
      <div className="w-full aspect-4/3 rounded-xl flex items-center justify-center overflow-hidden">
        <Image
          src="/images/courses/course-cover.jpg"
          alt="Courses Section"
          width={600}
          height={600}
          className="rounded-xl border border-orange-500 object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* ─── Content ─── */}
      <div className="flex flex-col gap-3 flex-1 mt-3">
        {/* Category Badge */}
        <div className="self-start px-3 py-1 bg-blueLight text-blueNormal font-cairo-semibold-sm rounded-lg">
          {level}
        </div>

        {/* Title */}
        <h3 className="font-cairo-bold-xl text-black leading-tight group-hover:text-blueNormal transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="font-cairo-medium-sm text-black/70 line-clamp-3 leading-relaxed">
          {shortDescription}
        </p>

        {/* Lecturer */}
        <div className="flex justify-start mt-auto pt-2">
          <div className="bg-blueNormal text-white font-cairo-medium-sm px-4 py-1.5 rounded-lg">
            {instructorName}
          </div>
        </div>
      </div>

      {/* ─── Footer Stats ─── */}
      <div className="flex items-center gap-2 pt-4 flex-wrap">
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <User className="size-4" />
          <span className="font-cairo-medium-xs">{numberOfStudents}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <Clock className="size-4" />
          <span className="font-cairo-medium-xs">{courseHours}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <SquarePlay className="size-4" />
          <span className="font-cairo-medium-xs">{numberOfLessons}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <Star className="size-4" />
          <span className="font-cairo-medium-xs">{rating}</span>
        </div>
      </div>

      </Link>

      {/* ─── Action Button ─── */}
      <div className="pt-4 mt-auto">
        <Link 
          href={isAuth ? `/courses/${courseId}` : '/login'}
          className="w-full bg-orangeNormal text-white font-cairo-bold-sm py-2 rounded-lg hover:bg-orangeNormalHover transition-colors flex items-center justify-center gap-2"
        >
          {price === undefined || price === null 
            ? t('subscribeNow') 
            : price === 0 
              ? t('freeCourse') 
              : discountPrice ? (
                <div className="flex items-center gap-2">
                  <span>{discountPrice} {currencyCode || ''}</span>
                  <span className="text-white/60 line-through font-cairo-medium-xs">{price} {currencyCode || ''}</span>
                </div>
              ) : (
                <span>{price} {currencyCode || ''}</span>
              )
          }
        </Link>
      </div>
    </div>
  );
}
