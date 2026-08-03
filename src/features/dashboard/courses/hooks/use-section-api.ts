'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import {
  getSectionsByCourseId,
  createSection,
  updateSection,
  deleteSection,
} from '../api/section-api';
import { CreateSectionRequest, UpdateSectionRequest } from '../lib/types/section';

const SECTIONS_QUERY_KEY = 'course-sections';

export function useCourseSections(courseId: string) {
  return useQuery({
    queryKey: [SECTIONS_QUERY_KEY, courseId],
    queryFn: () => getSectionsByCourseId(courseId),
    enabled: !!courseId,
  });
}

export function useCreateSectionMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: (data: CreateSectionRequest) => createSection(data),
    onSuccess: () => {
      toast.success(tSuccess('sectionCreated', { defaultValue: 'Section created successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}

export function useUpdateSectionMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSectionRequest }) => updateSection({ id, data }),
    onSuccess: () => {
      toast.success(tSuccess('sectionUpdated', { defaultValue: 'Section updated successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}

export function useDeleteSectionMutation(courseId: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('Dashboard.addCourse.errors');
  const tSuccess = useTranslations('Dashboard.addCourse.toasts');

  return useMutation({
    mutationFn: (id: string) => deleteSection(id),
    onSuccess: () => {
      toast.error(tSuccess('sectionDeleted', { defaultValue: 'Section deleted successfully' }));
      queryClient.invalidateQueries({ queryKey: [SECTIONS_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t('generic', { defaultValue: 'An error occurred' }));
    },
  });
}
