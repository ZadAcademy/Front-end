"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export interface uploadCourseImageResponse {
  data: string;
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return {
    ...(decodedToken?.token ? { 'Authorization': `Bearer ${decodedToken.token}` } : {})
  };
};

export const uploadCardImage = async (courseId: string, formData: FormData) => {
  const headers = await getAuthHeaders();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/card-image`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to upload card image. Please try again.');
  }

  const resultData: IApiResponse<uploadCourseImageResponse> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to upload card image');
  }
  return resultData.data;
};

export const uploadDetailImage = async (courseId: string, formData: FormData) => {
  const headers = await getAuthHeaders();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/detail-image`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to upload detail image. Please try again.');
  }

  const resultData: IApiResponse<uploadCourseImageResponse> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to upload detail image');
  }
  return resultData.data;
};
