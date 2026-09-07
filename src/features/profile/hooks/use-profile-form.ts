'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { profileSchema, type ProfileFormValues } from '../lib/schema/profile.schema';
import { useGetProfileQuery, useUpdateProfileMutation } from './use-profile-api';

export function useProfileForm() {
  const t = useTranslations('Profile.errors');
  const tSuccess = useTranslations('Profile.success');
  const { update } = useSession();
  
  const { data: profile } = useGetProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      countryCode: '+20',
      phoneNumber: '',
      specialtyId: null,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        countryCode: profile.countryCode || '+20',
        phoneNumber: profile.phoneNumber || '',
        specialtyId: profile.specialtyId || null,
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        specialtyId: data.specialtyId || null,
      });
      await update({ user: { firstName: data.firstName, lastName: data.lastName } });
      toast.success(tSuccess('profileUpdated', { defaultValue: 'Profile updated successfully!' }));
    } catch (error: any) {
      toast.error(error.message || t('updateFailed', { defaultValue: 'Failed to update profile' }));
      form.setError('root', {
        message: error.message || t('updateFailed', { defaultValue: 'Failed to update profile' }),
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: updateMutation.isPending,
  };
}
