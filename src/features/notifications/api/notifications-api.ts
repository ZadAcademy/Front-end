"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  NotificationItem,
  NotificationPreferences,
  PaginatedResult,
  GetNotificationsParams,
} from "../lib/types/notification-types";

/* ─── Auth helper (same pattern as orders-api) ─── */
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

function buildQueryString(params?: Record<string, any>) {
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

/* ──────────────────────────────────────────────────────────
   1. GET /api/v1/notifications
   ────────────────────────────────────────────────────────── */
export async function getMyNotifications(
  params?: GetNotificationsParams
): Promise<PaginatedResult<NotificationItem>> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString(params);

  const response = await fetch(`${baseUrl}api/v1/notifications${qs}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications (Status: ${response.status})`);
  }

  const result: IApiResponse<PaginatedResult<NotificationItem>> =
    await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch notifications");
  }

  return result.data;
}

/* ──────────────────────────────────────────────────────────
   2. GET /api/v1/notifications/unread-count
   ────────────────────────────────────────────────────────── */
export async function getUnreadCount(): Promise<number> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/unread-count`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch unread count (Status: ${response.status})`);
  }

  const result: IApiResponse<number> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to fetch unread count");
  }

  return result.data ?? 0;
}

/* ──────────────────────────────────────────────────────────
   3. PUT /api/v1/notifications/{id}/read
   ────────────────────────────────────────────────────────── */
export async function markAsRead(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/${id}/read`, {
    method: "PUT",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to mark notification as read (Status: ${response.status})`);
  }

  const result: IApiResponse<object> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to mark as read");
  }

  return true;
}

/* ──────────────────────────────────────────────────────────
   4. PUT /api/v1/notifications/read-all
   ────────────────────────────────────────────────────────── */
export async function markAllAsRead(): Promise<number> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/read-all`, {
    method: "PUT",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to mark all as read (Status: ${response.status})`);
  }

  const result: IApiResponse<number> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to mark all as read");
  }

  return result.data ?? 0;
}

/* ──────────────────────────────────────────────────────────
   5. DELETE /api/v1/notifications/{id}
   ────────────────────────────────────────────────────────── */
export async function deleteNotification(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete notification (Status: ${response.status})`);
  }

  const result: IApiResponse<object> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to delete notification");
  }

  return true;
}

/* ──────────────────────────────────────────────────────────
   6. GET /api/v1/notifications/preferences
   ────────────────────────────────────────────────────────── */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/preferences`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch preferences (Status: ${response.status})`);
  }

  const result: IApiResponse<NotificationPreferences> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch preferences");
  }

  return result.data;
}

/* ──────────────────────────────────────────────────────────
   7. PUT /api/v1/notifications/preferences
   ────────────────────────────────────────────────────────── */
export async function updateNotificationPreferences(
  isEnabled: boolean
): Promise<boolean> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/preferences`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ isEnabled }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update preferences (Status: ${response.status})`);
  }

  const result: IApiResponse<object> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to update preferences");
  }

  return true;
}
