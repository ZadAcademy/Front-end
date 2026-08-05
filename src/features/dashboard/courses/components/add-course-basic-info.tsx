'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
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
import { Plus, Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Field, FieldLabel, FieldError } from '@/shared/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import { useCourseBasicInfoForm } from '../hooks/use-course-basic-info-form';
import { SortableListItem } from './sortable-list-item';

export function AddCourseBasicInfo() {
  const t = useTranslations('Dashboard.addCourse.basicInfo');
  const tErrors = useTranslations('Dashboard.addCourse.errors');

  const {
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
    courseId,
  } = useCourseBasicInfoForm();

  const { errors } = form.formState;

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOutcomeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = outcomeFields.findIndex((item) => item.id === active.id);
      const newIndex = outcomeFields.findIndex((item) => item.id === over.id);
      moveOutcome(oldIndex, newIndex);
    }
  };

  const handlePrereqDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = prereqFields.findIndex((item) => item.id === active.id);
      const newIndex = prereqFields.findIndex((item) => item.id === over.id);
      movePrereq(oldIndex, newIndex);
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full h-12 px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-orangeNormal'}
  `;

  const textareaClasses = (hasError: boolean) => `
    w-full min-h-[100px] p-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive resize-y
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-orangeNormal'}
  `;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h2 className="font-cairo-bold-xl text-greyDarker mb-2">{t('title')}</h2>
        <p className="font-cairo-medium-sm text-greyNormal">{t('description')}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                {t('courseTitle')} <span className="text-red-500 ms-1">*</span>
              </FieldLabel>
              <input
                {...field}
                type="text"
                placeholder={t('courseTitlePlaceholder')}
                className={inputClasses(!!fieldState.error)}
              />
              {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
            </Field>
          )}
        />

        {/* Short Description */}
        <Controller
          name="shortDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                {t('shortDescription')}
              </FieldLabel>
              <textarea
                {...field}
                value={field.value || ''}
                placeholder={t('shortDescriptionPlaceholder')}
                className={textareaClasses(!!fieldState.error)}
              />
              {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                {t('courseDescription')} <span className="text-red-500 ms-1">*</span>
              </FieldLabel>
              <textarea
                {...field}
                placeholder={t('courseDescriptionPlaceholder')}
                className={textareaClasses(!!fieldState.error)}
              />
              {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('price')} <span className="text-red-500 ms-1">*</span>
                </FieldLabel>
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1"
                  placeholder={t('pricePlaceholder')}
                  className={inputClasses(!!fieldState.error)}
                />
                {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />

          {/* Discount Price */}
          <Controller
            name="discountPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('discountPrice')}
                </FieldLabel>
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1"
                  value={field.value ?? ''}
                  placeholder={t('discountPricePlaceholder')}
                  className={inputClasses(!!fieldState.error)}
                />
                {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />

          {/* Instructor Name */}
          <Controller
            name="instructorName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('instructorName')}
                </FieldLabel>
                <input
                  {...field}
                  type="text"
                  value={field.value || ''}
                  placeholder={t('instructorNamePlaceholder')}
                  className={inputClasses(!!fieldState.error)}
                />
                {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />

          {/* Level */}
          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('level')} <span className="text-red-500 ms-1">*</span>
                </FieldLabel>
                <Select
                  value={field.value.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger
                    className={`h-12 bg-white rounded-lg border focus:ring-1 focus:ring-orangeNormal outline-none text-greyDarker font-cairo-regular-base ${fieldState.error ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-orangeNormal'
                      }`}
                  >
                    <SelectValue placeholder={t('levelPlaceholder')}>
                      {field.value === 0 && t('levels.beginner')}
                      {field.value === 1 && t('levels.intermediate')}
                      {field.value === 2 && t('levels.advanced')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('levels.beginner')}</SelectItem>
                    <SelectItem value="1">{t('levels.intermediate')}</SelectItem>
                    <SelectItem value="2">{t('levels.advanced')}</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />

          {/* Start Date */}
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('startDate', { defaultValue: 'تاريخ البدء' })}
                </FieldLabel>
                <input
                  {...field}
                  type="date"
                  value={field.value ? field.value.split('T')[0] : ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={inputClasses(!!fieldState.error)}
                />
                {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />

          {/* Initial Students Count */}
          <Controller
            name="initialStudentsCount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                  {t('initialStudentsCount', { defaultValue: 'عدد الطلاب المبدئي' })}
                </FieldLabel>
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1"
                  placeholder={t('initialStudentsCountPlaceholder', { defaultValue: '0' })}
                  className={inputClasses(!!fieldState.error)}
                />
                {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />

          {/* Can Preview */}
          <Controller
            name="canPreview"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className="flex flex-row items-center justify-between p-4 border border-gray-200 rounded-lg h-12 bg-white">
                <FieldLabel className="font-cairo-semibold-base text-greyDarker mb-0 cursor-pointer" htmlFor="canPreviewToggle">
                  {t('canPreview')}
                </FieldLabel>
                <label htmlFor="canPreviewToggle" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="canPreviewToggle"
                    type="checkbox"
                    className="sr-only peer"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-solid after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orangeNormal"></div>
                </label>
                {fieldState.error && <FieldError className="absolute -bottom-6">{tErrors(fieldState.error.message || 'generic')}</FieldError>}
              </Field>
            )}
          />
        </div>

        <hr className="border-black/5 my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Outcomes (Drag and Drop) */}
          <div>
            <div className="mb-4">
              <h3 className="font-cairo-bold-lg text-greyDarker mb-1">
                {t('learningOutcomes.title')} <span className="text-red-500 ms-1">*</span>
              </h3>
              <p className="font-cairo-medium-sm text-greyNormal">
                {t('learningOutcomes.description')}
              </p>
            </div>

            <DndContext id="dnd-outcomes" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOutcomeDragEnd}>
              <SortableContext items={outcomeFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {outcomeFields.map((fieldItem, index) => {
                    const outcomeError = form.formState.errors?.learningOutcomes?.[index]?.description?.message;
                    return (
                      <SortableListItem
                        key={fieldItem.id}
                        id={fieldItem.id}
                        index={index}
                        error={outcomeError}
                        onRemove={() => removeOutcome(index)}
                        registerProps={form.register(`learningOutcomes.${index}.description`)}
                        placeholder={t('learningOutcomes.placeholder')}
                        removeText={t('learningOutcomes.remove')}
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
              onClick={() => appendOutcome({ id: uuidv4(), description: '', sortOrder: outcomeFields.length + 1 })}
            >
              <Plus className="size-4" />
              {t('learningOutcomes.addOutcome')}
            </Button>
          </div>

          {/* Prerequisites (Drag and Drop) */}
          <div>
            <div className="mb-4">
              <h3 className="font-cairo-bold-lg text-greyDarker mb-1">
                {t('prerequisites.title')} <span className="text-red-500 ms-1">*</span>
              </h3>
              <p className="font-cairo-medium-sm text-greyNormal">
                {t('prerequisites.description')}
              </p>
            </div>

            <DndContext id="dnd-prereqs" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePrereqDragEnd}>
              <SortableContext items={prereqFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {prereqFields.map((fieldItem, index) => {
                    const prereqError = form.formState.errors?.prerequisites?.[index]?.description?.message;
                    return (
                      <SortableListItem
                        key={fieldItem.id}
                        id={fieldItem.id}
                        index={index}
                        error={prereqError}
                        onRemove={() => removePrereq(index)}
                        registerProps={form.register(`prerequisites.${index}.description`)}
                        placeholder={t('prerequisites.placeholder')}
                        removeText={t('prerequisites.remove')}
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
              onClick={() => appendPrereq({ id: uuidv4(), description: '', sortOrder: prereqFields.length + 1 })}
            >
              <Plus className="size-4" />
              {t('prerequisites.addPrerequisite')}
            </Button>
          </div>
        </div>

        <div className="pt-6 flex justify-end border-t border-black/5">
          <Button variant="dark" type="submit" size="lg" disabled={isPending} className="font-cairo-bold-base px-8 h-12 cursor-pointer">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : courseId ? t('update', { defaultValue: 'Update' }) : t('submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
