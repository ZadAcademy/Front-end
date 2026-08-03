export interface SectionDto {
  id: string; // GUID
  name: string;
  order: number;
  courseId: string; // GUID
}

export interface CreateSectionRequest {
  name: string;
  courseId: string; // GUID
}

export interface UpdateSectionRequest {
  name: string;
  order: number;
}
