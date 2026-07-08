export interface CourseCardProps {
  category: string;
  title: string;
  description: string;
  lecturer: string;
  stats: {
    users: string;
    hours: string;
    lectures: string;
  };
}