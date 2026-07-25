import { CourseDetailsApiResponse } from "../types/course-details-api";




export async function fetchCourseDetails(courseId: string): Promise<CourseDetailsApiResponse> {

   const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const response=await fetch(`${baseUrl}api/v1/courses/${courseId}`);
  if(!response.ok){
    throw new Error('Failed to fetch course details');
  }
  const data=await response.json();
  console.log("course details",data)
  return data.data as CourseDetailsApiResponse;

}
