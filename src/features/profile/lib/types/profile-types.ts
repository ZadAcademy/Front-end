export enum ExperienceLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  Expert = 3,
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string | null;
  experience: ExperienceLevel | string;
  specialtyId: string | null;
  specialtyName: string | null;
  profileImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  specialtyId?: string | null;
}
