"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  AdminNotificationHistoryItem,
  ExpiringEnrollmentItem,
  GetAdminHistoryParams,
  PaginatedResult,
  SendNotificationRequest,
  SendNotificationResponse,
  SendPriceAlertRequest,
  SendPriceAlertResponse,
} from "../lib/types/notification-types";

/* ─── Auth helper ─── */
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
   8. POST /api/v1/notifications/send
   ────────────────────────────────────────────────────────── */
export async function sendNotification(
  data: SendNotificationRequest
): Promise<SendNotificationResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/send`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to send notification (Status: ${response.status})`
    );
  }

  const result: IApiResponse<SendNotificationResponse> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to send notification");
  }

  return result.data;
}

/* ──────────────────────────────────────────────────────────
   9. GET /api/v1/notifications/admin/history
   ────────────────────────────────────────────────────────── */
export async function getAdminHistory(
  params?: GetAdminHistoryParams
): Promise<PaginatedResult<AdminNotificationHistoryItem>> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString(params);

  const response = await fetch(
    `${baseUrl}api/v1/notifications/admin/history${qs}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch notification history (Status: ${response.status})`
    );
  }

  const result: IApiResponse<PaginatedResult<AdminNotificationHistoryItem>> =
    await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch notification history");
  }

  return result.data;
}

/* ──────────────────────────────────────────────────────────
   10. DELETE /api/v1/notifications/admin/{id}
   ────────────────────────────────────────────────────────── */
export async function adminDeleteNotification(
  id: string,
  userId?: string
): Promise<number> {
  const headers = await getAuthHeaders();
  const qs = userId ? `?userId=${userId}` : "";

  const response = await fetch(
    `${baseUrl}api/v1/notifications/admin/${id}${qs}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete notification (Status: ${response.status})`
    );
  }

  const result: IApiResponse<number> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to delete notification");
  }

  return result.data ?? 0;
}

/* ──────────────────────────────────────────────────────────
   11. POST /api/v1/notifications/enrollment-expiry/trigger
   ────────────────────────────────────────────────────────── */
export async function triggerEnrollmentExpiry(): Promise<number> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${baseUrl}api/v1/notifications/enrollment-expiry/trigger`,
    {
      method: "POST",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to trigger expiry check (Status: ${response.status})`
    );
  }

  const result: IApiResponse<number> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to trigger expiry check");
  }

  return result.data ?? 0;
}

/* ──────────────────────────────────────────────────────────
   12. GET /api/v1/notifications/enrollment-expiry/preview
   ────────────────────────────────────────────────────────── */
export async function previewEnrollmentExpiry(
  daysUntilExpiry = 7
): Promise<ExpiringEnrollmentItem[]> {
  const headers = await getAuthHeaders();
  const qs = `?daysUntilExpiry=${daysUntilExpiry}`;

  const response = await fetch(
    `${baseUrl}api/v1/notifications/enrollment-expiry/preview${qs}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to preview expirations (Status: ${response.status})`
    );
  }

  const result: IApiResponse<ExpiringEnrollmentItem[]> =
    await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to preview expirations");
  }

  return result.data;
}

/* ──────────────────────────────────────────────────────────
   13. POST /api/v1/notifications/price-alert
   ────────────────────────────────────────────────────────── */
export async function sendPriceAlert(
  data: SendPriceAlertRequest
): Promise<SendPriceAlertResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/v1/notifications/price-alert`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to send price alert (Status: ${response.status})`
    );
  }

  const result: IApiResponse<SendPriceAlertResponse> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to send price alert");
  }

  return result.data;
}
