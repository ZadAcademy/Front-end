export interface CreateCoursePayload {
  title: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  discountPrice?: number | null;
  instructorName?: string | null;
  canPreview?: boolean;
  level: number;
  learningOutcomes: { description: string; sortOrder: number }[];
  prerequisites: { description: string; sortOrder: number }[];
}