import { useMutation } from '@tanstack/react-query';
import { verifyOtpForgetPassowrd, VerifyOtpPayload } from '../api/verify-otp-forget-password';

export const useVerifyOtpForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => verifyOtpForgetPassowrd(data),
  });
};
