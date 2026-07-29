import { useState, useCallback, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCourses } from '../lib/api/courses-api';
import { LevelFilter, PriceFilter, RatingFilter } from '../lib/types/filter';
import { CoursesApiResponse, CoursesQueryParams } from '../lib/types/course-card-api';

/* ─── Map UI level labels to backend enum values ─── */
const LEVEL_MAP: Record<string, string> = {
  beginner: '0',
  intermediate: '1',
  expert: '2',
};


export function useCourses(pageSize = 6) {
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
  const [totalPages, setTotalPages] = useState(1);

  /* ─── Build query params for the API ─── */
  const queryParams: CoursesQueryParams = {
    page: currentPage,
    pageSize,
    ...(level !== 'all' && { Level: LEVEL_MAP[level] }),
    ...(rating !== 'all' && { MinRating: rating }),
    ...(price !== 'all' && { IsFree: price === 'free' }),
    ...(debouncedSearch && { SearchTerm: debouncedSearch }),
  };

  /* ─── TanStack Query ─── */
  const { data: courseData, isLoading, isError } = useQuery<CoursesApiResponse>({
    
    queryKey: ['coursesCard', currentPage, level, price, rating, debouncedSearch],
    queryFn: () => fetchCourses(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  /* ─── Filter handlers (each resets page to 1) ─── */
  const handleLevelChange = useCallback((value: LevelFilter) => {
    setLevel(value);
    setCurrentPage(1);
  }, []);

  const handlePriceChange = useCallback((value: PriceFilter) => {
    setPrice(value);
    setCurrentPage(1);
  }, []);

  const handleRatingChange = useCallback((value: RatingFilter) => {
    setRating(value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setLevel('all');
    setPrice('all');
    setRating('all');
    setSearch('');
    setCurrentPage(1);
  }, []);

  /* ─── Pagination handlers ─── */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTotalPagesChange = useCallback((pages: number) => {
    setTotalPages(pages);
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

    /* Pagination */
    currentPage,
    totalPages,
    handlePageChange,
    handleTotalPagesChange,

    /* Query data */
    courseData,
    isLoading,
    isError,
  };
}
