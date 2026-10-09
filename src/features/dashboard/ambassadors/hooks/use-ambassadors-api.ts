import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getDiscountPolicies,
  updateDiscountPolicy,
} from '../api/ambassadors-api';
import { UpdateDiscountPolicyPayload } from '../lib/types/ambassador-types';
import { unwrap } from '@/shared/lib/utils/api-utils';
import { AMBASSADOR_PROGRAMS_QUERY_KEY } from '@/features/ambassador-programs/hooks/use-ambassador-programs';

export const DISCOUNT_POLICIES_QUERY_KEY = ['ambassadorDiscountPolicies'];

// ==========================================
// QUERIES
// ==========================================

/**
 * Fetches all ambassador discount policies (admin).
 */
export const useGetDiscountPoliciesQuery = () => {
  return useQuery({
    queryKey: DISCOUNT_POLICIES_QUERY_KEY,
    queryFn: () => unwrap(getDiscountPolicies()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ==========================================
// MUTATIONS
// ==========================================

export const useUpdateDiscountPolicyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      type,
      payload,
    }: {
      type: number;
      payload: UpdateDiscountPolicyPayload;
    }) => unwrap(updateDiscountPolicy(type, payload)),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: DISCOUNT_POLICIES_QUERY_KEY });
      // Keep the public banner / discounts modal in sync
      queryClient.invalidateQueries({ queryKey: AMBASSADOR_PROGRAMS_QUERY_KEY });
    },
  });
};
