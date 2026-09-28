'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Search, BookOpen, X } from 'lucide-react';
import { useCoursesMetadataQuery } from '@/shared/hooks/use-metadata-api';
import { MetadataItem } from '@/shared/lib/types/metadata-types';
import { useDebounce } from '@/shared/hooks/use-debounce';

export function CourseSelector({
  value,
  onChange,
  t,
}: {
  value: MetadataItem | null;
  onChange: (item: MetadataItem | null) => void;
  t: (key: string, opts?: Record<string, string>) => string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<MetadataItem[]>([]);
  const debouncedSearch = useDebounce(search);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useCoursesMetadataQuery(
    { page, pageSize: 20, search: debouncedSearch || undefined },
    true
  );

  // Reset when search changes
  useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [debouncedSearch]);

  // Accumulate items across pages
  useEffect(() => {
    if (data?.items) {
      setAllItems((prev) => {
        if (page === 1) return data.items;
        // Avoid duplicates
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = data.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || isFetching || !data?.hasNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setPage((p) => p + 1);
    }
  }, [isFetching, data?.hasNextPage]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Selected chip or trigger */}
      {value ? (
        <div className="flex items-center gap-3 h-12 px-5 rounded-xl border border-blueNormal/30 bg-blueLight/10">
          <div className="w-8 h-8 rounded-lg bg-blueNormal/10 flex items-center justify-center shrink-0">
            <BookOpen className="size-4 text-blueNormal" />
          </div>
          <span className="font-cairo-medium-base text-greyDarker truncate flex-1">{value.title}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="size-4 text-red-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 h-12 px-5 rounded-xl border border-black/10 bg-gray-50
                     font-cairo-medium-base text-greyNormal hover:border-blueNormal/40 hover:bg-white transition-all cursor-pointer"
        >
          <Search className="size-5 shrink-0" />
          {t('searchCourse', { defaultValue: 'Search and select a course...' })}
        </button>
      )}

      {/* Dropdown */}
      {open && !value && (
        <div className="absolute z-50 bottom-full mb-2 w-full bg-white rounded-2xl border border-black/10 shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-black/5">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 size-5 text-greyNormal" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchCoursePlaceholder', { defaultValue: 'Type to search courses...' })}
                className="w-full h-11 ps-12 pe-4 rounded-xl border border-black/5 bg-gray-50 font-cairo-medium-base text-greyDarker
                           outline-none focus:border-blueNormal focus:bg-white focus:ring-4 focus:ring-blueNormal/10 transition-all"
                autoFocus
              />
            </div>
          </div>
          <div ref={listRef} onScroll={handleScroll} className="max-h-60 overflow-y-auto p-1">
            {isLoading && page === 1 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-6 animate-spin text-blueNormal" />
              </div>
            ) : allItems.length > 0 ? (
              <>
                {allItems.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      onChange(course);
                      setOpen(false);
                      setSearch('');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-blueLight/20 transition-colors
                               cursor-pointer border-none bg-transparent text-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blueNormal/10 flex items-center justify-center shrink-0">
                      <BookOpen className="size-4 text-blueNormal" />
                    </div>
                    <span className="font-cairo-medium-base text-greyDarker truncate">{course.title}</span>
                  </button>
                ))}
                {isFetching && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="size-5 animate-spin text-blueNormal" />
                  </div>
                )}
              </>
            ) : (
              <p className="text-center py-10 font-cairo-medium-base text-greyNormal">
                {t('noCourses', { defaultValue: 'No courses found' })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
