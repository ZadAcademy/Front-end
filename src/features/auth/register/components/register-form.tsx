'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterForm } from '../hooks/use-register-form';
import { RegisterFormData } from '../libs/schema/register-schema';
import RegisterFields from './register-fields';
import OtpVerification from '@/features/auth/shared/components/otp-verification';
import { OtpFormData } from '@/features/auth/shared/hooks/use-otp-form';

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const form = useRegisterForm();

  const handleRegisterSubmit = (data: RegisterFormData) => {
    console.log('Register Data:', data);
    setEmail(data.email);
    setStep(2);
  };

  const handleOtpSubmit = (data: OtpFormData) => {
    console.log('OTP Data:', data);
    // After OTP verification, redirect to login page
    router.push('/login');
  };

  return (
    <div className="w-full max-w-[580px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100">
        {step === 1 && (
          <RegisterFields
            form={form}
            onSubmit={handleRegisterSubmit}
          />
        )}

        {step === 2 && (
          <OtpVerification
            email={email}
            onEditEmail={() => setStep(1)}
            onSubmit={handleOtpSubmit}
            translationNamespace="Auth.register"
          />
        )}
      </div>
    </div>
  );
}
