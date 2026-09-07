import { useState, useCallback, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCourses } from '../lib/api/courses-api';
import { LevelFilter, PriceFilter, RatingFilter } from '../lib/types/filter';
import { CoursesApiResponse, CoursesQueryParams } from '../lib/types/course-card-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

/* ─── Map UI level labels to backend enum values ─── */
const LEVEL_MAP: Record<string, string> = {
  beginner: '0',
  intermediate: '1',
  expert: '2',
};


export function useCourses(pageSize = 6, defaultStatus: string | null = null) {
  /* ─── Filter states ─── */
  const [level, setLevel] = useState<LevelFilter>('all');
  const [price, setPrice] = useState<PriceFilter>('all');
  const [rating, setRating] = useState<RatingFilter>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  /* ─── Debounce search effect ─── */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  /* ─── Pagination state ─── */
  const [currentPage, setCurrentPage] = useState(1);

  /* ─── Build query params for the API ─── */
  const queryParams: Omit<CoursesQueryParams, 'page'> = {
    pageSize,
    ...(level !== 'all' && { Level: LEVEL_MAP[level] }),
    ...(rating !== 'all' && { MinRating: rating }),
    ...(price !== 'all' && { IsFree: price === 'free' }),
    ...(debouncedSearch && { SearchTerm: debouncedSearch }),
    ...(defaultStatus && { Status: defaultStatus }),
  };

  /* ─── TanStack Query ─── */
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['coursesCard', pageSize, level, price, rating, debouncedSearch, defaultStatus],
    queryFn: ({ pageParam = 1 }) => unwrap(fetchCourses({ ...queryParams, page: pageParam as number })),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    staleTime: 30 * 1000,
  });

  const courseData = infiniteData
    ? {
        ...infiniteData.pages[0],
        items: infiniteData.pages.flatMap((page) => page.items),
      }
    : undefined;

  /* ─── Filter handlers ─── */
  const handleLevelChange = useCallback((value: LevelFilter) => {
    setLevel(value);
  }, []);

  const handlePriceChange = useCallback((value: PriceFilter) => {
    setPrice(value);
  }, []);

  const handleRatingChange = useCallback((value: RatingFilter) => {
    setRating(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleReset = useCallback(() => {
    setLevel('all');
    setPrice('all');
    setRating('all');
    setSearch('');
  }, []);

  return {
    /* Filter values */
    level,
    price,
    rating,
    search,

    /* Filter handlers */
    handleLevelChange,
    handlePriceChange,
    handleRatingChange,
    handleSearchChange,
    handleReset,


    /* Query data */
    courseData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
