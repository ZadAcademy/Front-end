export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const verifyOtp = async (data: VerifyOtpPayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = await fetch(`${baseUrl}api/v1/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      otp: data.otp,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to verify OTP. Please try again.');
  }

  return response.json();
};
