import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseImageSchema, CourseImageFormData } from '../lib/schemas/course-image-schema';
import { useSearchParams } from 'next/navigation';
import { useUploadCourseImageMutation, useGetCourseQuery } from './use-course-api';

export const useCourseImageForm = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const form = useForm<CourseImageFormData>({
    resolver: zodResolver(courseImageSchema) as any,
    defaultValues: {
      image: undefined,
    },
  });

  const { data: courseData } = useGetCourseQuery(courseId);
  const existingImageUrl = courseData?.imageUrl;

  const { mutateAsync: uploadImage, isPending, isError, error } = useUploadCourseImageMutation();

  const onSubmit = async (data: CourseImageFormData) => {
    if (!courseId) {
      console.error('No courseId found in URL parameters.');
      return;
    }

    try {
      if (data.image && data.image instanceof File) {
        const formData = new FormData();
        formData.append('image', data.image);

        const result = await uploadImage({ courseId, formData });
        console.log('Course Image uploaded successfully:', result);
      } else {
        console.log('No new file uploaded, or existing URL provided.');
      }
    } catch (err) {
      console.error('Failed to upload course image:', err);
    }
  };

  return {
    form,
    onSubmit,
    courseId,
    isPending,
    isError,
    error,
    existingImageUrl,
  };
};
