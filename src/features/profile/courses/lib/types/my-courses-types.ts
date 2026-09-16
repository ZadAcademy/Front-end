export interface MyCourseItem {
  courseId: string;
  title: string;
  shortDescription: string | null;
  cardImageUrl: string | null;
  price: number;
  discountPrice: number | null;
  level: string;
  rating: number;
  totalReviews: number;
  enrolledAt: string;
}

export interface MyCoursesParams {
  page?: number;
  pageSize?: number;
  search?: string;
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

