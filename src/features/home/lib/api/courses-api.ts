import { CoursesApiResponse, CoursesQueryParams } from "../types/course-card-api";



export async function fetchCourses(params: CoursesQueryParams): Promise<CoursesApiResponse> {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = new URL(`${baseUrl}api/v1/courses`);
  url.searchParams.set('page', String(params.page));
  url.searchParams.set('pageSize', String(params.pageSize));
  if (params.Level !== undefined) url.searchParams.set('Level', params.Level);
  if (params.MinRating !== undefined) url.searchParams.set('MinRating', String(params.MinRating));
  if (params.IsFree !== undefined) url.searchParams.set('IsFree', String(params.IsFree));
  if (params.SearchTerm) url.searchParams.set('search', params.SearchTerm);

   const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },

  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to get Courses. Please try again.');
  }
  const result = await response.json();
  return result.data as CoursesApiResponse;


}
