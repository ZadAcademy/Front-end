'use client';

import { useTranslations } from 'next-intl';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { useCoursePreviewForm } from '../hooks/use-course-preview-form';
import { SortableVideoItem } from './sortable-video-item';

export function AddCoursePreview() {
  const t = useTranslations('Dashboard.addCourse.coursePreview');
  const tErrors = useTranslations('Dashboard.addCourse.errors');

  const {
    form,
    videoFields,
    appendVideo,
    removeVideo,
    moveVideo,
    onSubmit,
    courseId,
    isPending,
    isDeleting,
  } = useCoursePreviewForm();

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = videoFields.findIndex((item) => item.id === active.id);
      const newIndex = videoFields.findIndex((item) => item.id === over.id);
      moveVideo(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h2 className="font-cairo-bold-xl text-greyDarker mb-2">{t('title')}</h2>
        <p className="font-cairo-medium-sm text-greyNormal">{t('description')}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <DndContext id="dnd-preview" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={videoFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {videoFields.map((fieldItem, index) => {
                  const titleError = form.formState.errors?.videos?.[index]?.title?.message;
                  const urlError = form.formState.errors?.videos?.[index]?.videoUrl?.message;

                  return (
                    <SortableVideoItem
                      key={fieldItem.id}
                      id={fieldItem.id}
                      index={index}
                      titleError={titleError}
                      urlError={urlError}
                      onRemove={() => removeVideo(index)}
                      registerTitle={form.register(`videos.${index}.title`)}
                      registerUrl={form.register(`videos.${index}.videoUrl`)}
                      titlePlaceholder={t('videoTitlePlaceholder')}
                      urlPlaceholder={t('videoUrlPlaceholder')}
                      removeText={t('remove')}
                      disabled={!courseId || isDeleting}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            type="button"
            variant="primary"
            className="mt-4 gap-2 font-cairo-semibold-sm cursor-pointer"
            onClick={() => appendVideo({ id: uuidv4(), title: '', videoUrl: '', sortOrder: videoFields.length + 1 })}
            disabled={!courseId || isPending || isDeleting}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('loading')}
              </div>
            ) : (
              <>
                <Plus className="size-4" />
                {t('addVideo')}
              </>
            )}
          </Button>
        </div>

        <div className="pt-6 flex justify-end border-t border-black/5">
          <Button
            variant="dark"
            type="submit"
            size="lg"
            className="font-cairo-bold-base px-8 h-12 cursor-pointer"
            disabled={!courseId || isPending || isDeleting}
          >
            {isPending || isDeleting ? t('loading') : t('submit')}
          </Button>
        </div>
        {!courseId && (
          <p className="text-red-500 text-sm mt-2 text-end">
            {tErrors('basicInfoRequiredWarning')}
          </p>
        )}
      </form>
    </div>
  );
}
