import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getAllPaymentMethods,
  getMyPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../api/payment-methods-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

// ==========================================
// QUERIES
// ==========================================

/**
 * Fetches all payment methods (admin — across all countries).
 */
export const useGetAllPaymentMethodsQuery = () => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => unwrap(getAllPaymentMethods()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetches payment methods for the authenticated user's country (checkout page).
 */
export const useGetMyPaymentMethodsQuery = () => {
  return useQuery({
    queryKey: ['myPaymentMethods'],
    queryFn: () => unwrap(getMyPaymentMethods()),
    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// MUTATIONS
// ==========================================

export const useCreatePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => unwrap(createPaymentMethod(formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });
};

export const useUpdatePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      unwrap(updatePaymentMethod(id, formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });
};

export const useDeletePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrap(deletePaymentMethod(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });
};
