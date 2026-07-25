import CourseDetailsPage from '@/features/course-details/course-details-page';

interface PageProps {
  params: Promise<{
    courseId: string;
    locale: string;
  }>;
}

export default async function CourseRoute({ params }: PageProps) {
  const { courseId } = await params;
  return <CourseDetailsPage courseId={courseId} />;
}
