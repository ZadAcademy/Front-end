"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  DiscountPolicyResponse,
  UpdateDiscountPolicyPayload,
} from "../lib/types/ambassador-types";

/**
 * Returns auth headers with Bearer token.
 */
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
    ...(decodedToken?.token
      ? { Authorization: `Bearer ${decodedToken.token}` }
      : {}),
  };
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * GET /api/v1/admin/ambassadors/policies
 * Returns all discount policies (admin only).
 */
export async function getDiscountPolicies() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/v1/admin/ambassadors/policies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message || "Failed to fetch discount policies",
      };
    }

    const resultData: IApiResponse<DiscountPolicyResponse[]> =
      await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError: resultData.message || "Failed to fetch discount policies",
      };
    }

    return resultData.data as DiscountPolicyResponse[];
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}

/**
 * PUT /api/v1/admin/ambassadors/policies/{type}
 * Updates a discount policy (admin only).
 */
export async function updateDiscountPolicy(
  type: number,
  payload: UpdateDiscountPolicyPayload
) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${baseUrl}api/v1/admin/ambassadors/policies/${type}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message ||
          errorData?.errors?.[0] ||
          "Failed to update discount policy",
      };
    }

    const resultData: IApiResponse<unknown> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError:
          resultData.message ||
          resultData.errors?.[0] ||
          "Failed to update discount policy",
      };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}
