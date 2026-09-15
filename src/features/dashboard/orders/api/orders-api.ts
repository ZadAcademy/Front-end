"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { CourseOrdersResponse, GetOrdersQueryParams, UpdateOrderStatusRequest } from "../lib/types/orders-types";

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

function buildQueryString(params?: GetOrdersQueryParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * GET /api/v1/orders
 * Admin: Get all orders (paginated, split into newOrders and oldOrders)
 */
export async function getAllOrders(params?: GetOrdersQueryParams): Promise<CourseOrdersResponse> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString(params);

  const response = await fetch(`${baseUrl}api/v1/orders${qs}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders (Status: ${response.status})`);
  }

  const result: IApiResponse<CourseOrdersResponse> = await response.json();
  
  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch orders");
  }

  return result.data;
}

/**
 * GET /api/v1/orders/courses/{courseId}
 * Admin: Get orders for a specific course
 */
export async function getCourseOrders(courseId: string, params?: GetOrdersQueryParams): Promise<CourseOrdersResponse> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString(params);

  const response = await fetch(`${baseUrl}api/v1/orders/courses/${courseId}${qs}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course orders (Status: ${response.status})`);
  }

  const result: IApiResponse<CourseOrdersResponse> = await response.json();
  
  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch course orders");
  }

  return result.data;
}

/**
 * PUT /api/v1/orders/{orderId}/status
 * Admin: Accept or Deny an order
 */
export async function updateOrderStatus(orderId: string, request: UpdateOrderStatusRequest): Promise<boolean> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${baseUrl}api/v1/orders/${orderId}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.errors?.[0] || "Failed to update order status");
  }

  const result: IApiResponse<boolean> = await response.json();
  
  if (!result.isSuccess) {
    throw new Error(result.message || result.errors?.[0] || "Failed to update order status");
  }

  return result.data ?? true;
}
