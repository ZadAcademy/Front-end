import { z } from 'zod';

/**
 * Optional non-negative integer (empty input => null).
 */
const optionalInt = z
  .number({ error: 'mustBeNumber' })
  .int('mustBeInteger')
  .min(0, 'mustBePositive')
  .nullable();

/**
 * Zod schema for the discount policy edit form.
 * Error messages are translation keys under `Dashboard.ambassadors.errors`.
 */
export const discountPolicySchema = z
  .object({
    percent: z
      .number({ error: 'percentRequired' })
      .min(0, 'percentMin')
      .max(100, 'percentMax'),
    isActive: z.boolean(),
    minItems: optionalInt,
    maxItems: optionalInt,
    grantExpiryDays: z
      .number({ error: 'mustBeNumber' })
      .int('mustBeInteger')
      .min(1, 'expiryMin')
      .nullable(),
  })
  .refine(
    (data) =>
      data.minItems == null ||
      data.maxItems == null ||
      data.maxItems >= data.minItems,
    { message: 'maxLessThanMin', path: ['maxItems'] }
  );

export type DiscountPolicyFormData = z.infer<typeof discountPolicySchema>;
