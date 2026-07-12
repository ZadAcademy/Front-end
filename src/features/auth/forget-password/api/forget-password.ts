import { ForgetPasswordPayload } from "../lib/types/forget-password";


export const forgetPassword = async (data: ForgetPasswordPayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = await fetch(`${baseUrl}api/v1/auth/forget-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to send reset email. Please try again.');
  }

  return response.json();
};
