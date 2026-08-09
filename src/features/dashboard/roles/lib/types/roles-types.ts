export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RoleListItem {
  id: string;
  name: string;
  isDisabled: boolean;
}

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  isDeleted: boolean;
  permissions: string[];
}

export interface UserRoleInfo {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber?: string | null;
  experience: string;
  isActive: boolean;
  createdAt: string;
  roles: UserRoleInfo[];
}

export interface CreateRolePayload {
  name: string;
  description?: string | null;
  permissions: string[];
  isDefault?: boolean;
}

export interface UpdateRolePayload {
  id: string;
  newName: string;
  description?: string | null;
  permissions: string[];
  isDefault?: boolean | null;
}

export interface UpdateUserRolesPayload {
  userId: string;
  roles: string[];
}

export interface GetUsersQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
}
