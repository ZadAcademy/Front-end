'use client';

// ─── Sortable Lesson Item ───
// A single lesson row inside a section, draggable via dnd-kit.
// Shows lesson type icon (Video/PDF), title, duration/page count,
// a quick publish/unpublish switch, and action buttons (edit, delete).
// Opens EditLessonModal for full metadata editing.

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, PlayCircle, FileText, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { LessonDto, LessonType } from '../lib/types/lesson';
import { useUpdateLessonMutation } from '../hooks/use-lesson-api';
import { EditLessonModal } from './edit-lesson-modal';

interface SortableLessonItemProps {
  lesson: LessonDto;
  courseId: string;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function SortableLessonItem({
  lesson,
  courseId,
  onRemove,
  isUpdating,
  isDeleting,
}: SortableLessonItemProps) {
  const t = useTranslations('Dashboard.addCourse.lessons');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ─── dnd-kit sortable ───
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  // ─── Format seconds to mm:ss ───
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Quick Toggle Publish ───
  const updateLessonMutation = useUpdateLessonMutation(courseId);

  const handleTogglePublish = () => {
    updateLessonMutation.mutate({
      id: lesson.id,
      data: {
        title: lesson.title, // Required by API
        description: lesson.description || undefined,
        isPublished: !lesson.isPublished,
        order: lesson.order,
      },
    });
  };

  const isLocalUpdating = isUpdating || updateLessonMutation.isPending;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-2.5 ${
          isDragging ? 'shadow-lg opacity-80' : ''
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-1 rounded transition-colors shrink-0"
        >
          <GripVertical className="w-4 h-4 text-gray-300" />
        </div>

        {/* Type Icon */}
        {lesson.lessonType === LessonType.GoogleDriveVideo || String(lesson.lessonType) === 'GoogleDriveVideo' ? (
          <div className="bg-orangeNormal/10 p-1.5 rounded-md shrink-0">
            <PlayCircle className="w-4 h-4 text-orangeNormal" />
          </div>
        ) : (
          <div className="bg-blueNormal/10 p-1.5 rounded-md shrink-0">
            <FileText className="w-4 h-4 text-blueNormal" />
          </div>
        )}

        {/* Content: title + meta info */}
        <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-cairo-medium-sm text-greyDarker truncate">
              {lesson.title}
            </span>
            <span className="text-xs text-greyNormal">
              {(lesson.lessonType === LessonType.GoogleDriveVideo || String(lesson.lessonType) === 'GoogleDriveVideo')}
              {(lesson.lessonType === LessonType.Pdf || String(lesson.lessonType) === 'Pdf')}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Publish Toggle */}
            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={isLocalUpdating || isDeleting}
              title={lesson.isPublished ? t('unpublish', { defaultValue: 'Unpublish' }) : t('publish', { defaultValue: 'Publish' })}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-cairo-bold-sm transition-colors disabled:opacity-50 ${
                lesson.isPublished
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {lesson.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {lesson.isPublished ? t('isPublished') : t('draft')}
            </button>
            
            <div className="w-px h-4 bg-gray-200 mx-1"></div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              disabled={isLocalUpdating || isDeleting}
              title={t('editLesson')}
              className="p-1 text-gray-400 hover:text-orangeNormal hover:bg-orangeNormal/10 rounded transition-colors disabled:opacity-50"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onRemove(lesson.id)}
              disabled={isLocalUpdating || isDeleting}
              title={t('confirmDelete')}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditLessonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lesson={lesson}
        courseId={courseId}
      />
    </>
  );
}
