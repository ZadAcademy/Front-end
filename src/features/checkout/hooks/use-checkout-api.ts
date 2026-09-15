import { useMutation } from '@tanstack/react-query';
import { submitOrder } from '../api/checkout-api';

// Simple unwrap that can handle custom status codes (like 409)
const unwrapCheckout = async (promise: Promise<any>) => {
  const result = await promise;
  if (result?.serverError) {
    // Throw an object so we can catch status codes in the hook
    throw { message: result.serverError, status: result.status };
  }
  return result;
};

export const useSubmitOrderMutation = () => {
  return useMutation({
    mutationFn: (formData: FormData) => unwrapCheckout(submitOrder(formData)),
  });
};
