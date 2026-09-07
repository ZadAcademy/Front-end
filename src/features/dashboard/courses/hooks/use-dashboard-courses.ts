import { useState, useCallback, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCourses } from '@/features/home/lib/api/courses-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

export function useDashboardCourses(pageSize = 10) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: courseData, isLoading, isError } = useQuery({
    queryKey: ['dashboardCourses', currentPage, pageSize, debouncedSearch],
    queryFn: () => unwrap(fetchCourses({ page: currentPage, pageSize, SearchTerm: debouncedSearch })),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    courseData,
    isLoading,
    isError,
    currentPage,
    totalPages: courseData?.totalPages || 1,
    handlePageChange,
    search,
    handleSearchChange
  };
}
