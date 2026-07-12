import { useMutation } from '@tanstack/react-query';
import { resetPassword,  } from '../api/reset-password';
import { ResetPasswordPayload } from '../lib/types/reset-password';

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
  });
};
