import { z } from 'zod';

export const courseImageSchema = z.object({
  image: typeof window === 'undefined' ? z.any() : z.any().refine((val) => val instanceof File || typeof val === 'string', {
    message: 'imageRequired',
  }),
});

export type CourseImageFormData = z.infer<typeof courseImageSchema>;
