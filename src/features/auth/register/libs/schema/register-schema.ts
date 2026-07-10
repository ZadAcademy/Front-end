import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'firstNameRequired'),
  lastName: z.string().min(1, 'lastNameRequired'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  phone: z.string().min(1, 'phoneRequired'),
  experience: z.string().min(1, 'experienceRequired'),
  specialization: z.string().min(1, 'specializationRequired'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
