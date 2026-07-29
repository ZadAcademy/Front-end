import { useQuery } from '@tanstack/react-query';
import { getCourseById, CourseDetails } from '@/features/dashboard/courses/api/get-course-by-id-api';

export function useCourseDetails(courseId: string) {
  return useQuery<CourseDetails>({
    queryKey: ['courseDetails', courseId],
    queryFn: () => getCourseById(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
