// ─── Watching Course Types ───
// Types used by the watching course module.
// Since the backend streams binary data directly (video/PDF),
// we don't need response types for those endpoints.
// These types describe the lesson content structure for UI purposes.

import { LessonType } from "@/features/dashboard/courses/lib/types/lesson";

// Represents the currently active lesson being watched/viewed
export interface ActiveLesson {
  id: string;
  title: string;
  description: string | null;
  lessonType: LessonType;
  order: number;
  sectionId: string;
  sectionName: string;
  // Direct URL to the PDF file (from backend lesson data).
  // Used instead of proxying to avoid timeout issues.
  pdfUrl: string | null;
}
