import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const otpSchema = z.object({
  otp: z.string().length(6, 'otpInvalid'),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export const useOtpForm = () => {
  return useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });
};
