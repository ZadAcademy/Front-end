"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import type {
  OverviewData,
  EnrollmentDataPoint,
  TopCourseEntry,
  OrdersSummaryData,
} from "../lib/types/analytics-types";

// ─── Auth helper (same pattern as orders-api) ───

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

// ─── GET /api/Analytics/overview ───

/**
 * Retrieves headline counters: total users, students, courses and enrollments.
 */
export async function getOverview(): Promise<OverviewData> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/Analytics/overview`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch overview (Status: ${response.status})`);
  }

  const result: IApiResponse<OverviewData> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch overview");
  }

  return result.data;
}

// ─── GET /api/Analytics/enrollments-over-time ───

/**
 * Retrieves daily enrollment counts for a date range.
 * Days with no enrollments return count = 0.
 */
export async function getEnrollmentsOverTime(): Promise<EnrollmentDataPoint[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${baseUrl}api/Analytics/enrollments-over-time`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch enrollments over time (Status: ${response.status})`
    );
  }

  const result: IApiResponse<EnrollmentDataPoint[]> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch enrollments over time");
  }

  return result.data;
}

// ─── GET /api/Analytics/top-courses ───

/**
 * Retrieves the top courses ordered by enrollment count (real enrollments only).
 */
export async function getTopCourses(): Promise<TopCourseEntry[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/Analytics/top-courses`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch top courses (Status: ${response.status})`
    );
  }

  const result: IApiResponse<TopCourseEntry[]> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch top courses");
  }

  return result.data;
}

// ─── GET /api/Analytics/orders-summary ───

/**
 * Retrieves order counts by status plus the acceptance rate percentage.
 */
export async function getOrdersSummary(): Promise<OrdersSummaryData> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/Analytics/orders-summary`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch orders summary (Status: ${response.status})`
    );
  }

  const result: IApiResponse<OrdersSummaryData> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch orders summary");
  }

  return result.data;
}
