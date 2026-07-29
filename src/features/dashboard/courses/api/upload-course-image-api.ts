"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export interface uploadCourseImageResponse {
  data: string;
}

export const uploadCourseImage = async (courseId: string, formData: FormData) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/image`, {
    method: 'PUT',
    headers: {
      ...(decodedToken?.token ? { 'Authorization': `Bearer ${decodedToken.token}` } : {})
    },
    body: formData, 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to upload course image. Please try again.');
  }

  const resultData: IApiResponse<uploadCourseImageResponse> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to upload course image');
  }
  return resultData.data;
};
