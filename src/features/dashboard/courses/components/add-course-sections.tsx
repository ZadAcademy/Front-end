'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
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

import {
  useCourseSections,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from '../hooks/use-section-api';
import { SortableSectionItem } from './sortable-section-item';
import { SectionDto } from '../lib/types/section';

export function AddCourseSections() {
  const t = useTranslations('Dashboard.addCourse.sections');
  const tErrors = useTranslations('Dashboard.addCourse.errors');
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const { data: sections, isLoading: isLoadingSections } = useCourseSections(courseId || '');
  const { mutate: createSection, isPending: isCreating } = useCreateSectionMutation(courseId || '');
  const { mutate: updateSection, isPending: isUpdating } = useUpdateSectionMutation(courseId || '');
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSectionMutation(courseId || '');

  const [localSections, setLocalSections] = useState<SectionDto[]>([]);
  const [newSectionName, setNewSectionName] = useState('');

  // Sync local state with remote data when it changes (and not dragging)
  useEffect(() => {
    if (sections) {
      // Sort by order index just to be sure
      const sorted = [...sections].sort((a, b) => a.order - b.order);
      setLocalSections(sorted);
    }
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localSections.findIndex((s) => s.id === active.id);
    const newIndex = localSections.findIndex((s) => s.id === over.id);

    const newSections = arrayMove(localSections, oldIndex, newIndex);
    setLocalSections(newSections);

    // Call update API for the moved item (to update its order)
    // The backend uses 1-based or 0-based ordering? Let's use newIndex + 1
    const movedSection = newSections[newIndex];
    updateSection({
      id: movedSection.id,
      data: { name: movedSection.name, order: newIndex + 1 },
    });
  };

  const handleAddSection = () => {
    if (!newSectionName.trim() || !courseId) return;

    createSection(
      { courseId, name: newSectionName.trim() },
      {
        onSuccess: () => {
          setNewSectionName('');
        },
      }
    );
  };

  const handleUpdateSection = (id: string, newName: string) => {
    const section = localSections.find(s => s.id === id);
    if (!section) return;

    updateSection({
      id,
      data: { name: newName, order: section.order },
    });
  };

  const handleDeleteSection = (id: string) => {
    deleteSection(id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h2 className="font-cairo-bold-xl text-greyDarker mb-2">{t('title')}</h2>
        <p className="font-cairo-medium-sm text-greyNormal">{t('description')}</p>
      </div>

      <div className="space-y-6">
        {/* Sections List */}
        {isLoadingSections ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orangeNormal" />
          </div>
        ) : localSections.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {localSections.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    onUpdate={handleUpdateSection}
                    onRemove={handleDeleteSection}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="font-cairo-regular-sm text-gray-500">
              {!courseId ? tErrors('basicInfoRequiredWarning') : t('noSections')}
            </p>
          </div>
        )}

        {/* Add New Section Form */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            disabled={!courseId}
            placeholder={t('sectionNamePlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white font-cairo-regular-base text-greyDarker placeholder:text-greyLightActive outline-none focus:border-orangeNormal transition-colors duration-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSection();
            }}
          />
          <button
            type="button"
            onClick={handleAddSection}
            disabled={!courseId || !newSectionName.trim() || isCreating}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-orangeNormal text-white rounded-lg font-cairo-semibold-base hover:bg-orangeHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {t('addSection')}
          </button>
        </div>
      </div>
    </div>
  );
}
