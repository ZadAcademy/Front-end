'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, ChevronDown, Star, RotateCcw, GraduationCap, DollarSign, Trophy } from 'lucide-react';

/* ─── Filter option types ─── */
type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'expert';
type PriceFilter = 'all' | 'free' | 'paid';
type RatingFilter = 'all' | 2 | 3 | 4 | 5;

export interface FilterState {
  level: LevelFilter;
  price: PriceFilter;
  rating: RatingFilter;
}

interface CourseFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

/**
 * CourseFilter — Expandable filter panel for courses.
 * Shows a "Click for Custom Search" button that reveals filter fields:
 * level, price (free/paid), and rating (star-based).
 *
 * Architecture note: The filter state is lifted to the parent (HomePage).
 * When the API is ready, the parent will pass these filters to the
 * TanStack Query hook as query params — no changes needed here.
 */
export default function CourseFilter({ filters, onFiltersChange }: CourseFilterProps) {
  const t = useTranslations('HomePage.filter');
  const [isOpen, setIsOpen] = useState(false);

  /* ─── Update a single filter field ─── */
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  /* ─── Reset all filters ─── */
  const resetFilters = useCallback(() => {
    onFiltersChange({ level: 'all', price: 'all', rating: 'all' });
  }, [onFiltersChange]);

  /* ─── Check if any filter is active ─── */
  const hasActiveFilters = filters.level !== 'all' || filters.price !== 'all' || filters.rating !== 'all';

  /* ─── Count active filters for the badge ─── */
  const activeCount = [
    filters.level !== 'all',
    filters.price !== 'all',
    filters.rating !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* ═══════════ Toggle Button + Reset Row ═══════════ */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            relative flex items-center gap-2.5 px-5 py-3 rounded-xl
            font-cairo-semibold-sm transition-all duration-300 cursor-pointer
            ${isOpen
              ? 'bg-blueNormal text-white shadow-lg shadow-blueNormal/25 border border-blueNormal'
              : 'bg-white text-blueNormal border border-blueNormal/20 hover:border-blueNormal/40 hover:shadow-md shadow-sm'
            }
          `}
        >
          <Search className="size-4" />
          <span>{t('customSearch')}</span>
          {/* Active filters badge */}
          {activeCount > 0 && !isOpen && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orangeNormal text-white font-cairo-bold-xs text-[10px]">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Reset button — shown beside toggle when filters are active and panel is closed */}
        {hasActiveFilters && !isOpen && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl
                       text-red-500 font-cairo-medium-xs border border-red-200
                       hover:bg-red-50 transition-all duration-200 cursor-pointer bg-white"
          >
            <RotateCcw className="size-3.5" />
            <span>{t('reset')}</span>
          </button>
        )}
      </div>

      {/* ═══════════ Expandable Filter Panel ═══════════ */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className="bg-white rounded-2xl shadow-md border border-black/5 overflow-hidden">

            {/* ─── Filter Header ─── */}
            <div className="bg-gradient-to-l from-blueLight to-blueLightHover px-5 sm:px-6 py-3 border-b border-blueNormal/10">
              <div className="flex items-center justify-between">
                <p className="font-cairo-semibold-sm text-blueNormal">
                  {t('customSearch')}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               text-red-500 font-cairo-medium-xs
                               hover:bg-red-50 transition-colors cursor-pointer bg-white/80 border border-red-200"
                  >
                    <RotateCcw className="size-3" />
                    <span>{t('reset')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* ─── Filter Body ─── */}
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                {/* ══════ Level Filter ══════ */}
                <div className="flex flex-col gap-3">
                  {/* Section label with icon */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blueLight flex items-center justify-center">
                      <GraduationCap className="size-4 text-blueNormal" />
                    </div>
                    <span className="font-cairo-semibold-sm text-greyDark">
                      {t('level')}
                    </span>
                  </div>
                  {/* Chips */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'beginner', 'intermediate', 'expert'] as LevelFilter[]).map((level) => {
                      const isActive = filters.level === level;
                      return (
                        <button
                          key={level}
                          onClick={() => updateFilter('level', level)}
                          className={`
                            px-3.5 py-2 rounded-xl font-cairo-medium-xs
                            transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20 border border-blueNormal'
                              : 'bg-blueLight/40 text-greyDark hover:bg-blueLight border border-transparent hover:border-blueNormal/10'
                            }
                          `}
                        >
                          {level === 'all' ? t('allLevels') : t(level)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ══════ Price Filter ══════ */}
                <div className="flex flex-col gap-3">
                  {/* Section label with icon */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orangeLight flex items-center justify-center">
                      <DollarSign className="size-4 text-orangeNormal" />
                    </div>
                    <span className="font-cairo-semibold-sm text-greyDark">
                      {t('price')}
                    </span>
                  </div>
                  {/* Chips */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'free', 'paid'] as PriceFilter[]).map((price) => {
                      const isActive = filters.price === price;
                      return (
                        <button
                          key={price}
                          onClick={() => updateFilter('price', price)}
                          className={`
                            px-3.5 py-2 rounded-xl font-cairo-medium-xs
                            transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'bg-orangeNormal text-white shadow-md shadow-orangeNormal/20 border border-orangeNormal'
                              : 'bg-orangeLight/40 text-greyDark hover:bg-orangeLight border border-transparent hover:border-orangeNormal/10'
                            }
                          `}
                        >
                          {price === 'all' ? t('allPrices') : t(price)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ══════ Rating Filter ══════ */}
                <div className="flex flex-col gap-3">
                  {/* Section label with icon */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center">
                      <Trophy className="size-4 text-yellow-600" />
                    </div>
                    <span className="font-cairo-semibold-sm text-greyDark">
                      {t('rating')}
                    </span>
                  </div>
                  {/* Chips */}
                  <div className="flex flex-wrap gap-2">
                    {/* "All" chip */}
                    <button
                      onClick={() => updateFilter('rating', 'all')}
                      className={`
                        px-3.5 py-2 rounded-xl font-cairo-medium-xs
                        transition-all duration-200 cursor-pointer
                        ${filters.rating === 'all'
                          ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20 border border-yellow-500'
                          : 'bg-yellow-50 text-greyDark hover:bg-yellow-100 border border-transparent hover:border-yellow-300'
                        }
                      `}
                    >
                      {t('allRatings')}
                    </button>
                    {/* Star rating chips — 5 down to 2 */}
                    {([5, 4, 3, 2] as const).map((stars) => {
                      const isActive = filters.rating === stars;
                      return (
                        <button
                          key={stars}
                          onClick={() => updateFilter('rating', stars)}
                          className={`
                            flex items-center gap-1.5 px-3 py-2 rounded-xl font-cairo-medium-xs
                            transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20 border border-yellow-500'
                              : 'bg-yellow-50 text-greyDark hover:bg-yellow-100 border border-transparent hover:border-yellow-300'
                            }
                          `}
                        >
                          {/* Render star icons */}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: stars }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-3 ${
                                  isActive ? 'text-white fill-white' : 'text-yellow-500 fill-yellow-500'
                                }`}
                              />
                            ))}
                          </div>
                          <span>{t('stars', { count: stars })}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
