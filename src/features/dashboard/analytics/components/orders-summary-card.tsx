'use client';

import { useTranslations } from 'next-intl';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Loader2, ClipboardList } from 'lucide-react';
import type { OrdersSummaryData } from '../lib/types/analytics-types';

interface OrdersSummaryCardProps {
  data?: OrdersSummaryData;
  isLoading: boolean;
}

const STATUS_CONFIG = [
  { key: 'pending' as const, color: '#F59E0B', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-700' },
  { key: 'accepted' as const, color: '#059669', badgeBg: 'bg-green-100', badgeText: 'text-green-700' },
  { key: 'denied' as const, color: '#DC2626', badgeBg: 'bg-red-100', badgeText: 'text-red-700' },
];

/**
 * Custom tooltip for the donut chart.
 */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm px-4 py-2.5">
      <p className="font-cairo-medium-sm" style={{ color: payload[0]?.payload?.fill }}>
        {payload[0]?.name}: <span className="font-cairo-bold-sm">{payload[0]?.value ?? 0}</span>
      </p>
    </div>
  );
}

/**
 * OrdersSummaryCard — Donut chart + status breakdown.
 * Follows the project's card design: bg-white rounded-2xl shadow-sm border border-black/5
 */
export default function OrdersSummaryCard({ data, isLoading }: OrdersSummaryCardProps) {
  const t = useTranslations('Dashboard.analytics');

  const chartData = data
    ? STATUS_CONFIG.map((s) => ({
        name: t(s.key),
        value: data?.[s.key] ?? 0,
        fill: s.color,
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-black/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-600/10">
          <ClipboardList className="size-5 text-violet-600" strokeWidth={1.8} />
        </div>
        <h3 className="font-cairo-bold-lg text-greyDark">
          {t('ordersSummary')}
        </h3>
      </div>

      <div className="p-5 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-violet-600" />
          </div>
        ) : data ? (
          <div className="flex flex-col items-center gap-5">
            {/* Donut Chart with acceptance rate in center */}
            <div className="relative w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label — acceptance rate */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-cairo-bold-xl text-emerald-600">
                  {(data?.acceptanceRate ?? 0).toFixed(1)}%
                </span>
                <span className="font-cairo-medium-xs text-greyNormal">
                  {t('acceptanceRate')}
                </span>
              </div>
            </div>

            {/* Status breakdown rows */}
            <div className="w-full flex flex-col gap-2">
              {STATUS_CONFIG.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-cairo-semibold-xs ${item.badgeBg} ${item.badgeText}`}
                    >
                      {t(item.key)}
                    </span>
                  </div>
                  <span className="font-cairo-bold-sm text-greyDark tabular-nums">
                    {(data?.[item.key] ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Total row */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-blueNormal/5 mt-1">
                <span className="font-cairo-bold-sm text-blueNormal">
                  {t('totalOrders')}
                </span>
                <span className="font-cairo-bold-base text-blueNormal tabular-nums">
                  {(data?.total ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <span className="font-cairo-medium-sm text-greyNormal">
              {t('noData')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
