import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { coursePreviewSchema, CoursePreviewFormData } from '../lib/schemas/course-preview-schema';

export const useCoursePreviewForm = () => {
  const form = useForm<CoursePreviewFormData>({
    resolver: zodResolver(coursePreviewSchema) as any,
    defaultValues: {
      videos: [
        { id: uuidv4(), title: '', videoUrl: '', sortOrder: 1 }
      ],
    },
  });

  const { fields: videoFields, append: appendVideo, remove: removeVideo, move: moveVideo } = useFieldArray({
    control: form.control,
    name: 'videos',
  });

  const onSubmit = (data: CoursePreviewFormData) => {
    // For now, simply console.log to verify shape as requested.
    const payload = {
      videos: (data.videos || []).map((video, index) => ({
        title: video.title,
        videoUrl: video.videoUrl,
        sortOrder: index + 1,
      })),
    };
    
    console.log('Course Preview Payload:', JSON.stringify(payload, null, 2));
  };

  return {
    form,
    videoFields,
    appendVideo,
    removeVideo,
    moveVideo,
    onSubmit,
  };
};
