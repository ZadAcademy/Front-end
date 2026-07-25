'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, ChevronDown, Star, RotateCcw, GraduationCap, DollarSign, Trophy } from 'lucide-react';
import { LevelFilter, PriceFilter, RatingFilter } from '../lib/types/filter';



interface CourseFilterProps {
  level: LevelFilter;
  price: PriceFilter;
  rating: RatingFilter;
  search: string;
  onLevelChange: (value: LevelFilter) => void;
  onPriceChange: (value: PriceFilter) => void;
  onRatingChange: (value: RatingFilter) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

/**
 * CourseFilter — Expandable filter panel for courses.
 * Shows a "Click for Custom Search" button that reveals filter fields:
 * level, price (free/paid), and rating (star-based).
 *
 * Each filter is an independent prop pair (value + setter),
 * making it easy to add new filters without touching existing code.
 */
export default function CourseFilter({
  level,
  price,
  rating,
  search,
  onLevelChange,
  onPriceChange,
  onRatingChange,
  onSearchChange,
  onReset,
}: CourseFilterProps) {
  const t = useTranslations('HomePage.filter');
  const [isOpen, setIsOpen] = useState(false);

  /* ─── Check if any filter is active ─── */
  const hasActiveFilters = level !== 'all' || price !== 'all' || rating !== 'all' || search.trim() !== '';

  /* ─── Count active filters for the badge ─── */
  const activeCount = [
    level !== 'all',
    price !== 'all',
    rating !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* ═══════════ Search & Toggle Button Row ═══════════ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* ─── Search Input ─── */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="size-5 text-blueNormal/50" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchCourses') || "Search by title..."}
            className="w-full pl-11 pr-4 py-3 bg-white border border-blueNormal/20 rounded-xl font-cairo-medium-sm text-greyDark focus:outline-none focus:border-blueNormal focus:ring-2 focus:ring-blueNormal/20 transition-all shadow-sm hover:border-blueNormal/40"
          />
        </div>

        {/* ─── Toggle Button ─── */}
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
            onClick={onReset}
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
                    onClick={onReset}
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
                    {(['all', 'beginner', 'intermediate', 'expert'] as LevelFilter[]).map((lvl) => {
                      const isActive = level === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => onLevelChange(lvl)}
                          className={`
                            px-3.5 py-2 rounded-xl font-cairo-medium-xs
                            transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20 border border-blueNormal'
                              : 'bg-blueLight/40 text-greyDark hover:bg-blueLight border border-transparent hover:border-blueNormal/10'
                            }
                          `}
                        >
                          {lvl === 'all' ? t('allLevels') : t(lvl)}
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
                    {(['all', 'free', 'paid'] as PriceFilter[]).map((p) => {
                      const isActive = price === p;
                      return (
                        <button
                          key={p}
                          onClick={() => onPriceChange(p)}
                          className={`
                            px-3.5 py-2 rounded-xl font-cairo-medium-xs
                            transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'bg-orangeNormal text-white shadow-md shadow-orangeNormal/20 border border-orangeNormal'
                              : 'bg-orangeLight/40 text-greyDark hover:bg-orangeLight border border-transparent hover:border-orangeNormal/10'
                            }
                          `}
                        >
                          {p === 'all' ? t('allPrices') : t(p)}
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
                      onClick={() => onRatingChange('all')}
                      className={`
                        px-3.5 py-2 rounded-xl font-cairo-medium-xs
                        transition-all duration-200 cursor-pointer
                        ${rating === 'all'
                          ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20 border border-yellow-500'
                          : 'bg-yellow-50 text-greyDark hover:bg-yellow-100 border border-transparent hover:border-yellow-300'
                        }
                      `}
                    >
                      {t('allRatings')}
                    </button>
                    {/* Star rating chips — 5 down to 2 */}
                    {([5, 4, 3, 2] as const).map((stars) => {
                      const isActive = rating === stars;
                      return (
                        <button
                          key={stars}
                          onClick={() => onRatingChange(stars)}
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
                          <span>{stars}</span>
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
