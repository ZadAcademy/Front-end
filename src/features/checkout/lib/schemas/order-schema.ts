import { z } from 'zod';

export const orderSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  receiptImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: 'Receipt image is required',
    })
    .refine((file) => file && file.size <= 10 * 1024 * 1024, {
      message: 'File size must not exceed 10MB',
    })
    .refine(
      (file) =>
        file &&
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: 'Only JPEG, PNG, and WebP are allowed',
      }
    ),
  // transferNumber: z.string().optional(), // Omitting this because backend doesn't support it
});

export type OrderFormData = z.infer<typeof orderSchema>;
