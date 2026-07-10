import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const step1Schema = z.object({
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
});


const step3Schema = z.object({
  password: z.string().min(6, 'passwordMin'),
  confirmPassword: z.string().min(6, 'passwordMin'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'passwordMismatch',
  path: ['confirmPassword'],
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;

export const useStep1Form = (defaultEmail: string) => {
  return useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: defaultEmail },
  });
};



export const useStep3Form = () => {
  return useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: { password: '', confirmPassword: '' },
  });
};
