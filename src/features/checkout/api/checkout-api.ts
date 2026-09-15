"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

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
 * POST /api/v1/orders
 * Uploads a payment receipt image for a course.
 */
export async function submitOrder(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/v1/orders`, {
      method: "POST",
      headers, // No Content-Type — let fetch set boundary for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Specifically return conflict messages for frontend handling
      if (response.status === 409) {
        return {
          serverError:
            errorData?.message || errorData?.errors?.[0] || "Conflict error",
          status: 409,
        };
      }

      return {
        serverError:
          errorData?.message ||
          errorData?.errors?.[0] ||
          "Failed to submit order",
      };
    }

    const resultData: IApiResponse<string> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError:
          resultData.message ||
          resultData.errors?.[0] ||
          "Failed to submit order",
      };
    }

    return resultData.data as string;
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}
