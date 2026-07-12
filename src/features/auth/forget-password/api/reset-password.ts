import { ResetPasswordPayload } from "../lib/types/reset-password";


export const resetPassword = async (data: ResetPasswordPayload) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = await fetch(`${baseUrl}api/v1/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to reset password. Please try again.');
  }

  return response.json();
};
