'use client';

// ─── Edit Lesson Modal ───
// Allows updating lesson metadata: Title and Publish status.
// Uses react-hook-form and zod for robust validation.
// Uses the PUT /api/v1/lessons/{id} endpoint via useUpdateLessonMutation.

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { LessonDto } from '../lib/types/lesson';
import { useUpdateLessonMutation } from '../hooks/use-lesson-api';
import { editLessonSchema, EditLessonFormData } from '../lib/schemas/lesson-schemas';

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonDto | null;
  courseId: string;
}

export function EditLessonModal({
  isOpen,
  onClose,
  lesson,
  courseId,
}: EditLessonModalProps) {
  const t = useTranslations('Dashboard.addCourse.lessons');
  const tErrors = useTranslations('Dashboard.addCourse.errors');

  const updateMutation = useUpdateLessonMutation(courseId);

  const form = useForm<EditLessonFormData>({
    resolver: zodResolver(editLessonSchema),
    defaultValues: {
      title: '',
      isPublished: false,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const isPublished = watch('isPublished');

  // Sync state when lesson changes or modal opens
  useEffect(() => {
    if (lesson && isOpen) {
      reset({
        title: lesson.title,
        isPublished: lesson.isPublished,
      });
    } else if (!isOpen) {
      reset();
    }
  }, [lesson, isOpen, reset]);

  if (!isOpen || !lesson) return null;

  const onSubmit = (data: EditLessonFormData) => {
    updateMutation.mutate(
      {
        id: lesson.id,
        data: {
          title: data.title.trim(),
          isPublished: data.isPublished,
          order: lesson.order, // Preserve existing order
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const inputClasses =
    'w-full px-4 rounded-lg border bg-white font-cairo-regular-base text-greyDarker placeholder:text-greyLightActive outline-none focus:border-orangeNormal transition-colors duration-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h3 className="font-cairo-bold-xl text-greyDark">{t('editLesson')}</h3>
          <button
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="edit-lesson-form"
            onSubmit={handleSubmit(onSubmit, (err) => {
              if (err.title?.message) {
                toast.error(tErrors(err.title.message as any));
              }
            })}
            className="flex flex-col gap-6"
          >
            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <label className="font-cairo-semibold-base text-greyDarker">
                    {t('lessonTitle')} *
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder={t('lessonTitlePlaceholder')}
                    className={`${inputClasses} h-11 ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.title && (
                    <span className="text-xs text-red-500 font-cairo-medium-sm">
                      {tErrors(errors.title.message as any)}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Is Published Toggle */}
            <Controller
              name="isPublished"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex flex-col">
                    <span className="font-cairo-semibold-base text-greyDarker">
                      {t('isPublished')}
                    </span>
                    <span className="text-xs text-gray-500 font-cairo-regular-sm">
                      {t('isPublishedHint')}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      ref={field.ref}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              )}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-gray-50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 rounded-lg font-cairo-bold-base text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            form="edit-lesson-form"
            disabled={updateMutation.isPending}
            className="bg-orangeNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-base hover:bg-orangeHover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {updateMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
