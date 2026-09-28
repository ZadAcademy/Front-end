"use server";

import { IApiResponse } from "@/shared/lib/types/api";
import { CertificateData } from "../lib/types/verify-certificate-types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export async function verifyCertificate(code: string): Promise<CertificateData> {
  const response = await fetch(`${baseUrl}api/certificates/${code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // No auth headers needed for public verification
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to verify certificate (Status: ${response.status})`
    );
  }

  const result: IApiResponse<CertificateData> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Certificate not found or invalid");
  }

  return result.data;
}
