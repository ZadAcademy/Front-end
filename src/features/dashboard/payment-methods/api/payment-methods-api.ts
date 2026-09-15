"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { CountryPaymentMethodResponse } from "../lib/types/payment-method-types";

/**
 * Returns auth headers with Bearer token (no Content-Type — let fetch set it for FormData).
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
// USER ENDPOINT
// ==========================================

/**
 * GET /api/v1/payment-methods
 * Returns payment methods for the authenticated user's country.
 */
export async function getMyPaymentMethods() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/v1/payment-methods`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message || "Failed to fetch payment methods",
      };
    }

    const resultData: IApiResponse<CountryPaymentMethodResponse[]> =
      await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError: resultData.message || "Failed to fetch payment methods",
      };
    }

    return resultData.data as CountryPaymentMethodResponse[];
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * GET /api/v1/admin/payment-methods
 * Returns all payment methods across all countries.
 */
export async function getAllPaymentMethods() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/v1/admin/payment-methods`, {
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
          errorData?.message || "Failed to fetch payment methods",
      };
    }

    const resultData: IApiResponse<CountryPaymentMethodResponse[]> =
      await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError: resultData.message || "Failed to fetch payment methods",
      };
    }

    return resultData.data as CountryPaymentMethodResponse[];
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}

/**
 * POST /api/v1/admin/payment-methods
 * Creates a new payment method (multipart/form-data).
 */
export async function createPaymentMethod(formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/v1/admin/payment-methods`, {
      method: "POST",
      headers, // No Content-Type — let fetch set boundary for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message ||
          errorData?.errors?.[0] ||
          "Failed to create payment method",
      };
    }

    const resultData: IApiResponse<string> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError:
          resultData.message ||
          resultData.errors?.[0] ||
          "Failed to create payment method",
      };
    }

    return resultData.data as string;
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}

/**
 * PUT /api/v1/admin/payment-methods/{id}
 * Updates a payment method (multipart/form-data).
 * Id must be in both route param AND FormData body.
 */
export async function updatePaymentMethod(id: string, formData: FormData) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${baseUrl}api/v1/admin/payment-methods/${id}`,
      {
        method: "PUT",
        headers, // No Content-Type — let fetch set boundary for FormData
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message ||
          errorData?.errors?.[0] ||
          "Failed to update payment method",
      };
    }

    const resultData: IApiResponse<unknown> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError:
          resultData.message ||
          resultData.errors?.[0] ||
          "Failed to update payment method",
      };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}

/**
 * DELETE /api/v1/admin/payment-methods/{id}
 * Soft-deletes a payment method.
 */
export async function deletePaymentMethod(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${baseUrl}api/v1/admin/payment-methods/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError:
          errorData?.message || "Failed to delete payment method",
      };
    }

    const resultData: IApiResponse<unknown> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError: resultData.message || "Failed to delete payment method",
      };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}
