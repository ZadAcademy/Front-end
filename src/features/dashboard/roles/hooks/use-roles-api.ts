import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getRoles,
  getPermissions,
  getRoleById,
  createRole,
  updateRole,
  toggleRoleStatus,
  updateUserRoles
} from '../api/roles-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

export const useGetRolesQuery = (includeDisabled = false) => {
  return useQuery({
    queryKey: ['roles', { includeDisabled }],
    queryFn: () => unwrap(getRoles(includeDisabled)),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetPermissionsQuery = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => unwrap(getPermissions()),
    staleTime: 1000 * 60 * 60, // Permissions rarely change
  });
};

export const useGetRoleByIdQuery = (roleId: string | null) => {
  return useQuery({
    queryKey: ['role', roleId],
    queryFn: () => unwrap(getRoleById(roleId!)),
    enabled: !!roleId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => unwrap(createRole(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => unwrap(updateRole(payload)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
    },
  });
};

export const useToggleRoleStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => unwrap(toggleRoleStatus(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateUserRolesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => unwrap(updateUserRoles(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
