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
  videoUrl: z.union([z.string().url('invalidUrl'), z.literal('')]).optional().nullable(),
  sendNotification: z.boolean().default(false).optional(),
  notificationMessage: z.string().optional(),
  notificationCustomType: z.string().optional(),
  targetMode: z.enum(['all', 'course', 'users']).optional(),
  selectedCourse: z.any().nullable().optional(),
  selectedUsers: z.array(z.any()).optional(),
}).superRefine((data, ctx) => {
  if (data.sendNotification) {
    if (!data.notificationMessage || data.notificationMessage.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Notification message is required",
        path: ["notificationMessage"]
      });
    }
    if (data.targetMode === 'course' && !data.selectedCourse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a course",
        path: ["selectedCourse"]
      });
    }
    if (data.targetMode === 'users' && (!data.selectedUsers || data.selectedUsers.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one user",
        path: ["selectedUsers"]
      });
    }
  }
});

export type PostFormData = z.infer<typeof postSchema>;
