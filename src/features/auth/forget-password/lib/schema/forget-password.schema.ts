
import { z } from 'zod';


export const forgetPasswordSchema = z.object({
  password: z.string().min(6, 'passwordMin'),
  confirmPassword: z.string().min(6, 'passwordMin'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'passwordMismatch',
  path: ['confirmPassword'],
});


export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;
