"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export interface EnrollmentStatusResponse {
  isSuccess: boolean;
  message: string;
  data: {
    courseId: string;
    isEnrolled: boolean;
    hasPendingOrder: boolean;
    status: "Enrolled" | "PendingOrder" | "NotEnrolled";
    enrolledAt: string | null;
  };
  errors: string[];
  statusCode: number;
  timestamp: string;
}

export const getEnrollmentStatus = async (courseId: string) => {
  try {
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

    // Only make the request if we have an auth token
    if (!decodedToken?.token) {
      return {
        data: {
          courseId,
          isEnrolled: false,
          hasPendingOrder: false,
          status: "NotEnrolled",
          enrolledAt: null
        }
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const response = await fetch(`${baseUrl}api/Enrollments/courses/${courseId}/my-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodedToken.token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || "Failed to fetch enrollment status." };
    }

    const data: EnrollmentStatusResponse = await response.json();
    return data;
  } catch (error: any) {
    return { serverError: error.message || "An unexpected error occurred." };
  }
};
