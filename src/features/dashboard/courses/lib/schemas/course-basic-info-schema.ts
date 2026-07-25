import { z } from 'zod';

export const courseBasicInfoSchema = z.object({
  title: z.string().min(1, 'titleRequired'),
  description: z.string().min(1, 'descriptionRequired'),
  shortDescription: z.string().nullable().optional(),
  price: z.coerce.number().min(0, 'priceInvalid'),
  discountPrice: z.coerce.number().nullable().optional(),
  instructorName: z.string().nullable().optional(),
  level: z.coerce.number().min(0, 'levelRequired').max(2, 'levelRequired'),
  learningOutcomes: z.array(
    z.object({
      id: z.string().optional(), // For React array key and Dnd-kit identifier
      description: z.string().min(1, 'outcomeRequired'),
      sortOrder: z.number(),
    })
  ).default([]),
  prerequisites: z.array(
    z.object({
      id: z.string().optional(), // For React array key and Dnd-kit identifier
      description: z.string().min(1, 'prerequisiteRequired'),
      sortOrder: z.number(),
    })
  ).default([]),
});

export type CourseBasicInfoFormData = z.infer<typeof courseBasicInfoSchema>;
