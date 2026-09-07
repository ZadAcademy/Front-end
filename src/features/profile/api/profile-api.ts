"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { CurrentUserResponse, UpdateProfileRequest } from "../lib/types/profile-types";

async function getAuthHeaders(isFormData = false) {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }
  
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (decodedToken?.token) {
    headers['Authorization'] = `Bearer ${decodedToken.token}`;
  }
  return headers;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export async function getProfile() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/users/me`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to fetch profile' };
    }

    const resultData: IApiResponse<CurrentUserResponse> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to fetch profile' };
    }

    return resultData.data as CurrentUserResponse;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function updateProfile(data: UpdateProfileRequest) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/users/me`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to update profile' };
    }

    const resultData: IApiResponse<boolean> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to update profile' };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function updateProfileImage(image: File) {
  try {
    const headers = await getAuthHeaders(true); // isFormData = true
    
    const formData = new FormData();
    formData.append('Image', image);

    const response = await fetch(`${baseUrl}api/users/me/profile-image`, {
      method: 'PUT',
      headers,
      body: formData,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to update profile image' };
    }

    const resultData: IApiResponse<string> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to update profile image' };
    }

    return resultData.data as string;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function deleteProfileImage() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/users/me/profile-image`, {
      method: 'DELETE',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to delete profile image' };
    }

    const resultData: IApiResponse<boolean> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to delete profile image' };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}
