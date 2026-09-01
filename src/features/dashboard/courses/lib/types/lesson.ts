// ─── Lesson Types ───
// Based on the backend structure from the API guide.
// LessonType enum maps to: 1 = GoogleDriveVideo, 2 = Pdf

export enum LessonType {
  GoogleDriveVideo = 1,
  Pdf = 2,
}

// ─── Nested DTOs for lesson media ───

export interface LessonVideoDto {
  id: string;
  durationInSeconds: number;
}

export interface LessonPdfDto {
  id: string;
  filePath: string;
  fileName: string;
  fileSizeBytes: number;
  pageCount: number;
}

// ─── Main Lesson DTO ───
// Returned inside each SectionDto from GET /api/v1/sections/course/{courseId}

export interface LessonDto {
  id: string;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  lessonType: LessonType;
  sectionId: string;
  video: LessonVideoDto | null;
  pdf: LessonPdfDto | null;
}

// ─── Request payloads ───

// POST /api/v1/lessons/google-drive-video  (JSON body)
export interface CreateGoogleDriveVideoLessonRequest {
  sectionId: string;
  title: string;
  videoUrl: string;
}

// POST /api/v1/lessons/pdf  (multipart/form-data — converted in the API layer)
export interface CreatePdfLessonRequest {
  sectionId: string;
  title: string;
  pdfFile: File;
  isPublished?: boolean;
  pageCount?: number;
}


// PUT /api/v1/lessons/{id}
export interface UpdateLessonRequest {
  title: string;
  description?: string;
  isPublished?: boolean;
  order?: number;
}
