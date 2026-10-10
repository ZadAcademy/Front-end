import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnrollmentUsers, getCourseUsers, toggleEnrollment } from "../api/enrollments-admin-api";
import { GetEnrollmentUsersParams, ToggleEnrollmentRequest } from "../lib/types/enrollments-types";
import { unwrap } from "@/shared/lib/utils/api-utils";
import { keepPreviousData } from "@tanstack/react-query";

export const ENROLLMENTS_QUERY_KEYS = {
  all: ["enrollments"] as const,
  users: (params?: GetEnrollmentUsersParams) => ["enrollments", "users", params] as const,
  courseUsers: (courseId: string) => ["enrollments", "course-users", courseId] as const,
};

export function useEnrollmentUsersQuery(params: GetEnrollmentUsersParams) {
  return useQuery({
    queryKey: ENROLLMENTS_QUERY_KEYS.users(params),
    queryFn: () => unwrap(getEnrollmentUsers(params)),
    placeholderData: keepPreviousData,
  });
}

export function useCourseUsersQuery(courseId: string) {
  return useQuery({
    queryKey: ENROLLMENTS_QUERY_KEYS.courseUsers(courseId),
    queryFn: () => unwrap(getCourseUsers(courseId)),
    enabled: !!courseId,
  });
}

export function useToggleEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: ToggleEnrollmentRequest) => unwrap(toggleEnrollment(req)),
    onSuccess: () => {
      // Invalidate both lists so they refresh
      queryClient.invalidateQueries({ queryKey: ENROLLMENTS_QUERY_KEYS.all });
    },
  });
}
