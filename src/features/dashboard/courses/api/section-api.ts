"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { SectionDto, CreateSectionRequest, UpdateSectionRequest } from "../lib/types/section";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const decodedToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return {
    'Content-Type': 'application/json',
    ...(decodedToken?.token ? { Authorization: `Bearer ${decodedToken.token}` } : {})
  };
};

export const getSectionsByCourseId = async (courseId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const response = await fetch(`${baseUrl}api/v1/sections/course/${courseId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch sections.');
  }

  const resultData: IApiResponse<SectionDto[]> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to fetch sections');
  }

  return resultData.data || [];
};

export const createSection = async (data: CreateSectionRequest) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const response = await fetch(`${baseUrl}api/v1/sections`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to create section.');
  }

  const resultData: IApiResponse<string> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to create section');
  }

  return resultData.data;
};

export const updateSection = async ({ id, data }: { id: string; data: UpdateSectionRequest }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const response = await fetch(`${baseUrl}api/v1/sections/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update section.');
  }

  const resultData: IApiResponse<null> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update section');
  }

  return resultData.data;
};

export const deleteSection = async (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const response = await fetch(`${baseUrl}api/v1/sections/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to delete section.');
  }

  const resultData: IApiResponse<null> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to delete section');
  }

  return resultData.data;
};
