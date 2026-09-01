"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  CourseReviewResponse,
  CreateReviewRequest,
  GetCourseReviewsQueryParams,
  PaginatedResult,
  UpdateReviewRequest,
} from "../lib/types/reviews";

const getAuthHeaders = async (includeContentType = true) => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;
    
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }

  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    ...(decodedToken?.token ? { Authorization: `Bearer ${decodedToken.token}` } : {}),
  };
};

// ─── 1. Get Course Reviews (Public) ───
export const getCourseReviews = async (
  courseId: string,
  params?: GetCourseReviewsQueryParams
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(`${baseUrl}api/v1/courses/${courseId}/reviews`);
  
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.pageSize) url.searchParams.set("pageSize", String(params.pageSize));
  if (params?.rating) url.searchParams.set("rating", String(params.rating));

  // No auth headers strictly required for public endpoint, but we can send them just in case
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: await getAuthHeaders(true),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch reviews.");
  }

  const resultData: IApiResponse<PaginatedResult<CourseReviewResponse>> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || "Failed to fetch reviews.");
  }

  return resultData.data;
};

// ─── 2. Get My Course Review (Auth Required) ───
export const getMyReview = async (courseId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/reviews/my`, {
    method: "GET",
    headers: await getAuthHeaders(true),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 401) return null; // Not found or not auth'd
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch your review.");
  }

  const resultData: IApiResponse<CourseReviewResponse | null> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || "Failed to fetch your review.");
  }
  return resultData.data;
};

// ─── 3. Create Review (Auth Required) ───
export const createReview = async ({courseId,data,}: {courseId: string;data: CreateReviewRequest;}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/reviews`, {
    method: "POST",
    headers: await getAuthHeaders(true),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to submit review.");
  }

  const resultData: IApiResponse<string> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || "Failed to submit review.");
  }

  return resultData.data;
};

// ─── 4. Update Review (Auth Required) ───
export const updateReview = async ({courseId,reviewId,data,}: {courseId: string;reviewId: string;data: UpdateReviewRequest;}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/reviews/${reviewId}`, {
    method: "PUT",
    headers: await getAuthHeaders(true),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update review.");
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || "Failed to update review.");
  }

  return resultData.data;
};

// ─── 5. Delete Review (Auth Required) ───
export const deleteReview = async ({
  courseId,
  reviewId,
}: {
  courseId: string;
  reviewId: string;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(true),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete review.");
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || "Failed to delete review.");
  }

  return resultData.data;
};
