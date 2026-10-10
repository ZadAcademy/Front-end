export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type EnrollmentStatus = "Enrolled" | "PendingOrder" | "NotEnrolled";

export interface EnrolledCourseRef {
  id: string;
  title: string;
}

export interface AdminUserEnrollment {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string | null;
  experience: string;
  isActive: boolean;
  createdAt: string;
  enrolledCourses: EnrolledCourseRef[];
}

export interface GetEnrollmentUsersParams {
  page?: number | string;
  pageSize?: number | string;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface CourseUserEnrollment {
  userId: string;
  fullName: string;
  email: string;
  status: EnrollmentStatus;
  enrolledAt?: string | null;
}

export interface ToggleEnrollmentRequest {
  userId: string;
  courseId: string;
}
