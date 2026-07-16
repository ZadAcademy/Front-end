'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpVerification from '@/features/auth/shared/components/otp-verification';
import { OtpFormData } from '@/features/auth/shared/hooks/use-otp-form';
import { useVerifyOtpMutation } from '@/features/auth/shared/hooks/use-verify-otp-mutation';
import { useSendVerificationOtpMutation } from '@/features/auth/shared/hooks/use-send-verification-otp-mutation';

export default function VerifyAccountClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otpError, setOtpError] = useState<string | null>(null);
  
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtpMutation();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendVerificationOtpMutation();
  
  const hasSentOtpRef = useRef(false);

  useEffect(() => {
    if (email && !hasSentOtpRef.current) {
      hasSentOtpRef.current = true;
      sendOtp({ email }, {
        onError: (error) => {
          setOtpError(error.message);
        }
      });
    }
  }, [email, sendOtp]);

  const handleOtpSubmit = (data: OtpFormData) => {
    if (!email) return;
    
    setOtpError(null);
    verifyOtp({ email, otp: data.otp }, {
      onSuccess: () => {
        router.push('/login');
      },
      onError: (error) => {
        setOtpError(error.message);
      }
    });
  };

  const handleEditEmail = () => {
    router.push('/login');
  };

  if (!email) {
    return (
      <div className="w-full max-w-[580px] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 text-center text-greyDarker">
          No email provided to verify. Please try logging in again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[580px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100">
        <OtpVerification
          email={email}
          onEditEmail={handleEditEmail}
          onSubmit={handleOtpSubmit}
          translationNamespace="Auth.register"
          error={otpError}
          isPending={isVerifyingOtp}
        />
      </div>
    </div>
  );
}
