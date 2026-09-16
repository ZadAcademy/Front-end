import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('__Secure-next-auth.session-token')?.value ||
    cookieStore.get('next-auth.session-token')?.value;
    
  let decodedToken = null;
  if (token) {
    decodedToken = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }
  
  return {
    'Content-Type': 'application/json',
    ...(decodedToken?.token
      ? { Authorization: `Bearer ${decodedToken.token}` }
      : {}),
  };
}
