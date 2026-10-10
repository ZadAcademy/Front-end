"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { 
  AdminUserEnrollment, 
  CourseUserEnrollment, 
  GetEnrollmentUsersParams, 
  PaginatedResult,
  ToggleEnrollmentRequest 
} from "../lib/types/enrollments-types";

async function getAuthHeaders() {
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
    "Content-Type": "application/json",
    ...(decodedToken?.token
      ? { Authorization: `Bearer ${decodedToken.token}` }
      : {}),
  };
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

function buildQueryString(params?: GetEnrollmentUsersParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function getEnrollmentUsers(params?: GetEnrollmentUsersParams) {
  try {
    const headers = await getAuthHeaders();
    const qs = buildQueryString(params);
    const response = await fetch(`${baseUrl}api/Enrollments/users${qs}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || `Failed to fetch users (Status: ${response.status})` };
    }

    const result: IApiResponse<PaginatedResult<AdminUserEnrollment>> = await response.json();
    if (!result.isSuccess) {
      return { serverError: result.message || "Failed to fetch users" };
    }
    return result.data;
  } catch (error: any) {
    return { serverError: error.message || "An unexpected error occurred." };
  }
}

export async function getCourseUsers(courseId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Enrollments/courses/${courseId}/users`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || `Failed to fetch course users (Status: ${response.status})` };
    }

    const result: IApiResponse<PaginatedResult<CourseUserEnrollment> | CourseUserEnrollment[]> = await response.json();
    if (!result.isSuccess) {
      return { serverError: result.message || "Failed to fetch course users" };
    }
    
    // Normalize to array if it is paginated, based on assumptions. We will assume it might be paginated or an array.
    if (result.data && typeof result.data === 'object' && 'items' in result.data) {
       return (result.data as PaginatedResult<CourseUserEnrollment>).items;
    }
    
    return result.data as CourseUserEnrollment[];
  } catch (error: any) {
    return { serverError: error.message || "An unexpected error occurred." };
  }
}

export async function toggleEnrollment(req: ToggleEnrollmentRequest) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Enrollments/toggle`, {
      method: "PUT",
      headers,
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || `Failed to toggle enrollment (Status: ${response.status})` };
    }

    const result: IApiResponse<boolean> = await response.json();
    if (!result.isSuccess) {
      return { serverError: result.message || "Failed to toggle enrollment" };
    }
    return result.data;
  } catch (error: any) {
    return { serverError: error.message || "An unexpected error occurred." };
  }
}
