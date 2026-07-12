import { RegisterFormData } from "../libs/schema/register-schema";
import { EXPERIENCE_MAPPING } from "../libs/constants/register-options";

export const registerUser = async (data: RegisterFormData) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = await fetch(`${baseUrl}api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
      experience: EXPERIENCE_MAPPING[data.experience],
      specialtyId: data.specialization,
      password:data.password,
      thirdName:'anything',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to register. Please try again.');
  }

  return response.json();
};
