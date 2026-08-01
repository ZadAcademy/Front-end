"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export interface PreviewVideoPayload {
  id: string;
  title: string;
  videoUrl: string;
  sortOrder: number;
}

export interface CreatePreviewVideosPayload {
  videos: PreviewVideoPayload[];
}



export const updatePreviewVideos = async (courseId: string, data: CreatePreviewVideosPayload) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/preview-videos`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update preview videos. Please try again.');
  }

  const resultData: IApiResponse<string> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update preview videos');
  }

  return resultData.data;
};

export const deletePreviewVideo = async (courseId: string, videoId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/preview-videos/${videoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to delete preview video. Please try again.');
  }

  const resultData: IApiResponse<string> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to delete preview video');
  }

  return resultData.data;
};
