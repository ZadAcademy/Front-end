'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Step1Email from './step1-email';
import Step2Otp from './step2-otp';
import Step3Reset from './step3-reset';
import { OtpFormData } from '@/features/auth/shared/hooks/use-otp-form';
import { useForgetPasswordMutation } from '../hooks/use-forget-password-mutation';
import { useResetPasswordMutation } from '../hooks/use-reset-password-mutation';
import { ForgetPasswordFormData } from '../lib/schema/forget-password.schema';
import { EmailVerifyFormData } from '../lib/schema/email-verify.scehma';
import { useVerifyOtpForgetPasswordMutation } from '../hooks/use-verify-otp-forgetpassword-mutation';

export default function ForgetPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetTokenOtp,setResetTokenOtp]=useState('');
  
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const { mutate: sendEmail, isPending: isSendingEmail } = useForgetPasswordMutation();
  const { mutate:verifyOtpForget, isPending: isVerifyingOtp } = useVerifyOtpForgetPasswordMutation();
  const { mutate: resetPassword, isPending: isResettingPassword } = useResetPasswordMutation();

  const handleStep1Submit = (data: EmailVerifyFormData) => {
    setEmailError(null);
    sendEmail({ email: data.email }, {
      onSuccess: () => {
        setEmail(data.email);
        setStep(2);
      },
      onError: (error) => {
        setEmailError(error.message);
      }
    });
  };

  const handleStep2Submit = (data: OtpFormData) => {
    setOtpError(null);
    verifyOtpForget({ email, otp: data.otp }, {
      onSuccess: (data) => {
        setResetTokenOtp(data.resetToken);
        setStep(3);
      },
      onError: (error) => {
        setOtpError(error.message);
      }
    });
  };

  const handleStep3Submit = (data: ForgetPasswordFormData) => {
    setResetError(null);
    resetPassword({ resetToken:resetTokenOtp, newPassword: data.confirmPassword }, {
      onSuccess: () => {
        router.push('/login');
      },
      onError: (error) => {
        setResetError(error.message);
      }
    });
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100">
        {step === 1 && (
          <Step1Email 
            email={email} 
            onSubmit={handleStep1Submit}
            error={emailError}
            isPending={isSendingEmail}
          />
        )}

        {step === 2 && (
          <Step2Otp 
            email={email} 
            onEditEmail={() => setStep(1)} 
            onSubmit={handleStep2Submit} 
            error={otpError}
            isPending={isVerifyingOtp}
          />
        )}

        {step === 3 && (
          <Step3Reset 
            onSubmit={handleStep3Submit}
            error={resetError}
            isPending={isResettingPassword}
            
          />
        )}
      </div>
    </div>
  );
}
