'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Field, FieldError } from '@/shared/ui/field';
import { useTranslations } from 'next-intl';

interface SortableListItemProps {
  id: string;
  index: number;
  error?: string;
  onRemove: () => void;
  // Passing the register props for react-hook-form down
  registerProps: any;
  placeholder: string;
  removeText: string;
}

export function SortableListItem({
  id,
  index,
  error,
  onRemove,
  registerProps,
  placeholder,
  removeText,
}: SortableListItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 bg-white border rounded-xl transition-colors ${
        isDragging ? 'opacity-50 border-blueNormal shadow-md relative z-50' : 'border-greyLightActive'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-3 cursor-grab active:cursor-grabbing text-greyLight hover:text-greyDark transition-colors"
      >
        <GripVertical className="size-5" />
      </div>

      {/* Input Field */}
      <Field className="flex-1" data-invalid={!!error}>
        <input
          {...registerProps}
          type="text"
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`
            w-full h-12 px-4 rounded-lg border bg-white
            font-cairo-regular-base text-greyDarker
            placeholder:text-greyLightActive
            outline-none transition-colors duration-200
            ${error
              ? 'border-red-400 focus:border-red-500'
              : 'border-greyLightActive focus:border-orangeNormal'
            }
          `}
        />
        {error && (
          <FieldError className="mt-1">
            {tErrors(error || 'generic')}
          </FieldError>
        )}
      </Field>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="mt-2.5 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        aria-label={removeText}
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
