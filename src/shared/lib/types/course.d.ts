export interface CourseCardProps {
  courseId: number;
  level: string;
  title: string;
  shortDescription: string;
  cardImageUrl?: string;
  instructorName: string;
  numberOfLessons: number;
  numberOfStudents: number;
  rating: number;
  courseHours: number;
  price?: number;
  discountPrice?: number | null;
  currencyCode?: string;
  isAuth?: boolean;
}