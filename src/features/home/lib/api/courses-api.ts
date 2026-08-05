"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { CoursesApiResponse, CoursesQueryParams } from "../types/course-card-api";

export async function fetchCourses(params: CoursesQueryParams): Promise<CoursesApiResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = new URL(`${baseUrl}api/v1/courses`);
  url.searchParams.set('page', String(params.page));
  url.searchParams.set('pageSize', String(params.pageSize));
  if (params.Level !== undefined) url.searchParams.set('Level', params.Level);
  if (params.MinRating !== undefined) url.searchParams.set('MinRating', String(params.MinRating));
  if (params.IsFree !== undefined) url.searchParams.set('IsFree', String(params.IsFree));
  if (params.SearchTerm) url.searchParams.set('search', params.SearchTerm);
  if (params.Status !== undefined) url.searchParams.set('Statuses', String(params.Status));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(decodedToken?.token ? { 'Authorization': `Bearer ${decodedToken.token}` } : {})
    },
    // Adding no-store or revalidate depends on usage, but for editor it's best to always fetch fresh
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to get Courses. Please try again.');
  }
  const result = await response.json();
  return result.data as CoursesApiResponse;


}
