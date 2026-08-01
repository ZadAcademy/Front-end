"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";

export interface LocalizedPricePayload {
  id: string;
  countryCode: string;
  currencyCode: string;
  price: number;
  discountPrice?: number | null;
}

export interface CreateLocalizedPricesPayload {
  prices: LocalizedPricePayload[];
}



export const updateLocalizedPrices = async (courseId: string, data: CreateLocalizedPricesPayload) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/localized-prices`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update localized prices. Please try again.');
  }

  const resultData: IApiResponse<string> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update localized prices');
  }

  return resultData.data;
};

export const deleteLocalizedPrice = async (courseId: string, priceId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const response = await fetch(`${baseUrl}api/v1/courses/${courseId}/localized-prices/${priceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${decodedToken?.token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to delete localized price. Please try again.');
  }

  const resultData: IApiResponse<string> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to delete localized price');
  }

  return resultData.data;
};
