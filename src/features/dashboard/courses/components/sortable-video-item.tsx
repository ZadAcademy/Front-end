'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Field, FieldError } from '@/shared/ui/field';
import { useTranslations } from 'next-intl';

interface SortableVideoItemProps {
  id: string;
  index: number;
  titleError?: string;
  urlError?: string;
  onRemove: () => void;
  registerTitle: any;
  registerUrl: any;
  titlePlaceholder: string;
  urlPlaceholder: string;
  removeText: string;
}

export function SortableVideoItem({
  id,
  index,
  titleError,
  urlError,
  onRemove,
  registerTitle,
  registerUrl,
  titlePlaceholder,
  urlPlaceholder,
  removeText,
}: SortableVideoItemProps) {
  const tErrors = useTranslations('Dashboard.addCourse.errors');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const inputClasses = (hasError: boolean) => `
    w-full h-12 px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-orangeNormal'}
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-4 bg-white border rounded-xl transition-colors ${
        isDragging ? 'opacity-50 border-blueNormal shadow-md relative z-50' : 'border-greyLightActive'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-4 cursor-grab active:cursor-grabbing text-greyLight hover:text-greyDark transition-colors"
      >
        <GripVertical className="size-5" />
      </div>

      {/* Input Fields Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Input */}
        <Field data-invalid={!!titleError}>
          <input
            {...registerTitle}
            type="text"
            placeholder={titlePlaceholder}
            aria-invalid={!!titleError}
            className={inputClasses(!!titleError)}
          />
          {titleError && (
            <FieldError className="mt-1">
              {tErrors(titleError || 'generic')}
            </FieldError>
          )}
        </Field>

        {/* URL Input */}
        <Field data-invalid={!!urlError}>
          <input
            {...registerUrl}
            type="url"
            placeholder={urlPlaceholder}
            aria-invalid={!!urlError}
            className={inputClasses(!!urlError)}
          />
          {urlError && (
            <FieldError className="mt-1">
              {tErrors(urlError || 'generic')}
            </FieldError>
          )}
        </Field>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="mt-3.5 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        aria-label={removeText}
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
