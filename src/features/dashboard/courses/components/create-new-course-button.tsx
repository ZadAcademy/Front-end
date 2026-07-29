'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function CreateNewCourseButton() {
  const t = useTranslations('Dashboard.addCourse');
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return null;
  }

  const handleCreateNew = () => {
    // Perform a hard navigation to clear all React state in the forms
    window.location.href = window.location.pathname;
  };

  return (
    <Button
      variant="primary"
      onClick={handleCreateNew}
      className="flex items-center gap-2 font-cairo-bold-sm"
    >
      <Plus className="size-4" />
      {t('createNewCourse')}
    </Button>
  );
}
