"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { CreateCoursePayload } from "../lib/types/course-basics";

export interface UpdateCourseResponse {
  data: string;
}

export const updateCourse = async (courseId: string, data: CreateCoursePayload) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update course. Please try again.');
  }

  const resultData: IApiResponse<UpdateCourseResponse> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update course');
  }
  return resultData.data;
};
