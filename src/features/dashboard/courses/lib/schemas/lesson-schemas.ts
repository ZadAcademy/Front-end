import { z } from 'zod';
import { LessonType } from '../types/lesson';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

// Base schema for common fields
const baseLessonSchema = z.object({
  title: z.string().min(1, 'lessonTitleRequired'),
  lessonType: z.nativeEnum(LessonType),
});

// Video lesson schema
export const videoLessonSchema = baseLessonSchema.extend({
  lessonType: z.literal(LessonType.GoogleDriveVideo),
  videoUrl: z.string().min(1, 'lessonVideoUrlRequired').url('invalidVideoUrl'),
});

// PDF lesson schema
export const pdfLessonSchema = baseLessonSchema.extend({
  lessonType: z.literal(LessonType.Pdf),
  pdfFile: z
    .custom<File>((val) => val instanceof File, 'pdfRequired')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'pdfTooLarge')
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), 'invalidPdfType'),
});

// Discriminated union for the form
export const lessonSchema = z.discriminatedUnion('lessonType', [
  videoLessonSchema,
  pdfLessonSchema,
]);

export type LessonFormData = z.infer<typeof lessonSchema>;

// Schema for editing an existing lesson (title and isPublished only)
export const editLessonSchema = z.object({
  title: z.string().min(1, 'lessonTitleRequired'),
  isPublished: z.boolean(),
});

export type EditLessonFormData = z.infer<typeof editLessonSchema>;
