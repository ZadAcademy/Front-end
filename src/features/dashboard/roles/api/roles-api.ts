"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import {
  RoleListItem,
  RoleDetail,
  CreateRolePayload,
  UpdateRolePayload,
  UpdateUserRolesPayload
} from "../lib/types/roles-types";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }
  return {
    'Content-Type': 'application/json',
    ...(decodedToken?.token ? { 'Authorization': `Bearer ${decodedToken.token}` } : {})
  };
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export async function getRoles(includeDisabled = false) {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(`${baseUrl}api/Roles`);
    url.searchParams.set('IncludeDisabled', String(includeDisabled));

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to fetch roles' };
    }

    const resultData: IApiResponse<RoleListItem[]> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to fetch roles' };
    }

    return resultData.data as RoleListItem[];
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function getPermissions() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Roles/permissions`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to fetch permissions' };
    }

    const resultData: IApiResponse<string[]> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to fetch permissions' };
    }

    return resultData.data as string[];
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function getRoleById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Roles/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || 'Failed to fetch role details' };
    }

    const resultData: IApiResponse<RoleDetail> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || 'Failed to fetch role details' };
    }

    return resultData.data as RoleDetail;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function createRole(payload: CreateRolePayload) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || errorData?.errors?.[0] || 'Failed to create role' };
    }

    const resultData: IApiResponse<boolean> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || resultData.errors?.[0] || 'Failed to create role' };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function updateRole(payload: UpdateRolePayload) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Roles/${payload.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || errorData?.errors?.[0] || 'Failed to update role' };
    }

    const resultData: IApiResponse<boolean> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || resultData.errors?.[0] || 'Failed to update role' };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function toggleRoleStatus(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Roles/${id}/toggle-status`, {
      method: 'PUT',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || errorData?.errors?.[0] || 'Failed to toggle role status' };
    }

    const resultData: IApiResponse<boolean> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || resultData.errors?.[0] || 'Failed to toggle role status' };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}

export async function updateUserRoles(payload: UpdateUserRolesPayload) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}api/Roles/user-roles`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { serverError: errorData?.message || errorData?.errors?.[0] || 'Failed to assign user roles' };
    }
    console.log("update user roles api response",response)

    const resultData: IApiResponse<boolean> = await response.json();
    if (!resultData.isSuccess) {
      return { serverError: resultData.message || resultData.errors?.[0] || 'Failed to assign user roles' };
    }

    return true;
  } catch (error: any) {
    return { serverError: error?.message || 'An unknown error occurred' };
  }
}
