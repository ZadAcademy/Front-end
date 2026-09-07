import { useQuery } from '@tanstack/react-query';
import { getCourseById, CourseDetails } from '@/features/dashboard/courses/api/get-course-by-id-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

export function useCourseDetails(courseId: string) {
  return useQuery<CourseDetails>({
    queryKey: ['courseDetails', courseId],
    queryFn: () => unwrap(getCourseById(courseId)),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
