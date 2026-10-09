'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BadgePercent } from 'lucide-react';
import { useAmbassadorProgramsQuery } from '../hooks/use-ambassador-programs';
import AmbassadorProgramsModal from './ambassador-programs-modal';

interface ViewDiscountsButtonProps {
  className?: string;
  courseId?: string;
  courseTitle?: string;
}

/** Button for the course details page that opens the discounts modal. */
export default function ViewDiscountsButton({
  className = '',
  courseId,
  courseTitle,
}: ViewDiscountsButtonProps) {
  const t = useTranslations('AmbassadorPrograms');
  const { data } = useAmbassadorProgramsQuery();
  const [open, setOpen] = useState(false);

  if (!data || data.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-cairo-bold-sm sm:font-cairo-bold-base border border-orange-200/80 shadow-sm cursor-pointer transition-all active:scale-[0.98] ${className}`}
      >
        <BadgePercent className="size-4 sm:size-5 shrink-0" />
        <span>{t('button')}</span>
      </button>
      <AmbassadorProgramsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
      />
    </>
  );
}
