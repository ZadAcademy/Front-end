import VerifyAccountClient from '@/features/auth/verify-account/components/verify-account-client';
import { Suspense } from 'react';

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <VerifyAccountClient />
    </Suspense>
  );
}
