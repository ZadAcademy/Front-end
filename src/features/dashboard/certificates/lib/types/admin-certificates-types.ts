export interface AdminCertificate {
  id: string;
  studentName: string;
  code: string;
  country: string;
  courseName: string;
  courseNumber: string;
  date: string;
}

export interface UpdateCertificateRequest {
  code: string;
  country: string;
  courseName: string;
  courseNumber: string;
  date: string;
  studentName: string;
}

export interface AdminCertificatesPaginatedResult {
  items: AdminCertificate[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetAdminCertificatesParams {
  Page?: number;
  PageSize?: number;
  Search?: string;
  SortBy?: string;
  SortDescending?: boolean;
}
