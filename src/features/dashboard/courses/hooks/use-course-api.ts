import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createCourse } from '../api/create-course-api';
import { updateCourse } from '../api/update-course-api';
import { updateLocalizedPrices, deleteLocalizedPrice, CreateLocalizedPricesPayload } from '../api/localized-prices-api';
import { updatePreviewVideos, deletePreviewVideo, CreatePreviewVideosPayload } from '../api/preview-videos-api';
import { uploadCardImage, uploadDetailImage } from '../api/upload-course-image-api';
import { getCourseById } from '../api/get-course-by-id-api';
import { updateCourseStatus } from '../api/update-course-status-api';
import { updateCoursePreview } from '../api/update-course-preview-api';
import { deleteCourse } from '../api/delete-course-api';
import { CreateCoursePayload } from '../lib/types/course-basics';
import { unwrap } from '@/shared/lib/utils/api-utils';

// ==========================================
// COURSE QUERIES
// ==========================================

export const useGetCourseQuery = (courseId: string | null) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => unwrap(getCourseById(courseId!)),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ==========================================
// COURSE MUTATIONS (CREATE/UPDATE/IMAGE)
// ==========================================

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoursePayload) => unwrap(createCourse(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CreateCoursePayload }) =>
      unwrap(updateCourse(courseId, data)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

export const useUploadCardImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, formData }: { courseId: string; formData: FormData }) => unwrap(uploadCardImage(courseId, formData)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    }
  });
};

export const useUploadDetailImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, formData }: { courseId: string; formData: FormData }) => unwrap(uploadDetailImage(courseId, formData)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    }
  });
};

export const useUpdateCourseStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, newStatus }: { courseId: string; newStatus: number }) =>
      unwrap(updateCourseStatus(courseId, newStatus)),
    onSuccess: (_, { courseId }) => {
      console.log('updateCourseStatus mutation success', courseId);
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

export const useUpdateCoursePreviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, canPreview }: { courseId: string; canPreview: boolean }) =>
      unwrap(updateCoursePreview(courseId, canPreview)),
    onSuccess: (_, { courseId }) => {
      console.log('updateCoursePreview mutation success', courseId);
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId }: { courseId: string }) => unwrap(deleteCourse(courseId)),
    onSuccess: () => {
      // Invalidate the course list query after successful deletion
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

// ==========================================
// LOCALIZED PRICES MUTATIONS
// ==========================================

export const useUpdateLocalizedPricesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CreateLocalizedPricesPayload }) =>
      unwrap(updateLocalizedPrices(courseId, data)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

export const useDeleteLocalizedPriceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, priceId }: { courseId: string; priceId: string }) =>
      unwrap(deleteLocalizedPrice(courseId, priceId)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

// ==========================================
// PREVIEW VIDEOS MUTATIONS
// ==========================================

export const useUpdatePreviewVideosMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CreatePreviewVideosPayload }) =>
      unwrap(updatePreviewVideos(courseId, data)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};

export const useDeletePreviewVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, videoId }: { courseId: string; videoId: string }) =>
      unwrap(deletePreviewVideo(courseId, videoId)),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['coursesCard'] });
    },
  });
};
