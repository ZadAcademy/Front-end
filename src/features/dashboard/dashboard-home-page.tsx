'use client';

import { useTranslations } from 'next-intl';
import {
  useOverviewQuery,
  useEnrollmentsOverTimeQuery,
  useTopCoursesQuery,
  useOrdersSummaryQuery,
} from './analytics/hooks/use-analytics-api';
import OverviewStatsCards from './analytics/components/overview-stats-cards';
import EnrollmentsChart from './analytics/components/enrollments-chart';
import TopCoursesTable from './analytics/components/top-courses-table';
import OrdersSummaryCard from './analytics/components/orders-summary-card';

/**
 * DashboardHomePage — Analytics overview as the main landing view
 * of the admin dashboard. Shows headline counters, enrollment trend,
 * top courses, and orders breakdown.
 */
export default function DashboardHomePage() {
  const t = useTranslations('Dashboard.pages');

  const overview = useOverviewQuery();
  const enrollments = useEnrollmentsOverTimeQuery();
  const topCourses = useTopCoursesQuery();
  const ordersSummary = useOrdersSummaryQuery();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* ─── Page Title ─── */}
      <h1 className="font-cairo-bold-2xl text-greyDark">
        {t('dashboard')}
      </h1>

      {/* ─── Headline Stat Cards ─── */}
      <OverviewStatsCards
        data={overview.data}
        isLoading={overview.isLoading}
      />

      {/* ─── Charts Row: Enrollment Trend + Orders Summary ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Enrollment chart — 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <EnrollmentsChart
            data={enrollments.data}
            isLoading={enrollments.isLoading}
          />
        </div>

        {/* Orders summary — 1/3 width on desktop */}
        <div className="lg:col-span-1">
          <OrdersSummaryCard
            data={ordersSummary.data}
            isLoading={ordersSummary.isLoading}
          />
        </div>
      </div>

      {/* ─── Top Courses ─── */}
      <TopCoursesTable
        data={topCourses.data}
        isLoading={topCourses.isLoading}
      />
    </div>
  );
}
