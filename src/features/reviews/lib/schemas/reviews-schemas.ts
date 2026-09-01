import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z
    .string()
    .max(1000, 'Comment cannot exceed 1000 characters')
    .optional()
    .nullable(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
