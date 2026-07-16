import { useMutation } from '@tanstack/react-query';
import { sendVerificationOtp, SendVerificationOtpPayload } from '../api/send-verification-otp';

export const useSendVerificationOtpMutation = () => {
  return useMutation({
    mutationFn: (data: SendVerificationOtpPayload) => sendVerificationOtp(data),
  });
};
