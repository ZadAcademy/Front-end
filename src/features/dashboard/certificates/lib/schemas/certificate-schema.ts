import { z } from 'zod';

export const updateCertificateSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  code: z.string().min(1, 'Code is required'),
  country: z.string().min(1, 'Country is required'),
  courseName: z.string().min(1, 'Course name is required'),
  courseNumber: z.string().min(1, 'Course number is required'),
  date: z.string().min(1, 'Date is required'),
});

export type UpdateCertificateFormValues = z.infer<typeof updateCertificateSchema>;
