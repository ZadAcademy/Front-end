"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { ImportCertificateData } from "../lib/types/certificate-types";

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

export async function importCertificates(
  formData: FormData
): Promise<ImportCertificateData> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${baseUrl}api/admin/certificates/import`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to import certificates (Status: ${response.status})`
    );
  }

  const result: IApiResponse<ImportCertificateData> = await response.json();

  if (!result.isSuccess || !result.data) {
    throw new Error(result.message || "Failed to import certificates");
  }

  return result.data;
}
