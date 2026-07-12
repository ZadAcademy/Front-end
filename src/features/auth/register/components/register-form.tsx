'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterForm } from '../hooks/use-register-form';
import { useRegisterMutation } from '../hooks/use-register-mutation';
import { RegisterFormData } from '../libs/schema/register-schema';
import RegisterFields from './register-fields';
import OtpVerification from '@/features/auth/shared/components/otp-verification';
import { OtpFormData } from '@/features/auth/shared/hooks/use-otp-form';
import { useVerifyOtpMutation } from '@/features/auth/shared/hooks/use-verify-otp-mutation';

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const form = useRegisterForm();
  
  const { mutate: register, isPending } = useRegisterMutation();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtpMutation();

  const handleRegisterSubmit = (data: RegisterFormData) => {
    
    register(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep(2);
      },
      onError: (error) => {
        form.setError('root', { message: error.message });
      }
    });
  };

  const handleOtpSubmit = (data: OtpFormData) => {
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

  return (
    <div className="w-full max-w-[580px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100">
        {step === 1 && (
          <RegisterFields
            form={form}
            onSubmit={handleRegisterSubmit}
            isPending={isPending}
          />
        )}

        {step === 2 && (
          <OtpVerification
            email={email}
            onEditEmail={() => setStep(1)}
            onSubmit={handleOtpSubmit}
            translationNamespace="Auth.register"
            error={otpError}
            isPending={isVerifyingOtp}
          />
        )}
      </div>
    </div>
  );
}
