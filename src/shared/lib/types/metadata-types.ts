/* ─── Shared Metadata Types ─── */

export interface MetadataItem {
  id: string;
  title: string;
}

export interface UserMetadataItem {
  id: string;
  name: string;
  email: string;
}

export interface MetadataParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PaginatedMetadata<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
