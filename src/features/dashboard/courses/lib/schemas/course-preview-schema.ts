import { z } from 'zod';

export const coursePreviewSchema = z.object({
  videos: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'videoTitleRequired'),
      videoUrl: z.string().url('invalidVideoUrl').min(1, 'videoUrlRequired'),
      sortOrder: z.number(),
    })
  ).default([]),
});

export type CoursePreviewFormData = z.infer<typeof coursePreviewSchema>;
