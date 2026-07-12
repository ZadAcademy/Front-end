import { useMutation } from '@tanstack/react-query';
import { resetPassword, ResetPasswordPayload } from '../api/reset-password';

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
  });
};
