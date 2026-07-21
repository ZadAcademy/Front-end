'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination — Numbered pagination with previous/next arrows.
 * Handles RTL/LTR arrow direction via useLocale().
 * Highlights the active page with orangeNormal.
 *
 * Architecture note: When the API is ready, the parent (HomePage) will
 * drive currentPage/totalPages from the TanStack Query response.
 * This component stays a pure presentational component — no changes needed.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('HomePage.pagination');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  /* ─── Arrow icons — flipped for RTL ─── */
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  /* ─── Generate page numbers to display ─── */
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      // Show pages around the current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-8">
      {/* ─── Previous Button ─── */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-lg font-cairo-medium-sm
          transition-all duration-200 border-none
          ${currentPage === 1
            ? 'text-black/25 bg-transparent cursor-not-allowed'
            : 'text-greyDark hover:bg-black/5 cursor-pointer'
          }
        `}
        aria-label={t('previous')}
      >
        <PrevIcon className="size-4" />
        <span className="hidden sm:inline">{t('previous')}</span>
      </button>

      {/* ─── Page Numbers ─── */}
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span
            key={`dots-${index}`}
            className="w-9 h-9 flex items-center justify-center font-cairo-medium-sm text-greyNormal select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-9 h-9 rounded-lg font-cairo-semibold-sm
              transition-all duration-200 cursor-pointer border-none
              ${currentPage === page
                ? 'bg-orangeNormal text-white shadow-sm shadow-orangeNormal/25'
                : 'text-greyDark hover:bg-black/5 bg-transparent'
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* ─── Next Button ─── */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-lg font-cairo-medium-sm
          transition-all duration-200 border-none
          ${currentPage === totalPages
            ? 'text-black/25 bg-transparent cursor-not-allowed'
            : 'text-greyDark hover:bg-black/5 cursor-pointer'
          }
        `}
        aria-label={t('next')}
      >
        <span className="hidden sm:inline">{t('next')}</span>
        <NextIcon className="size-4" />
      </button>
    </div>
  );
}
