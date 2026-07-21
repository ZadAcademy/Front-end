import { useQuery } from '@tanstack/react-query';
import { fetchCourseDetails, type CourseDetailsApiResponse } from '../lib/api/course-details-api';

/**
 * useCourseDetails — TanStack Query hook for course details.
 *
 * Fetches the course data based on the given courseId.
 */
export function useCourseDetails(courseId: string) {
  return useQuery<CourseDetailsApiResponse>({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetails(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
