'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Search, Check, X } from 'lucide-react';
import { useUsersMetadataQuery } from '@/shared/hooks/use-metadata-api';
import { UserMetadataItem } from '@/shared/lib/types/metadata-types';
import { useDebounce } from '@/shared/hooks/use-debounce';

export function UserMultiSelector({
  value,
  onChange,
  t,
}: {
  value: UserMetadataItem[];
  onChange: (items: UserMetadataItem[]) => void;
  t: (key: string, opts?: Record<string, string>) => string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<UserMetadataItem[]>([]);
  const debouncedSearch = useDebounce(search);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useUsersMetadataQuery(
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

  const toggleUser = useCallback(
    (user: UserMetadataItem) => {
      const exists = value.find((u) => u.id === user.id);
      if (exists) {
        onChange(value.filter((u) => u.id !== user.id));
      } else {
        onChange([...value, user]);
      }
    },
    [value, onChange]
  );

  const removeUser = useCallback(
    (userId: string) => {
      onChange(value.filter((u) => u.id !== userId));
    },
    [value, onChange]
  );

  return (
    <div ref={ref} className="relative">
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blueLight/20 border border-blueNormal/10
                         font-cairo-medium-sm text-greyDarker"
            >
              <div className="w-6 h-6 rounded-full bg-blueNormal/15 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-cairo-bold-xs text-blueNormal uppercase">{user.name.charAt(0)}</span>
              </div>
              <span className="truncate max-w-[160px]">{user.name}</span>
              <span className="text-greyNormal text-xs truncate max-w-[140px]">({user.email})</span>
              <button
                type="button"
                onClick={() => removeUser(user.id)}
                className="w-5 h-5 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent ms-1"
              >
                <X className="size-3.5 text-red-500" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 h-12 px-5 rounded-xl border border-black/10 bg-gray-50
                   font-cairo-medium-base text-greyNormal hover:border-blueNormal/40 hover:bg-white transition-all cursor-pointer"
      >
        <Search className="size-5 shrink-0" />
        {t('searchUsers', { defaultValue: 'Search and select users...' })}
        {value.length > 0 && (
          <span className="ms-auto bg-blueNormal text-white text-xs font-cairo-bold-sm px-2.5 py-1 rounded-full">
            {value.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 bottom-full mb-2 w-full bg-white rounded-2xl border border-black/10 shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-black/5">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 size-5 text-greyNormal" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchUsersPlaceholder', { defaultValue: 'Search by name or email...' })}
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
                {allItems.map((user) => {
                  const isSelected = value.some((u) => u.id === user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUser(user)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors
                                 cursor-pointer border-none text-start ${
                                   isSelected ? 'bg-blueLight/30' : 'bg-transparent hover:bg-blueLight/10'
                                 }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-blueNormal border-blueNormal' : 'border-black/15'
                        }`}
                      >
                        {isSelected && <Check className="size-3.5 text-white" />}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-cairo-bold-xs text-greyNormal uppercase">{user.name.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-cairo-medium-base text-greyDarker truncate">{user.name}</span>
                        <span className="font-cairo-medium-sm text-greyNormal truncate">{user.email}</span>
                      </div>
                    </button>
                  );
                })}
                {isFetching && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="size-5 animate-spin text-blueNormal" />
                  </div>
                )}
              </>
            ) : (
              <p className="text-center py-10 font-cairo-medium-base text-greyNormal">
                {t('noUsers', { defaultValue: 'No users found' })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
