import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseBasicInfoSchema, CourseBasicInfoFormData } from '../lib/schemas/course-basic-info-schema';
import { v4 as uuidv4 } from 'uuid';

export const useCourseBasicInfoForm = () => {
  const form = useForm<CourseBasicInfoFormData>({
    resolver: zodResolver(courseBasicInfoSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      shortDescription: '',
      price: 0,
      discountPrice: null,
      instructorName: '',
      level: 0,
      learningOutcomes: [
        { id: uuidv4(), description: '', sortOrder: 1 }
      ],
      prerequisites: [
        { id: uuidv4(), description: '', sortOrder: 1 }
      ],
    },
  });

  const { fields: outcomeFields, append: appendOutcome, remove: removeOutcome, move: moveOutcome } = useFieldArray({
    control: form.control,
    name: 'learningOutcomes',
  });

  const { fields: prereqFields, append: appendPrereq, remove: removePrereq, move: movePrereq } = useFieldArray({
    control: form.control,
    name: 'prerequisites',
  });

  const onSubmit = (data: CourseBasicInfoFormData) => {
    // For now, simply console.log to verify shape as requested.
    // Ensure learningOutcomes are mapped without the temporary `id` and sorting is correct.
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
    
    console.log('Submitting Course Basic Info:', payload);
    // TODO: Connect to mutation api here
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
  };
};
