import { IApiResponse } from "@/shared/lib/types/api";

export interface SendVerificationOtpPayload {
  email: string;
}

export const sendVerificationOtp = async (data: SendVerificationOtpPayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // NOTE: Replace this URL with the exact backend endpoint for sending the verification OTP
  const response = await fetch(`${baseUrl}api/v1/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to send verification OTP. Please try again.');
  }
  
  return response.json();
};
