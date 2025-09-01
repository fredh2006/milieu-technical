import { useState, useMemo, useCallback } from 'react';

interface PaginationOptions {
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>(
  items: T[],
  options: PaginationOptions = {}
): UsePaginationReturn<T> {
  const { itemsPerPage = 5 } = options;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);

  // Reset to page 1 if current page is beyond total pages
  const safePage = useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      return 1;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, safePage, itemsPerPage]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const hasNextPage = safePage < totalPages;
  const hasPreviousPage = safePage > 1;

  const startIndex = (safePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safePage * itemsPerPage, items.length);

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    nextPage,
    previousPage,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex
  };
}