"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { GetUsersQueryParams, PaginatedResult, UserWithRoles } from "../lib/types/roles-types";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }
  return {
    'Content-Type': 'application/json',
    ...(decodedToken?.token ? { 'Authorization': `Bearer ${decodedToken.token}` } : {})
  };
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export async function getUsers(params: GetUsersQueryParams = {}): Promise<PaginatedResult<UserWithRoles>> {
  const headers = await getAuthHeaders();
  const url = new URL(`${baseUrl}api/Users`);
  
  if (params.page !== undefined) url.searchParams.set('Page', String(params.page));
  if (params.pageSize !== undefined) url.searchParams.set('PageSize', String(params.pageSize));
  if (params.search) url.searchParams.set('Search', params.search);
  if (params.isActive !== undefined) url.searchParams.set('IsActive', String(params.isActive));
  if (params.sortBy) url.searchParams.set('SortBy', params.sortBy);
  if (params.sortDescending !== undefined) url.searchParams.set('SortDescending', String(params.sortDescending));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch users');
  }

  const resultData: IApiResponse<PaginatedResult<UserWithRoles>> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to fetch users');
  }

  return resultData.data as PaginatedResult<UserWithRoles>;
}
