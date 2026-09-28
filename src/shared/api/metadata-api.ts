"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  MetadataItem,
  UserMetadataItem,
  MetadataParams,
  PaginatedMetadata,
} from "@/shared/lib/types/metadata-types";

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
   GET /api/v1/courses/metadata
   ────────────────────────────────────────────────────────── */
export async function getCoursesMetadata(
  params?: MetadataParams
): Promise<PaginatedMetadata<MetadataItem>> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString({
    Page: params?.page,
    PageSize: params?.pageSize,
    Search: params?.search,
  });

  const response = await fetch(`${baseUrl}api/v1/courses/metadata${qs}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch courses metadata (Status: ${response.status})`
    );
  }

  const result: IApiResponse<PaginatedMetadata<MetadataItem>> =
    await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch courses metadata");
  }

  return result.data;
}

/* ──────────────────────────────────────────────────────────
   GET /api/Users/metadata
   ────────────────────────────────────────────────────────── */
export async function getUsersMetadata(
  params?: MetadataParams
): Promise<PaginatedMetadata<UserMetadataItem>> {
  const headers = await getAuthHeaders();
  const qs = buildQueryString({
    Page: params?.page,
    PageSize: params?.pageSize,
    Search: params?.search,
  });

  const response = await fetch(`${baseUrl}api/Users/metadata${qs}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users metadata (Status: ${response.status})`
    );
  }

  const result: IApiResponse<PaginatedMetadata<UserMetadataItem>> =
    await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to fetch users metadata");
  }

  return result.data;
}
