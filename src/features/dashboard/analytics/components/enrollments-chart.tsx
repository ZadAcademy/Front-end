'use client';

import { useTranslations } from 'next-intl';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';
import type { EnrollmentDataPoint } from '../lib/types/analytics-types';

interface EnrollmentsChartProps {
  data?: EnrollmentDataPoint[];
  isLoading: boolean;
}

/**
 * Custom tooltip for the enrollment chart.
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const date = new Date(label);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm px-4 py-3">
      <p className="font-cairo-medium-xs text-greyNormal mb-1">
        {formattedDate}
      </p>
      <p className="font-cairo-bold-base text-blueNormal">
        {payload[0].value}
      </p>
    </div>
  );
}

/**
 * EnrollmentsChart — Area chart showing the daily enrollment trend.
 * Follows the project's card design: bg-white rounded-2xl shadow-sm border border-black/5
 */
export default function EnrollmentsChart({ data, isLoading }: EnrollmentsChartProps) {
  const t = useTranslations('Dashboard.analytics');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-black/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blueNormal/10">
          <TrendingUp className="size-5 text-blueNormal" strokeWidth={1.8} />
        </div>
        <h3 className="font-cairo-bold-lg text-greyDark">
          {t('enrollmentTrend')}
        </h3>
      </div>

      {/* Chart Area */}
      <div className="p-5 flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-blueNormal" />
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-blueNormal)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-blueNormal)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => {
                  const d = new Date(value);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-blueNormal)"
                strokeWidth={2}
                fill="url(#enrollmentGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: 'var(--color-blueNormal)',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center">
            <span className="font-cairo-medium-sm text-greyNormal">
              {t('noData')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
