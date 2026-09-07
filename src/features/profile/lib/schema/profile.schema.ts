import { z } from 'zod/v4';

export const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'firstNameRequired' }).max(50, { message: 'firstNameMax' }),
  lastName: z.string().min(1, { message: 'lastNameRequired' }).max(50, { message: 'lastNameMax' }),
  phoneNumber: z.string().min(1, { message: 'phoneNumberRequired' }).max(20, { message: 'phoneNumberMax' }),
  specialtyId: z.string().optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
