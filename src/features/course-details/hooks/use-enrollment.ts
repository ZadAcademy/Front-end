import { useQuery } from '@tanstack/react-query';
import { getEnrollmentStatus } from '../api/enrollment-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

export function useEnrollmentStatusQuery(courseId: string) {
  return useQuery({
    queryKey: ['enrollment-status', courseId],
    queryFn: () => unwrap(getEnrollmentStatus(courseId)),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
