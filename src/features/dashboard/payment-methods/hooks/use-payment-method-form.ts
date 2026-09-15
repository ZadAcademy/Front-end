import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  paymentMethodSchema,
  PaymentMethodFormData,
} from '../lib/schemas/payment-method-schema';
import {
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} from './use-payment-methods-api';
import { CountryPaymentMethodResponse } from '../lib/types/payment-method-types';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface UsePaymentMethodFormOptions {
  /** Pass existing data when editing, null when creating */
  editingMethod: CountryPaymentMethodResponse | null;
  onClose: () => void;
}

export const usePaymentMethodForm = ({
  editingMethod,
  onClose,
}: UsePaymentMethodFormOptions) => {
  const t = useTranslations('Dashboard.paymentMethods.modal');
  const isEditing = !!editingMethod;

  const createMutation = useCreatePaymentMethodMutation();
  const updateMutation = useUpdatePaymentMethodMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Logo file state (separate from react-hook-form since File can't go through zod easily)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      countryCode: '',
      title: '',
      accountIdentifier: '',
      instructionDescription: '',
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (isEditing && editingMethod) {
      form.reset({
        countryCode: editingMethod.countryCode || '',
        title: editingMethod.title || '',
        accountIdentifier: editingMethod.accountIdentifier || '',
        instructionDescription: editingMethod.instructionDescription || '',
      });
      setLogoFile(null);
      setLogoError(null);
    } else {
      form.reset({
        countryCode: '',
        title: '',
        accountIdentifier: '',
        instructionDescription: '',
      });
      setLogoFile(null);
      setLogoError(null);
    }
  }, [isEditing, editingMethod, form]);

  const onSubmit = (data: PaymentMethodFormData) => {
    // Validate logo on create (required)
    if (!isEditing && !logoFile) {
      setLogoError('logoRequired');
      return;
    }

    // Build FormData with exact field names the backend expects
    const formData = new FormData();
    formData.append('CountryCode', data.countryCode.toUpperCase());
    formData.append('Title', data.title);
    formData.append('AccountIdentifier', data.accountIdentifier);
    formData.append('InstructionDescription', data.instructionDescription);

    if (isEditing) {
      formData.append('Id', editingMethod!.id);
      if (logoFile) {
        formData.append('Logo', logoFile);
      }

      updateMutation.mutate(
        { id: editingMethod!.id, formData },
        {
          onSuccess: () => {
            toast.success(
              t('updateSuccess', {
                defaultValue: 'Payment method updated successfully',
              })
            );
            onClose();
          },
          onError: (error) => {
            toast.error(
              error.message ||
                t('updateFailed', {
                  defaultValue: 'Failed to update payment method',
                })
            );
          },
        }
      );
    } else {
      formData.append('Logo', logoFile!);

      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success(
            t('createSuccess', {
              defaultValue: 'Payment method created successfully',
            })
          );
          onClose();
        },
        onError: (error) => {
          toast.error(
            error.message ||
              t('createFailed', {
                defaultValue: 'Failed to create payment method',
              })
          );
        },
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    isEditing,
    logoFile,
    setLogoFile,
    logoError,
    setLogoError,
  };
};
