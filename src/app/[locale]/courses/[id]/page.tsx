import CourseDetailsPage from '@/features/course-details/course-details-page';

interface PageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function CourseRoute({ params }: PageProps) {
  return <CourseDetailsPage courseId={params.id} />;
}
