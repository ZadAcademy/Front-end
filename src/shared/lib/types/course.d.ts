export interface CourseCardProps {
  courseId: number;
  level: string;
  title: string;
  shortDescription: string;
  instructorName: string;
  numberOfLessons: number;
  numberOfStudents: number;
  rating: number;
  courseHours: number;
  price?: number;
  currencyCode?: string;
}