import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgetPasswordFormData, forgetPasswordSchema } from '../lib/schema/forget-password.schema';
import { emailVerifySchema } from '../lib/schema/email-verify.scehma';
import { EmailVerifyFormData } from '../lib/schema/email-verify.scehma';



export const useStep1Form = (defaultEmail: string) => {
  return useForm<EmailVerifyFormData>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: { email: defaultEmail },
  });
};



export const useStep3Form = () => {
  return useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });
};
