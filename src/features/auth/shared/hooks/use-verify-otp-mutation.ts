import { useMutation } from '@tanstack/react-query';
import { verifyOtp, VerifyOtpPayload } from '../api/verify-otp';

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => verifyOtp(data),
  });
};
