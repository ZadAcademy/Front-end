"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { IApiResponse } from "@/shared/lib/types/api";
import { PaginatedResult } from "@/features/dashboard/roles/lib/types/roles-types"; // Assuming this exists or create one here
import { Post, GetPostsQueryParams, CreatePostPayload, UpdatePostPayload } from "../lib/types/posts-types";

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

export async function getPosts(params: GetPostsQueryParams = {}): Promise<PaginatedResult<Post>> {
  const headers = await getAuthHeaders();
  const url = new URL(`${baseUrl}api/v1/posts`);
  
  if (params.page !== undefined) url.searchParams.set('page', String(params.page));
  if (params.pageSize !== undefined) url.searchParams.set('pageSize', String(params.pageSize));
  if (params.isPublic !== undefined) url.searchParams.set('isPublic', String(params.isPublic));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch posts');
  }

  const resultData: IApiResponse<PaginatedResult<Post>> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to fetch posts');
  }

  return resultData.data as PaginatedResult<Post>;
}

export async function getPostById(id: string): Promise<Post> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${baseUrl}api/v1/posts/${id}`, {
    method: 'GET',
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch post');
  }

  const resultData: IApiResponse<Post> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to fetch post');
  }

  return resultData.data as Post;
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const headers = await getAuthHeaders(true); // isFormData = true
  
  const formData = new FormData();
  formData.append('Title', payload.Title);
  formData.append('Content', payload.Content);
  formData.append('IsPublic', String(payload.IsPublic));
  
  if (payload.Image) {
    formData.append('Image', payload.Image);
  }

  const response = await fetch(`${baseUrl}api/v1/posts`, {
    method: 'POST',
    headers,
    body: formData,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to create post');
  }

  const resultData: IApiResponse<Post> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to create post');
  }

  return resultData.data as Post;
}

export async function updatePost(id: string, payload: UpdatePostPayload): Promise<boolean> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${baseUrl}api/v1/posts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update post');
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update post');
  }

  return true;
}

export async function deletePost(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${baseUrl}api/v1/posts/${id}`, {
    method: 'DELETE',
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to delete post');
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to delete post');
  }

  return true;
}

export async function togglePostVisibility(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${baseUrl}api/v1/posts/${id}/visibility`, {
    method: 'PUT',
    headers,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to toggle visibility');
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to toggle visibility');
  }

  return true;
}

export async function updatePostImage(id: string, image: File): Promise<boolean> {
  const headers = await getAuthHeaders(true); // isFormData = true
  
  const formData = new FormData();
  formData.append('Image', image);

  const response = await fetch(`${baseUrl}api/v1/posts/${id}/image`, {
    method: 'PUT',
    headers,
    body: formData,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update image');
  }

  const resultData: IApiResponse<boolean> = await response.json();
  if (!resultData.isSuccess) {
    throw new Error(resultData.message || 'Failed to update image');
  }

  return true;
}
