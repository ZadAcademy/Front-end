// ─── Learn Route Page ───
// Route: /courses/{courseId}/learn/{lessonId}
// Passes courseId and lessonId to the WatchingCoursePage feature component.

import WatchingCoursePage from '@/features/watching-course/watching-course-page';

interface PageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
    locale: string;
  }>;
}

export default async function LearnRoute({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  return <WatchingCoursePage courseId={courseId} lessonId={lessonId} />;
}
