import { useQuery } from '@tanstack/react-query';
import { getCoursesMetadata, getUsersMetadata } from '../api/metadata-api';
import { MetadataParams } from '../lib/types/metadata-types';

/* ─── Query Keys ─── */
export const metadataKeys = {
  courses: (params?: MetadataParams) => ['courses-metadata', params] as const,
  users: (params?: MetadataParams) => ['users-metadata', params] as const,
};

/* ──────────────────────────────────────────────────────────
   Courses Metadata
   ────────────────────────────────────────────────────────── */
export const useCoursesMetadataQuery = (
  params?: MetadataParams,
  enabled = true
) => {
  return useQuery({
    queryKey: metadataKeys.courses(params),
    queryFn: () => getCoursesMetadata(params),
    enabled,
  });
};

/* ──────────────────────────────────────────────────────────
   Users Metadata
   ────────────────────────────────────────────────────────── */
export const useUsersMetadataQuery = (
  params?: MetadataParams,
  enabled = true
) => {
  return useQuery({
    queryKey: metadataKeys.users(params),
    queryFn: () => getUsersMetadata(params),
    enabled,
  });
};
