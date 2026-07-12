import { useMutation } from '@tanstack/react-query';
import { forgetPassword } from '../api/forget-password';
import { ForgetPasswordPayload } from '../lib/types/forget-password';

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgetPasswordPayload) => forgetPassword(data),
  });
};
