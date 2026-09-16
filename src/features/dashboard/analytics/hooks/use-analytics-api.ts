import { useQuery } from '@tanstack/react-query';
import {
  getOverview,
  getEnrollmentsOverTime,
  getTopCourses,
  getOrdersSummary,
} from '../api/analytics-api';

// ─── Query Keys ───

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: ['analytics', 'overview'] as const,
  enrollments: ['analytics', 'enrollments'] as const,
  topCourses: ['analytics', 'top-courses'] as const,
  ordersSummary: ['analytics', 'orders-summary'] as const,
};

// ─── Hooks ───

export const useOverviewQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.overview,
    queryFn: () => getOverview(),
  });
};

export const useEnrollmentsOverTimeQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.enrollments,
    queryFn: () => getEnrollmentsOverTime(),
  });
};

export const useTopCoursesQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.topCourses,
    queryFn: () => getTopCourses(),
  });
};

export const useOrdersSummaryQuery = () => {
  return useQuery({
    queryKey: analyticsKeys.ordersSummary,
    queryFn: () => getOrdersSummary(),
  });
};
