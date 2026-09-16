'use client';

import { useTranslations } from 'next-intl';
import { Loader2, Trophy } from 'lucide-react';
import type { TopCourseEntry } from '../lib/types/analytics-types';

interface TopCoursesTableProps {
  data?: TopCourseEntry[];
  isLoading: boolean;
}

/**
 * Safely reads the enrollment count from a course entry.
 * The API may return `enrollmentCount`, `enrollmentsCount`, or `totalEnrollments`.
 */
function getEnrollmentCount(course: any): number {
  return (
    course?.enrollmentCount ??
    course?.enrollmentsCount ??
    course?.totalEnrollments ??
    course?.count ??
    0
  );
}

/**
 * Safely reads the course title from a course entry.
 */
function getCourseTitle(course: any): string {
  return course?.courseTitle ?? course?.title ?? course?.name ?? '';
}

/**
 * TopCoursesTable — Ranked table of the most-enrolled courses.
 * Follows the project's table card pattern from orders-list.tsx.
 */
export default function TopCoursesTable({ data, isLoading }: TopCoursesTableProps) {
  const t = useTranslations('Dashboard.analytics');
  const maxCount = data && data.length > 0 ? getEnrollmentCount(data[0]) || 1 : 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-black/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orangeNormal/10">
          <Trophy className="size-5 text-orangeNormal" strokeWidth={1.8} />
        </div>
        <h3 className="font-cairo-bold-lg text-greyDark">
          {t('topCourses')}
        </h3>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-orangeNormal" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-gray-50 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-cairo-semibold-sm text-greyNormal w-12">#</th>
                <th className="px-6 py-4 font-cairo-semibold-sm text-greyNormal">{t('courseName')}</th>
                <th className="px-6 py-4 font-cairo-semibold-sm text-greyNormal text-end w-48">{t('enrollments')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((course, index) => {
                const count = getEnrollmentCount(course);
                const title = getCourseTitle(course);
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                  <tr
                    key={course?.courseId ?? index}
                    className="border-b border-black/5 hover:bg-gray-50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      {index < 3 ? (
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-cairo-bold-xs text-white ${
                            index === 0
                              ? 'bg-amber-400'
                              : index === 1
                                ? 'bg-gray-400'
                                : 'bg-amber-700'
                          }`}
                        >
                          {index + 1}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 font-cairo-semibold-sm text-greyNormal">
                          {index + 1}
                        </span>
                      )}
                    </td>

                    {/* Course Title */}
                    <td className="px-6 py-4">
                      <span className="font-cairo-medium-sm text-greyDark">
                        {title}
                      </span>
                    </td>

                    {/* Count + Bar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-orangeNormal rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="font-cairo-bold-sm text-orangeNormal tabular-nums min-w-[40px] text-end">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <span className="font-cairo-medium-sm text-greyNormal">
            {t('noData')}
          </span>
        </div>
      )}
    </div>
  );
}
