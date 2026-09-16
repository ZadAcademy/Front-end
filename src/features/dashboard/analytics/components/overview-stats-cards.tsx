'use client';

import { useTranslations } from 'next-intl';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import type { OverviewData } from '../lib/types/analytics-types';

interface OverviewStatsCardsProps {
  data?: OverviewData;
  isLoading: boolean;
}

const cards = [
  {
    key: 'totalUsers' as const,
    icon: Users,
    iconColor: 'text-blueNormal',
    iconBg: 'bg-blueNormal/10',
    valueColor: 'text-blueNormal',
  },
  {
    key: 'totalStudents' as const,
    icon: GraduationCap,
    iconColor: 'text-orangeNormal',
    iconBg: 'bg-orangeNormal/10',
    valueColor: 'text-orangeNormal',
  },
  {
    key: 'totalCourses' as const,
    icon: BookOpen,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-600/10',
    valueColor: 'text-emerald-600',
  },
  {
    key: 'totalEnrollments' as const,
    icon: UserCheck,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-600/10',
    valueColor: 'text-violet-600',
  },
];

/**
 * OverviewStatsCards — Four headline metric cards at the top of the dashboard.
 * Follows the project's card pattern: bg-white rounded-2xl shadow-sm border border-black/5
 */
export default function OverviewStatsCards({ data, isLoading }: OverviewStatsCardsProps) {
  const t = useTranslations('Dashboard.analytics');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = data?.[card.key] ?? 0;

        return (
          <div
            key={card.key}
            className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.iconBg} shrink-0`}
            >
              <Icon className={`size-6 ${card.iconColor}`} strokeWidth={1.8} />
            </div>

            {/* Text Content */}
            <div className="flex flex-col min-w-0">
              <span className="font-cairo-medium-sm text-greyNormal">
                {t(card.key)}
              </span>

              {isLoading ? (
                <div className="h-7 w-16 rounded-lg bg-gray-100 animate-pulse mt-1" />
              ) : (
                <span className={`font-cairo-bold-2xl ${card.valueColor}`}>
                  {value.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
