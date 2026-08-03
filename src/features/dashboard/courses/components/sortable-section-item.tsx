'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionDto } from '../lib/types/section';

interface SortableSectionItemProps {
  section: SectionDto;
  onUpdate: (id: string, newName: string) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function SortableSectionItem({
  section,
  onUpdate,
  onRemove,
  isUpdating,
  isDeleting,
}: SortableSectionItemProps) {
  const t = useTranslations('Dashboard.addCourse.sections');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleSave = () => {
    if (editName.trim() && editName !== section.name) {
      onUpdate(section.id, editName);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(section.name);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 border border-gray-100 rounded-lg p-3 ${
        isDragging ? 'shadow-lg opacity-80' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-gray-200 p-1 rounded transition-colors"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-3 items-center w-full">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md outline-none focus:border-orangeNormal font-cairo-regular-sm text-greyDarker"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <span className="font-cairo-medium-base text-greyDarker">
              {section.name}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                className="p-1.5 text-gray-500 hover:text-orangeNormal hover:bg-orangeNormal/10 rounded transition-colors disabled:opacity-50"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(section.id)}
                disabled={isUpdating || isDeleting}
                title={t('remove')}
                className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
