import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { coursePreviewSchema, CoursePreviewFormData } from '../lib/schemas/course-preview-schema';
import { useSearchParams } from 'next/navigation';
import { useUpdatePreviewVideosMutation, useGetCourseQuery, useDeletePreviewVideoMutation } from './use-course-api';

export const useCoursePreviewForm = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const tToasts = useTranslations('Dashboard.addCourse.toasts');
  const { mutate: updatePreviewVideos, isPending } = useUpdatePreviewVideosMutation();
  const { mutate: deletePreviewVideo, isPending: isDeleting } = useDeletePreviewVideoMutation();

  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery(courseId);

  const form = useForm<CoursePreviewFormData>({
    resolver: zodResolver(coursePreviewSchema) as any,
    defaultValues: {
      videos: [
        { id: uuidv4(), title: '', videoUrl: '', sortOrder: 1 }
      ],
    },
  });

  useEffect(() => {
    if (courseData) {
      form.reset({
        videos: courseData.previewVideos && courseData.previewVideos.length > 0
          ? courseData.previewVideos.map(v => ({
            id: v.id,
            title: v.title,
            videoUrl: v.videoUrl,
            sortOrder: v.sortOrder,
          }))
          : [{ id: uuidv4(), title: '', videoUrl: '', sortOrder: 1 }]
      });
    }
  }, [courseData, form]);

  const { fields: videoFields, append: appendVideo, remove: removeVideo, move: moveVideo } = useFieldArray({
    control: form.control,
    name: 'videos',
  });

  const handleRemoveVideo = (index: number) => {
    const videoToRemove = form.getValues(`videos.${index}`);
    
    // Check if it's an existing video from the backend
    const isFromBackend = courseData?.previewVideos?.some(v => v.id === videoToRemove.id);

    if (isFromBackend && courseId) {
      deletePreviewVideo({ courseId, videoId: videoToRemove.id }, {
        onSuccess: () => {
          removeVideo(index);
          toast.success(tToasts('previewVideoDeleted'));
        },
        onError: (error) => {
          toast.error(error.message || tToasts('previewVideoDeleteFailed'));
        }
      });
    } else {
      removeVideo(index);
    }
  };

  const onSubmit = (data: CoursePreviewFormData) => {
    if (!courseId) {
      toast.error(tToasts('missingCourseId'));
      return;
    }

    const payload = {
      videos: (data.videos || []).map((video, index) => ({
        id: video.id,
        title: video.title,
        videoUrl: video.videoUrl,
        sortOrder: index + 1,
      })),
    };

    updatePreviewVideos({
      courseId,
      data: payload,
    }, {
      onSuccess: () => {
        toast.success(tToasts('previewVideosUpdated'));
      },
      onError: (error) => {
        toast.error(error.message || tToasts('previewVideosUpdateFailed'));
      }
    });
  };

  return {
    form,
    videoFields,
    appendVideo,
    removeVideo: handleRemoveVideo,
    moveVideo,
    onSubmit,
    courseId,
    isPending,
    isDeleting,
  };
};
