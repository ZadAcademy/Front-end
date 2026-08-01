"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { CreateCoursePayload } from "../lib/types/course-basics";


export interface createCourseResponse {
  data: string;
}

export const createCourse = async (data: CreateCoursePayload) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    },
    body: JSON.stringify(data),
  });
  console.log("response from server", response);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to create course. Please try again.');
  }

  const resultData: IApiResponse<createCourseResponse> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to create course');
  }
  return resultData.data;
};
