import { useMutation } from '@tanstack/react-query';
import { forgetPassword, ForgetPasswordPayload } from '../api/forget-password';

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgetPasswordPayload) => forgetPassword(data),
  });
};
