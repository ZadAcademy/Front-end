import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleFormData } from '../lib/schemas/roles-schemas';
import { 
  useGetRoleByIdQuery, 
  useGetPermissionsQuery, 
  useCreateRoleMutation, 
  useUpdateRoleMutation 
} from './use-roles-api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export const useRoleForm = (roleId: string | null, onClose: () => void) => {
  const t = useTranslations('Dashboard.roles.modal');
  const isEditing = !!roleId;

  const { data: roleData, isLoading: isLoadingRole } = useGetRoleByIdQuery(roleId);
  const { data: allPermissions = [], isLoading: isLoadingPermissions } = useGetPermissionsQuery();

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      isDefault: false,
      permissions: [],
    },
  });

  useEffect(() => {
    if (isEditing && roleData) {
      form.reset({
        name: roleData.name || '',
        description: roleData.description || '',
        isDefault: false,
        permissions: roleData.permissions || [],
      });
    } else if (!isEditing) {
      form.reset({ name: '', description: '', isDefault: false, permissions: [] });
    }
  }, [isEditing, roleData, form]);

  const onSubmit = (data: RoleFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: roleId!, newName: data.name, ...data },
        {
          onSuccess: () => {
            toast.success(t('updateSuccess', { defaultValue: 'Role updated successfully' }));
            onClose();
          },
          onError: (error) => {
            toast.error(error.message || t('updateFailed', { defaultValue: 'Failed to update role' }));
          }
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t('createSuccess', { defaultValue: 'Role created successfully' }));
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || t('createFailed', { defaultValue: 'Failed to create role' }));
        }
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    isLoading: (isEditing && isLoadingRole) || isLoadingPermissions,
    isEditing,
    allPermissions
  };
};
