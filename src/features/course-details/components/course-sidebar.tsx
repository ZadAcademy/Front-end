'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Play, Calendar, Award, Star, Users, BarChart, X } from 'lucide-react';
import { CourseDetailsApiResponse } from '../lib/types/course-details-api';

interface CourseSidebarProps {
  course: CourseDetailsApiResponse;
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
  const t = useTranslations('CourseDetails.sidebar');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const previewVideos = course.previewVideos || [];
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    previewVideos.length > 0 ? previewVideos[0].id : null
  );

  return (
    <>
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden sticky top-24">

          {/* ─── Video Preview Placeholder ─── */}
          <div
            className="w-full aspect-video bg-black/5 relative group cursor-pointer"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform shadow-lg">
                <Play className="size-8 text-white fill-white ms-1" />
              </div>
            </div>
            {/* "Preview this course" label */}
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="bg-black/60 text-white px-4 py-1.5 rounded-full font-cairo-medium-sm backdrop-blur-sm border border-white/20">
                معاينة الكورس
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-8">

            {/* ─── Instructor Section ─── */}
            <div className="flex flex-col gap-3">
              <h3 className="font-cairo-bold-lg text-greyDark">{t('instructor')}</h3>
              <div className="flex items-center gap-4 bg-black/5 rounded-xl p-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blueLight relative shrink-0">
                  <Image
                    src="/images/courses/course-cover.jpg"
                    alt={course.instructorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-cairo-bold-lg text-blueNormal">{course.instructorName}</span>
                </div>
              </div>
            </div>

            {/* ─── Course Info List ─── */}
            <div className="flex flex-col gap-3">
              <h3 className="font-cairo-bold-lg text-greyDark">{t('courseInfo')}</h3>

              <ul className="flex flex-col gap-3 font-cairo-medium-sm text-greyDark">
                <li className="flex items-center justify-between pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <BarChart className="size-6 text-blueNormal" />
                    <span>{t('level')}</span>
                  </div>
                  <span className="font-cairo-bold-sm text-blueNormal">{course.level}</span>
                </li>

                <li className="flex items-center justify-between pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-6 text-blueNormal" />
                    <span>{t('lastUpdated')}</span>
                  </div>
                  <span className="font-cairo-bold-sm text-blueNormal">{course.updatedAt}</span>
                </li>

                <li className="flex items-center justify-between pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <Award className="size-6 text-blueNormal" />
                    <span>{t('certificate')}</span>
                  </div>
                  <span className="font-cairo-bold-sm text-blueNormal">
                    {/* {course.certificate ? t('certificateYes') : ''} */}
                  </span>
                </li>

                <li className="flex items-center justify-between pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <Star className="size-6 text-yellow-500 fill-yellow-500" />
                    <span>{t('rating')}</span>
                  </div>
                  <span className="font-cairo-bold-sm text-blueNormal">{course.rating}</span>
                </li>

                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-6 text-blueNormal" />
                    <span>{t('students')}</span>
                  </div>
                  <span className="font-cairo-bold-sm text-blueNormal">
                    {/* {course.studentsCount} */}
                    00
                    </span>
                </li>
              </ul>
            </div>

            {/* ─── Subscribe CTA (desktop only — mobile has sticky bar) ─── */}
            <button className="hidden lg:block w-full py-3.5 rounded-xl bg-blueNormal hover:bg-blueNormalHover text-white font-cairo-bold-lg transition-colors shadow-lg shadow-blueNormal/20 cursor-pointer">
              {t('subscribeNow')}
            </button>

          </div>
        </div>
      </div>

      {/* ═══════════ Video Preview Modal ═══════════ */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm">

          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsVideoModalOpen(false)}
          />

          {/* Modal content */}
          <div className="relative z-10 bg-[#1a1a2e] rounded-2xl w-[95vw] max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">

            {/* ─── Video Player Area (left / top on mobile) ─── */}
            <div className="w-full md:w-2/3 bg-black flex flex-col">
              {/* Top bar */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 md:right-1/3 z-20">
                <span className="font-cairo-bold-sm text-white">معاينة الكورس</span>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>

              {/* Video placeholder */}
              <div className="w-full aspect-video relative flex items-center justify-center">
                <Image
                  src="/images/courses/course-cover.jpg"
                  alt={course.title}
                  fill
                  className="object-cover opacity-40"
                />
                <button className="relative z-10 w-20 h-20 bg-blueNormal hover:bg-blueNormalHover rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-xl shadow-blueNormal/30">
                  <Play className="size-10 text-white fill-white ms-1" />
                </button>
              </div>

              {/* Current video info */}
              <div className="p-4 bg-[#1a1a2e]">
                <h4 className="font-cairo-bold-md text-white">
                  {previewVideos.find(v => v.id === activeVideoId)?.title}
                </h4>
              </div>
            </div>

            {/* ─── Video List (right / bottom on mobile) ─── */}
            <div className="w-full md:w-1/3 bg-[#16162a] border-t md:border-t-0 md:border-s border-white/10 flex flex-col max-h-[300px] md:max-h-none">
              <div className="p-4 border-b border-white/10">
                <h4 className="font-cairo-bold-sm text-white">الفيديوهات المجانية</h4>
                <span className="font-cairo-medium-xs text-white/40">{previewVideos.length} فيديوهات</span>
              </div>
              <div className="overflow-y-auto flex-1">
                <ul className="flex flex-col">
                  {previewVideos.map((video) => (
                    <li
                      key={video.id}
                      onClick={() => setActiveVideoId(video.id)}
                      className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-white/5 ${
                        video.id === activeVideoId
                          ? 'bg-blueNormal/20 border-s-2 border-s-blueNormal'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="relative w-20 aspect-video bg-gray-800 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src="/images/courses/course-cover.jpg"
                          alt="thumbnail"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="size-3.5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className={`font-cairo-medium-sm line-clamp-2 leading-snug ${
                          video.id === activeVideoId ? 'text-blueNormal' : 'text-white/80'
                        }`}>
                          {video.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
