"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export const updateCoursePreview = async (courseId: string, canPreview: boolean) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/can-preview`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    },
    body: JSON.stringify({ canPreview }),
  });
  console.log('updateCoursePreview response server', response);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update course preview. Please try again.');
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update course preview');
  }
  return resultData.data;
};
