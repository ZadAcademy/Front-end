"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export interface SubmitDiscountRequestPayload {
  courseId: string;
  discountType: number;
  proofData?: string[] | null;
  courseName?: string | null;
  courseNumber?: string | null;
  notes?: string | null;
}

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

/**
 * POST /api/v1/discount-requests
 * Submits a discount request form before placing an order.
 * Returns the created discount requestId (string UUID).
 */
export async function submitDiscountRequest(payload: SubmitDiscountRequestPayload) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { serverError: "Unauthenticated" };
    }

    const response = await fetch(`${baseUrl}api/v1/discount-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message ||
          errorData?.errors?.[0] ||
          "Failed to submit discount request",
      };
    }

    const resultData: IApiResponse<string> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError:
          resultData.message ||
          resultData.errors?.[0] ||
          "Failed to submit discount request",
      };
    }

    return resultData.data; // discount requestId string
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}
