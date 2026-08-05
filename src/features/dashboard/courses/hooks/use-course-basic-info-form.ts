import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseBasicInfoSchema, CourseBasicInfoFormData } from '../lib/schemas/course-basic-info-schema';
import { v4 as uuidv4 } from 'uuid';
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseQuery } from './use-course-api';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

export const useCourseBasicInfoForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery(courseId);

  const form = useForm<CourseBasicInfoFormData>({
    resolver: zodResolver(courseBasicInfoSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      price: 0,
      discountPrice: null,
      instructorName: '',
      canPreview: false,
      level: 0,
      startDate: null,
      initialStudentsCount: 0,
      learningOutcomes: [
        { id: uuidv4(), description: '', sortOrder: 1 }
      ],
      prerequisites: [
        { id: uuidv4(), description: '', sortOrder: 1 }
      ],
    },
  });

  useEffect(() => {
    if (courseData) {
      form.reset({
        title: courseData.title || '',
        description: courseData.description || '',
        shortDescription: courseData.shortDescription || '',
        price: courseData.resolvedPrice?.price || 0,
        discountPrice: courseData.resolvedPrice?.discountPrice ?? null,
        instructorName: courseData.instructorName || '',
        canPreview: courseData.canPreview ?? false,
        level: courseData.level === 'Advanced' ? 2 : courseData.level === 'Intermediate' ? 1 : 0,
        startDate: courseData.startDate || null,
        initialStudentsCount: courseData.initialStudentsCount || 0,
        learningOutcomes: courseData.learningOutcomes?.length > 0
          ? courseData.learningOutcomes
          : [{ id: uuidv4(), description: '', sortOrder: 1 }],
        prerequisites: courseData.prerequisites?.length > 0
          ? courseData.prerequisites
          : [{ id: uuidv4(), description: '', sortOrder: 1 }],
      });
    }
  }, [courseData, form]);

  const { fields: outcomeFields, append: appendOutcome, remove: removeOutcome, move: moveOutcome } = useFieldArray({
    control: form.control,
    name: 'learningOutcomes',
  });

  const { fields: prereqFields, append: appendPrereq, remove: removePrereq, move: movePrereq } = useFieldArray({
    control: form.control,
    name: 'prerequisites',
  });

  const { mutateAsync: createCourse, isPending: isCreating, isError: isCreateError, error: createError } = useCreateCourseMutation();
  const { mutateAsync: updateCourse, isPending: isUpdating, isError: isUpdateError, error: updateError } = useUpdateCourseMutation();

  const isPending = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;

  const onSubmit = async (data: CourseBasicInfoFormData) => {
    console.log("coursebasicdata", data);

    try {
      const payload = {
        ...data,
        learningOutcomes: data.learningOutcomes.map((outcome, index) => ({
          description: outcome.description,
          sortOrder: index + 1,
        })),
        prerequisites: data.prerequisites.map((prereq, index) => ({
          description: prereq.description,
          sortOrder: index + 1,
        })),
      };

      if (courseId) {
        const result = await updateCourse({ courseId, data: payload });
        console.log('Course updated successfully:', result);
        toast.success('تم التعديل بنجاح'); // Updated successfully
      } else {
        const result = await createCourse(payload);
        console.log('Course created successfully:', result);
        toast.success('تمت الإضافة بنجاح'); // Added successfully

        const newCourseId = typeof result === 'string' ? result : (result as any)?.data;
        if (newCourseId) {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set('courseId', newCourseId);
          router.push(`${pathname}?${newParams.toString()}`);
        }
      }
    } catch (err) {
      console.error(courseId ? 'Failed to update course:' : 'Failed to create course:', err);
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى'); // An error occurred, please try again
    }
  };

  return {
    form,
    outcomeFields,
    appendOutcome,
    removeOutcome,
    moveOutcome,
    prereqFields,
    appendPrereq,
    removePrereq,
    movePrereq,
    onSubmit,
    isPending,
    isError,
    error,
    courseId,
  };
};
