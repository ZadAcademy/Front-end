import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  discountPolicySchema,
  DiscountPolicyFormData,
} from '../lib/schemas/discount-policy-schema';
import { useUpdateDiscountPolicyMutation } from './use-ambassadors-api';
import { DiscountPolicyResponse } from '../lib/types/ambassador-types';

interface UseDiscountPolicyFormOptions {
  /** Policy being edited */
  policy: DiscountPolicyResponse | null;
  onClose: () => void;
}

const toFormValues = (
  policy: DiscountPolicyResponse | null
): DiscountPolicyFormData => ({
  percent: policy?.percent ?? 0,
  isActive: policy?.isActive ?? false,
  minItems: policy?.minItems ?? null,
  maxItems: policy?.maxItems ?? null,
  grantExpiryDays: policy?.grantExpiryDays ?? null,
});

export const useDiscountPolicyForm = ({
  policy,
  onClose,
}: UseDiscountPolicyFormOptions) => {
  const t = useTranslations('Dashboard.ambassadors.modal');
  const updateMutation = useUpdateDiscountPolicyMutation();

  const form = useForm<DiscountPolicyFormData>({
    resolver: zodResolver(discountPolicySchema),
    defaultValues: toFormValues(policy),
  });

  // Re-populate whenever a different policy is opened
  useEffect(() => {
    form.reset(toFormValues(policy));
  }, [policy, form]);

  const onSubmit = (data: DiscountPolicyFormData) => {
    if (!policy) return;

    updateMutation.mutate(
      {
        type: policy.type,
        payload: {
          percent: data.percent,
          isActive: data.isActive,
          minItems: data.minItems,
          maxItems: data.maxItems,
          grantExpiryDays: data.grantExpiryDays,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            t('updateSuccess', {
              defaultValue: 'Discount policy updated successfully',
            })
          );
          onClose();
        },
        onError: (error) => {
          toast.error(
            error.message ||
              t('updateFailed', {
                defaultValue: 'Failed to update discount policy',
              })
          );
        },
      }
    );
  };

  return {
    form,
    onSubmit,
    isSubmitting: updateMutation.isPending,
  };
};
