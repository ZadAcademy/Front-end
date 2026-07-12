import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'firstNameRequired'),
  lastName: z.string().min(1, 'lastNameRequired'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  phoneNumber: z.string().min(1, 'phoneRequired'),
  countryCode: z.string().min(1, 'phoneRequired'),
  experience: z.string().min(1, 'experienceRequired'),
  specialization: z.string().min(1, 'specializationRequired'),
  password: z.string()
    .min(1, 'passwordRequired')
    .min(8, 'passwordMin')
    .regex(/[A-Z]/, 'passwordUppercase')
    .regex(/[0-9]/, 'passwordNumber')
    .regex(/[^a-zA-Z0-9]/, 'passwordSpecial'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
