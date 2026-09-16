'use server';

import { IApiResponse } from '@/shared/lib/types/api';
import { MyCourseItem, MyCoursesParams, PaginatedResult } from '../lib/types/my-courses-types';
import { getAuthHeaders } from '@/shared/lib/utils/auth-headers';

export async function fetchMyCourses(
  params: MyCoursesParams
): Promise<PaginatedResult<MyCourseItem>> {
  const headers = await getAuthHeaders();

  const queryParams = new URLSearchParams();
  queryParams.append('page', (params.page || 1).toString());
  queryParams.append('pageSize', (params.pageSize || 10).toString());
  if (params.search) {
    queryParams.append('search', params.search);
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const url = `${baseUrl}/api/Enrollments/my-courses?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
    cache: 'no-store', // Ensures fresh data
  });

  const responseText = await response.text();
  console.log("Response status:", response.status);
  console.log("Raw response text:", responseText);

  let resData: IApiResponse<PaginatedResult<MyCourseItem>>;
  try {
    resData = JSON.parse(responseText);
  } catch (error) {
    throw new Error(`Failed to parse response: ${response.status} ${response.statusText} - ${responseText}`);
  }

  if (!resData.isSuccess) {
    throw new Error(resData.message || 'Failed to fetch my courses');
  }

  return resData.data;
}
