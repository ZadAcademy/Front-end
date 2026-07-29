"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export interface CourseDetails {
  id: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  price?: number;
  discountPrice?: number | null;
  resolvedPrice?: { price: number; discountPrice?: number | null; currencyCode: string; } | null;
  instructorName?: string | null;
  canPreview?: boolean;
  level: string;
  imageUrl?: string | null;
  rating: number;
  totalReviews: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  learningOutcomes: { id: string; description: string; sortOrder: number }[];
  prerequisites: { id: string; description: string; sortOrder: number }[];
  localizedPrices?: { id: string; countryCode: string; currencyCode: string; price: number; discountPrice?: number | null }[];
  previewVideos?: { id: string; title: string; videoUrl: string; sortOrder: number }[];
}

export const getCourseById = async (courseId: string): Promise<CourseDetails> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}`, {
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
    throw new Error(errorData?.message || 'Failed to fetch course details.');
  }

  const resultData: IApiResponse<CourseDetails> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to fetch course details.');
  }
  console.log("courseData", resultData);

  return resultData.data;
};
