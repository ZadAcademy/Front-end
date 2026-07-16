import { IApiResponse } from "@/shared/lib/types/api";

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}
export interface IVerifyOtpForgetResponse {
  resetToken: string;
}

export const verifyOtpForgetPassowrd = async (data: VerifyOtpPayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = await fetch(`${baseUrl}api/v1/auth/verify-password-reset-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      otp: data.otp,
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to verify OTP. Please try again.');
  }
  const payloadd:IApiResponse<IVerifyOtpForgetResponse> = await response.json();
  if(!payloadd.isSuccess){
    throw new Error(payloadd.message || 'Failed to verify OTP. Please try again.');
  }
  console.log(payloadd.data);
  return payloadd.data;
  
};
