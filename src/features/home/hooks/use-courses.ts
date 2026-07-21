import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCourses, type CoursesQueryParams, type CoursesApiResponse } from '../lib/api/courses-api';
import { type FilterState } from '../components/course-filter';

/**
 * useCourses — TanStack Query hook for paginated + filtered courses.
 *
 * This hook wraps the fetchCourses API service with caching, background
 * refetching, and stale-while-revalidate via TanStack Query.
 *
 * When the API is ready:
 * 1. Update `fetchCourses` in `courses-api.ts` to call the real endpoint
 * 2. Everything else (caching, pagination, re-fetching) works automatically
 *
 * Features:
 * - `keepPreviousData` prevents flashing during page transitions
 * - Query key includes page + filters so data refetches on any change
 * - `staleTime: 30s` reduces redundant API calls
 */
export function useCourses(page: number, filters: FilterState, pageSize = 6) {
  const queryParams: CoursesQueryParams = {
    page,
    pageSize,
    filters,
  };

  return useQuery<CoursesApiResponse>({
    queryKey: ['courses', page, filters],
    queryFn: () => fetchCourses(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // 30 seconds
  });
}
