export enum OrderStatus {
  Pending = 0,
  Accepted = 1,
  Denied = 2,
}

export interface OrderResponse {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhoneNumber: string;
  userCountryCode: string;
  courseId: string;
  courseTitle: string;
  receiptImageUrl: string | null;
  status: OrderStatus;
  statusName: string;
  createdAt: string;
  updatedAt: string | null;
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

export interface CourseOrdersResponse {
  newOrders: PaginatedResult<OrderResponse>;
  oldOrders: PaginatedResult<OrderResponse>;
}

export interface GetOrdersQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'name' | 'course' | 'status';
  sortDescending?: boolean;
  status?: OrderStatus;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus.Accepted | OrderStatus.Denied;
}
