"use server";

// ─── Lesson API (Server Actions) ───
// Follows the same pattern as section-api.ts:
//   - "use server" directive for Next.js server actions
//   - Auth via cookies + JWT decode
//   - IApiResponse<T> for response typing
//   - fetch() with manual error handling

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  CreateGoogleDriveVideoLessonRequest,
  UpdateLessonRequest,
} from "../lib/types/lesson";

// ─── Auth helper (same pattern as section-api.ts) ───

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return {
    "Content-Type": "application/json",
    ...(decodedToken?.token
      ? { Authorization: `Bearer ${decodedToken.token}` }
      : {}),
  };
};

// Same helper but without Content-Type — needed for multipart/form-data (PDF upload)
const getAuthHeadersForFormData = async () => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return {
    ...(decodedToken?.token
      ? { Authorization: `Bearer ${decodedToken.token}` }
      : {}),
  };
};

// ─── CREATE: Google Drive Video Lesson ───
// POST /api/v1/lessons/google-drive-video  (JSON body)

export const createGoogleDriveVideoLesson = async (data: CreateGoogleDriveVideoLessonRequest) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await fetch(
      `${baseUrl}api/v1/lessons/google-drive-video`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    console.log("video lesson response", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || "Failed to create video lesson." };
    }

    const resultData: IApiResponse<{ lessonId: string }> =
      await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || "Failed to create video lesson" };
    }

    return resultData.data;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
};

// ─── CREATE: PDF Lesson ───
// POST /api/v1/lessons/pdf  (multipart/form-data)
// File limit: max 25 MB, .pdf only

export const createPdfLesson = async (formData: FormData) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await fetch(`${baseUrl}api/v1/lessons/pdf`, {
      method: "POST",
      headers: await getAuthHeadersForFormData(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || "Failed to create PDF lesson." };
    }

    const resultData: IApiResponse<{ lessonId: string }> =
      await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || "Failed to create PDF lesson" };
    }

    return resultData.data;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
};

// ─── UPDATE: Full Lesson Details & Order ───
// PUT /api/v1/lessons/{id}

export const updateLesson = async ({id,data,}: {id: string;data: UpdateLessonRequest;}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await fetch(`${baseUrl}api/v1/lessons/${id}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || "Failed to update lesson." };
    }

    const resultData: IApiResponse<null> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || "Failed to update lesson" };
    }

    return resultData.data;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
};


// ─── DELETE: Soft Delete Lesson ───
// DELETE /api/v1/lessons/{id}
// Backend auto-reindexes sibling lessons after deletion.

export const deleteLesson = async (id: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await fetch(`${baseUrl}api/v1/lessons/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || "Failed to delete lesson." };
    }

    const resultData: IApiResponse<null> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || "Failed to delete lesson" };
    }

    return resultData.data;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
};
