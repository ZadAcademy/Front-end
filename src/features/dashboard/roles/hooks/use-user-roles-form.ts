import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRolesSchema, UserRolesFormData } from '../lib/schemas/roles-schemas';
import { useGetRolesQuery, useUpdateUserRolesMutation } from './use-roles-api';
import { UserWithRoles } from '../lib/types/roles-types';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export const useUserRolesForm = (user: UserWithRoles, onClose: () => void) => {
  console.log("selected user",user);
  const t = useTranslations('Dashboard.users.modal');
  const { data: allRoles = [], isLoading: isLoadingRoles } = useGetRolesQuery(false);
  const updateMutation = useUpdateUserRolesMutation();

  const form = useForm<UserRolesFormData>({
    resolver: zodResolver(userRolesSchema),
    defaultValues: {
      roles: [],
    },
  });

  useEffect(() => {
    if (user && user.roles) {
      form.reset({
        roles: user.roles.map(r => r.id)
      });
    }
  }, [user, form]);

  const onSubmit = (data: UserRolesFormData) => {
    console.log("upsate user roles",data);
    updateMutation.mutate(
      { userId: user.id, roles: data.roles },
      {
        onSuccess: () => {
          toast.success(t('updateSuccess', { defaultValue: 'User roles updated successfully' }));
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || t('updateFailed', { defaultValue: 'Failed to update user roles' }));
        }
      }
    );
  };

  return {
    form,
    onSubmit,
    isSubmitting: updateMutation.isPending,
    isLoadingRoles,
    allRoles
  };
};
