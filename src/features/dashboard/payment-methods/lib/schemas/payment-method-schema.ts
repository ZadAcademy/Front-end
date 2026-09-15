import { z } from 'zod';

/**
 * Zod schema for the payment method create/edit form.
 * `logo` validation depends on context (required on create, optional on edit).
 */
export const paymentMethodSchema = z.object({
  countryCode: z
    .string()
    .min(1, 'countryCodeRequired')
    .max(5, 'countryCodeMax'),
  title: z
    .string()
    .min(1, 'titleRequired')
    .max(150, 'titleMax'),
  accountIdentifier: z
    .string()
    .min(1, 'accountIdentifierRequired')
    .max(250, 'accountIdentifierMax'),
  instructionDescription: z
    .string()
    .min(1, 'instructionDescriptionRequired')
    .max(2000, 'instructionDescriptionMax'),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
