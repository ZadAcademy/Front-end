import { redirect } from 'next/navigation';
import { getSectionsByCourseId } from '@/features/dashboard/courses/api/section-api';
import { SectionDto } from '@/features/dashboard/courses/lib/types/section';

interface PageProps {
  params: Promise<{
    courseId: string;
    locale: string;
  }>;
}

export default async function LearnRedirectPage({ params }: PageProps) {
  const { courseId, locale } = await params;
  
  const result = await getSectionsByCourseId(courseId);
  
  // If result is an array (success) and has items
  if (Array.isArray(result) && result.length > 0) {
    // Sort sections by order
    const sortedSections = [...result].sort((a, b) => a.order - b.order);
    
    // Find the first section that has lessons
    const firstSectionWithLessons = sortedSections.find(s => s.lessons && s.lessons.length > 0);
    
    if (firstSectionWithLessons) {
      // Sort lessons by order
      const sortedLessons = [...firstSectionWithLessons.lessons].sort((a, b) => a.order - b.order);
      const firstLessonId = sortedLessons[0].id;
      
      // Redirect to the first lesson
      redirect(`/${locale}/courses/${courseId}/learn/${firstLessonId}`);
    }
  }
  
  // If there are no lessons or an error occurred, redirect back to course details
  redirect(`/${locale}/courses/${courseId}`);
}
