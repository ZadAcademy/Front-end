"use server";

import { IApiResponse } from "@/shared/lib/types/api";
import { AmbassadorProgram } from "../lib/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * GET /api/v1/ambassadors/programs
 * Returns all active ambassador programs (public).
 */
export async function getAmbassadorPrograms() {
  try {
    const response = await fetch(`${baseUrl}api/v1/ambassadors/programs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        serverError: errorData?.message || "Failed to fetch ambassador programs",
      };
    }

    const resultData: IApiResponse<AmbassadorProgram[]> = await response.json();
    if (!resultData.isSuccess) {
      return {
        serverError: resultData.message || "Failed to fetch ambassador programs",
      };
    }
    return resultData.data as AmbassadorProgram[];
  } catch (error: any) {
    return { serverError: error?.message || "An unknown error occurred" };
  }
}
