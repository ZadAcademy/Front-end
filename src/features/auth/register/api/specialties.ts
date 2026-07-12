import { IApiResponse } from "@/shared/lib/types/api";

export interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

export async function getSpecialties(): Promise<Specialty[]> {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const response = await fetch(`${baseUrl}api/v1/specialties`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  

  if (!response.ok) {
    throw new Error('Failed to fetch specialties');
  }

  const responseData = await response.json();

  console.log("specialties",responseData)
  
  return responseData.data ;
};

