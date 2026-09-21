'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('Dashboard.courseList.pagination');

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-black/10 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-4 rtl:hidden" />
        <ChevronRight className="size-4 hidden rtl:block" />
      </button>
      
      <span className="font-cairo-medium-sm text-greyDark px-4">
        {t('page')} {currentPage} {t('of')} {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-black/10 hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-4 rtl:hidden" />
        <ChevronLeft className="size-4 hidden rtl:block" />
      </button>
    </div>
  );
}
