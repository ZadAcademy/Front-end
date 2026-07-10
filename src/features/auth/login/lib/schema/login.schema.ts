import { z } from 'zod/v4';

/**
 * Login form validation schema (Zod v4).
 * Error messages are placeholder keys — the actual translated messages
 * are applied at the hook level via useTranslations.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'emailRequired' })
    .email({ message: 'emailInvalid' }),
  password: z
    .string()
    .min(1, { message: 'passwordRequired' })
    .min(6, { message: 'passwordMin' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
