import { z } from 'zod';

export const sendNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  targetMode: z.enum(['all', 'course', 'users']),
  selectedCourse: z.any().nullable().optional(),
  selectedUsers: z.array(z.any()).optional(),
}).superRefine((data, ctx) => {
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
});

export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;
