'use client';

// ─── Watching Course Hooks ───
// Custom hooks for the watching course module.
//
// Since the backend streams binary data directly through our proxy routes,
// we don't need React Query hooks for fetching data.
// Instead, we provide helper functions to build the proxy URLs
// and a hook to manage the active lesson state.

import { useState, useCallback, useMemo } from 'react';
import { useCourseSections } from '@/features/dashboard/courses/hooks/use-section-api';
import { LessonType } from '@/features/dashboard/courses/lib/types/lesson';
import { ActiveLesson } from '../lib/types/watching-course';
import { SectionDto } from '@/features/dashboard/courses/lib/types/section';

// ─── URL Builders ───
// These build URLs pointing to our Next.js API proxy routes
// which handle auth and stream the data from the backend.

/**
 * Build the proxy URL for streaming a lesson's video.
 * Usage: <video src={getVideoStreamUrl(lessonId)} />
 */
export function getVideoStreamUrl(lessonId: string): string {
  return `/api/lessons/${lessonId}/video-stream`;
}

/**
 * Build the proxy URL for fetching a lesson's PDF.
 * Usage: <iframe src={getPdfUrl(lessonId)} />
 */
export function getPdfUrl(lessonId: string): string {
  return `/api/lessons/${lessonId}/pdf`;
}

// ─── Active Lesson Hook ───
// Manages which lesson is currently being viewed and provides
// navigation helpers (next/previous lesson).

export function useWatchingCourse(courseId: string, initialLessonId: string) {
  // Fetch all sections with their lessons for the sidebar
  const { data: sections = [], isLoading: isSectionsLoading } = useCourseSections(courseId);
  console.log("sections", sections);

  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);

  // ─── Flatten all lessons in order for navigation ───
  const allLessons = useMemo(() => {
    const lessons: ActiveLesson[] = [];
    sections.forEach((section: SectionDto) => {
      section.lessons
        .sort((a, b) => a.order - b.order)
        .forEach((lesson) => {
          lessons.push({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            lessonType: lesson.lessonType,
            order: lesson.order,
            sectionId: section.id,
            sectionName: section.name,
            // Use the direct PDF URL from the backend data (no proxy needed)
            pdfUrl: lesson.pdf?.filePath || null,
          });
        });
    });
    return lessons;
  }, [sections]);

  // ─── Current lesson info ───
  const activeLesson = useMemo(
    () => allLessons.find((l) => l.id === activeLessonId) || null,
    [allLessons, activeLessonId]
  );

  // ─── Determine lesson type ───
  const isVideo = activeLesson?.lessonType === LessonType.GoogleDriveVideo || String(activeLesson?.lessonType) === 'GoogleDriveVideo';
  const isPdf = activeLesson?.lessonType === LessonType.Pdf || String(activeLesson?.lessonType) === 'Pdf';

  // ─── Navigation: find current index and determine prev/next ───
  const currentIndex = useMemo(
    () => allLessons.findIndex((l) => l.id === activeLessonId),
    [allLessons, activeLessonId]
  );

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setActiveLessonId(allLessons[currentIndex - 1].id);
    }
  }, [hasPrevious, allLessons, currentIndex]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
    }
  }, [hasNext, allLessons, currentIndex]);

  const goToLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
  }, []);

  return {
    // Data
    sections,
    allLessons,
    activeLesson,
    activeLessonId,
    isSectionsLoading,

    // Lesson type flags
    isVideo,
    isPdf,

    // Navigation
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
    goToLesson,
  };
}
