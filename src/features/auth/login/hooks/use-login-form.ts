'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { loginSchema, type LoginFormValues } from '../lib/schema/login.schema';

/**
 * useLoginForm — Custom hook for login form logic.
 *
 * Uses:
 *  - react-hook-form with Zod v4 resolver for validation
 *  - next-auth signIn('credentials') for authentication
 *  - formState.isSubmitting for loading state
 *  - form.setError('root', ...) for server/auth errors
 *
 * @param onSuccess — optional callback invoked after successful login (e.g. close modal)
 */
export function useLoginForm(onSuccess?: () => void) {
  const t = useTranslations('Auth.login.errors');
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.toLowerCase().includes('not confirmed') || result.error.toLowerCase().includes('verify')) {
          form.setError('root', {
            message: 'unverifiedEmail',
          });
        } else {
          form.setError('root', {
            message: t('invalidCredentials'),
          });
        }
        return;
      }

      // Success
      if (onSuccess) {
        onSuccess();
      }
      
      // Use replace instead of push so they can't click the browser 'back' button to go to login
      router.replace('/home');
      router.refresh();
    } catch {
      form.setError('root', {
        message: t('generic'),
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
