import { useQuery } from '@tanstack/react-query';
import { fetchMyCourses } from '../api/my-courses-api';
import { MyCoursesParams } from '../lib/types/my-courses-types';

export const MY_COURSES_QUERY_KEY = 'my-courses';

export function useMyCoursesQuery(params: MyCoursesParams) {
  return useQuery({
    queryKey: [MY_COURSES_QUERY_KEY, params.page, params.pageSize, params.search],
    queryFn: () => fetchMyCourses(params),
  });
}
