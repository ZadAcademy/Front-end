"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  AdminCertificatesPaginatedResult,
  GetAdminCertificatesParams,
} from "../lib/types/admin-certificates-types";

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

function buildQueryString(params?: GetAdminCertificatesParams) {
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
 * GET /api/admin/certificates
 * Admin: Get all certificates (paginated, searchable, sortable)
 */
export async function getAdminCertificates(
  params?: GetAdminCertificatesParams
): Promise<AdminCertificatesPaginatedResult> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString(params);

  const response = await fetch(`${baseUrl}api/admin/certificates${qs}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch certificates (Status: ${response.status})`);
  }

  const result: IApiResponse<AdminCertificatesPaginatedResult> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch certificates");
  }

  return result.data;
}

/**
 * PUT /api/admin/certificates/{id}
 * Admin: Update a certificate
 */
export async function updateCertificate(
  id: string,
  data: import("../lib/types/admin-certificates-types").UpdateCertificateRequest
): Promise<boolean> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/admin/certificates/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to update certificate (Status: ${response.status})`);
  }

  const result: IApiResponse<boolean> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to update certificate");
  }

  return true;
}

/**
 * DELETE /api/admin/certificates/{id}
 * Admin: Delete a certificate
 */
export async function deleteCertificate(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/admin/certificates/${id}`, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete certificate (Status: ${response.status})`);
  }

  const result: IApiResponse<boolean> = await response.json();

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to delete certificate");
  }

  return true;
}
