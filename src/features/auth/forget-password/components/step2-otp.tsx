'use client';

import OtpVerification from '@/features/auth/shared/components/otp-verification';
import { OtpFormData } from '@/features/auth/shared/hooks/use-otp-form';

interface Step2OtpProps {
  email: string;
  onEditEmail: () => void;
  onSubmit: (data: OtpFormData) => void;
  error?: string | null;
  isPending?: boolean;
}

/**
 * Step2Otp — Thin wrapper around the shared OtpVerification component.
 * Passes the forgetPassword translation namespace.
 */
export default function Step2Otp({ email, onEditEmail, onSubmit, error, isPending }: Step2OtpProps) {
  return (
    <OtpVerification
      email={email}
      onEditEmail={onEditEmail}
      onSubmit={onSubmit}
      translationNamespace="Auth.forgetPassword"
      error={error}
      isPending={isPending}
    />
  );
}
