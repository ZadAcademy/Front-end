'use client';

// ─── Lesson React Query Hooks ───
// Follows the same pattern as use-section-api.ts:
//   - 'use client' directive
//   - useMutation wrapping server-action API functions
//   - toast() for success/error notifications
//   - useTranslations() for i18n
//   - Invalidates 'course-sections' query on success (since lessons are nested inside sections)

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import {
  createGoogleDriveVideoLesson,
  createPdfLesson,
  updateLesson,
  deleteLesson,
} from '../api/lesson-api';

import {
  CreateGoogleDriveVideoLessonRequest,
  UpdateLessonRequest,
} from '../lib/types/lesson';
import { unwrap } from '@/shared/lib/utils/api-utils';

// Same query key used in use-section-api.ts — lessons come inside sections
const SECTIONS_QUERY_KEY = 'course-sections';

// ─── Create Video Lesson ───
// Calls POST /api/v1/lessons/google-drive-video via server action

export function useCreateVideoLessonMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: (data: CreateGoogleDriveVideoLessonRequest) =>
      unwrap(createGoogleDriveVideoLesson(data)),
    onSuccess: () => {
      toast.success(tSuccess('lessonCreated', { defaultValue: 'Lesson created successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}

// ─── Create PDF Lesson ───
// Calls POST /api/v1/lessons/pdf via server action
// Receives a FormData object (built in the component before calling mutate)

export function useCreatePdfLessonMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: (formData: FormData) => unwrap(createPdfLesson(formData)),
    onSuccess: () => {
      toast.success(tSuccess('lessonCreated', { defaultValue: 'Lesson created successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}

// ─── Update Full Lesson (title, description, isPublished, order) ───
// Calls PUT /api/v1/lessons/{id}

export function useUpdateLessonMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonRequest }) =>
      unwrap(updateLesson({ id, data })),
    onSuccess: () => {
      toast.success(tSuccess('lessonUpdated', { defaultValue: 'Lesson updated successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}


// ─── Delete Lesson (soft delete) ───
// Calls DELETE /api/v1/lessons/{id}
// Backend auto-reindexes sibling lessons

export function useDeleteLessonMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: (id: string) => unwrap(deleteLesson(id)),
    onSuccess: () => {
      toast.success(tSuccess('lessonDeleted', { defaultValue: 'Lesson deleted successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}
