import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/shared/lib/utils/api-utils';
import {
  submitDiscountRequest,
  SubmitDiscountRequestPayload,
} from '../api/discount-request-api';

export const useSubmitDiscountRequestMutation = () => {
  return useMutation({
    mutationFn: (payload: SubmitDiscountRequestPayload) =>
      unwrap(submitDiscountRequest(payload)),
  });
};
