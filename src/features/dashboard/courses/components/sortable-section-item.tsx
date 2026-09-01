'use client';

// ─── Sortable Section Item (Updated) ───
// Now includes:
//   - Nested lessons list rendered below the section header
//   - Lessons are draggable within the section via a nested DndContext
//   - "Add Lesson" button opens the LessonFormModal
//   - Edit/Delete lesson actions using the lesson API hooks
// 
// Architecture note: We use a separate DndContext for lessons inside each
// section to avoid conflicts with the parent section DndContext.
// The PointerSensor has a small distance activation constraint to
// prevent accidental drags when clicking buttons.

import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Check, X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionDto } from '../lib/types/section';
import { LessonDto } from '../lib/types/lesson';
import { SortableLessonItem } from './sortable-lesson-item';
import { LessonFormModal } from './lesson-form-modal';
import {
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from '../hooks/use-lesson-api';

interface SortableSectionItemProps {
  section: SectionDto;
  courseId: string; // Needed by lesson hooks to invalidate the correct query
  onUpdate: (id: string, newName: string) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function SortableSectionItem({
  section,
  courseId,
  onUpdate,
  onRemove,
  isUpdating,
  isDeleting,
}: SortableSectionItemProps) {
  const t = useTranslations('Dashboard.addCourse.sections');
  const tLessons = useTranslations('Dashboard.addCourse.lessons');

  // ─── Section name editing ───
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);

  // ─── Lessons expand/collapse ───
  const [isExpanded, setIsExpanded] = useState(true);

  // ─── Lesson form modal ───
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // ─── Local lessons state for optimistic drag reordering ───
  const [localLessons, setLocalLessons] = useState<LessonDto[]>(
    section.lessons || []
  );

  // Sync local lessons when remote data (section.lessons) changes
  useEffect(() => {
    if (section.lessons) {
      const sorted = [...section.lessons].sort((a, b) => a.order - b.order);
      setLocalLessons(sorted);
    }
  }, [section.lessons]);

  // ─── Lesson mutation hooks ───
  const updateLessonMutation = useUpdateLessonMutation(courseId);
  const deleteLessonMutation = useDeleteLessonMutation(courseId);

  // ─── dnd-kit for Section (parent sortable) ───
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

  // ─── dnd-kit sensors for nested lesson DndContext ───
  // Small distance constraint prevents drag from firing on button clicks
  const lessonSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ─── Section name edit handlers ───
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

  // ─── Lesson drag end: optimistic reorder + API call ───
  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localLessons.findIndex((l) => l.id === active.id);
    const newIndex = localLessons.findIndex((l) => l.id === over.id);

    const reordered = arrayMove(localLessons, oldIndex, newIndex);
    setLocalLessons(reordered);

    // Call PUT /api/v1/lessons/{id} with the new order
    const movedLesson = reordered[newIndex];
    updateLessonMutation.mutate({
      id: movedLesson.id,
      data: {
        title: movedLesson.title,
        order: newIndex + 1, // 1-based ordering
      },
    });
  };

  const handleDeleteLesson = (id: string) => {
    deleteLessonMutation.mutate(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col bg-gray-50 border border-gray-200 rounded-xl overflow-hidden ${
        isDragging ? 'shadow-lg opacity-80 border-orangeNormal/50' : ''
      }`}
    >
      {/* ─── Section Header Row ─── */}
      <div className="flex items-center gap-3 p-3">
        {/* Drag Handle (only this element is draggable for sections) */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-200 p-1 rounded transition-colors shrink-0"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Expand/Collapse toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Section name (view or edit mode) */}
        <div className="flex-1 flex gap-3 items-center">
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
              <div className="flex items-center gap-2">
                <span className="font-cairo-bold-base text-greyDarker">
                  {section.name}
                </span>
                {/* Lesson count badge */}
                <span className="text-xs font-cairo-medium-sm text-greyNormal bg-gray-200 px-2 py-0.5 rounded-full">
                  {localLessons.length} {tLessons('lessonsCount', { defaultValue: 'lessons' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Add Lesson button */}
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(true)}
                  className="px-3 py-1 text-xs font-cairo-bold-sm bg-white border border-gray-200 text-greyDarker hover:text-orangeNormal hover:border-orangeNormal rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {tLessons('addLesson', { defaultValue: 'Lesson' })}
                </button>
                <div className="w-px h-4 bg-gray-300" />
                {/* Edit section name */}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isUpdating || isDeleting}
                  className="p-1.5 text-gray-500 hover:text-orangeNormal hover:bg-orangeNormal/10 rounded transition-colors disabled:opacity-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {/* Delete section */}
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

      {/* ─── Nested Lessons List (collapsible) ─── */}
      {isExpanded && (
        <div className="px-3 pb-3">
          {localLessons.length > 0 ? (
            <DndContext
              sensors={lessonSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleLessonDragEnd}
            >
              <SortableContext
                items={localLessons.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-1.5 ml-8">
                  {localLessons.map((lesson) => (
                    <SortableLessonItem
                      key={lesson.id}
                      lesson={lesson}
                      courseId={courseId}
                      onRemove={handleDeleteLesson}
                      isUpdating={updateLessonMutation.isPending}
                      isDeleting={deleteLessonMutation.isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="ml-8 p-4 text-center bg-white border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm font-cairo-regular-sm">
              {tLessons('noLessons', {
                defaultValue: 'No lessons in this section yet.',
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Lesson Form Modal ─── */}
      <LessonFormModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        sectionId={section.id}
        courseId={courseId}
      />
    </div>
  );
}
