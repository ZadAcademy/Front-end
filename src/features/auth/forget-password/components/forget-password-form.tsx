'use client';

import { useState } from 'react';
import Step1Email from './step1-email';
import Step2Otp from './step2-otp';
import Step3Reset from './step3-reset';
import { Step1FormData, Step2FormData, Step3FormData } from '../hooks/use-forget-password-forms';

export default function ForgetPasswordForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleStep1Submit = (data: Step1FormData) => {
    console.log('Step 1 Data:', data);
    setEmail(data.email);
    setStep(2);
  };

  const handleStep2Submit = (data: Step2FormData) => {
    console.log('Step 2 Data:', data);
    setStep(3);
  };

  const handleStep3Submit = (data: Step3FormData) => {
    console.log('Step 3 Data:', data);
    // Reset to step 1 for testing or navigate to login
    alert('Password reset successfully!');
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100">
        {step === 1 && (
          <Step1Email 
            email={email} 
            onSubmit={handleStep1Submit} 
          />
        )}

        {step === 2 && (
          <Step2Otp 
            email={email} 
            onEditEmail={() => setStep(1)} 
            onSubmit={handleStep2Submit} 
          />
        )}

        {step === 3 && (
          <Step3Reset 
            onSubmit={handleStep3Submit} 
          />
        )}
      </div>
    </div>
  );
}
