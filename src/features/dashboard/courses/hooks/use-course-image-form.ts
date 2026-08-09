import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseImageSchema, CourseImageFormData } from '../lib/schemas/course-image-schema';
import { useSearchParams } from 'next/navigation';
import { useUploadCardImageMutation, useUploadDetailImageMutation, useGetCourseQuery } from './use-course-api';

export const useCourseImageForm = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const form = useForm<CourseImageFormData>({
    resolver: zodResolver(courseImageSchema) as any,
    defaultValues: {
      cardImage: undefined,
      detailImage: undefined,
    },
  });

  const { data: courseData } = useGetCourseQuery(courseId);
  const existingCardImageUrl = courseData?.cardImageUrl;
  const existingDetailImageUrl = courseData?.detailImageUrl;

  const { mutateAsync: uploadCardImage, isPending: isPendingCard } = useUploadCardImageMutation();
  const { mutateAsync: uploadDetailImage, isPending: isPendingDetail } = useUploadDetailImageMutation();

  const isPending = isPendingCard || isPendingDetail;

  const onSubmit = async (data: CourseImageFormData) => {
    if (!courseId) {
      console.error('No courseId found in URL parameters.');
      return;
    }

    try {
      const promises = [];

      if (data.cardImage && data.cardImage instanceof File) {
        const formData = new FormData();
        formData.append('image', data.cardImage);
        promises.push(uploadCardImage({ courseId, formData }));
      }

      if (data.detailImage && data.detailImage instanceof File) {
        const formData = new FormData();
        formData.append('image', data.detailImage);
        promises.push(uploadDetailImage({ courseId, formData }));
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        console.log('Course Images uploaded successfully');
      } else {
        console.log('No new files uploaded.');
      }
    } catch (err) {
      console.error('Failed to upload course images:', err);
    }
  };

  return {
    form,
    onSubmit,
    courseId,
    isPending,
    existingCardImageUrl,
    existingDetailImageUrl,
  };
};
