import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const postSchema = z.object({
  title: z.string().min(1, 'titleRequired'),
  content: z.string().min(1, 'contentRequired'),
  isPublic: z.boolean(),
  image: z.any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
