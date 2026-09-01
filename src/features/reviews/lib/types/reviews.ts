export interface CourseReviewResponse {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userProfileImageUrl: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string | null;
}

export interface UpdateReviewRequest {
  rating: number;
  comment?: string | null;
}

export interface GetCourseReviewsQueryParams {
  page?: number;
  pageSize?: number;
  rating?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

