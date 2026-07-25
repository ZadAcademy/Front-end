import { useQuery } from '@tanstack/react-query';
import { fetchCourseDetails,   } from '../lib/api/course-details-api';
import { CourseDetailsApiResponse } from '../lib/types/course-details-api';


export function useCourseDetails(courseId: string) {
  return useQuery<CourseDetailsApiResponse>({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetails(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
