import { z } from "zod";

export const emailVerifySchema = z.object({
    email: z.string().min(1, 'emailRequired').email('emailInvalid'),
});

export type EmailVerifyFormData = z.infer<typeof emailVerifySchema>;
