import { LessonDto } from './lesson';

// ─── Section DTO ───
// The backend now returns lessons[] inside each section
// from GET /api/v1/sections/course/{courseId}

export interface SectionDto {
  id: string; // GUID
  name: string;
  order: number;
  courseId: string; // GUID
  lessons: LessonDto[]; // Nested lessons ordered by sequence
}

export interface CreateSectionRequest {
  name: string;
  courseId: string; // GUID
}

export interface UpdateSectionRequest {
  name: string;
  order: number;
}
