'use client';

import { useDebouncedCallback } from 'use-debounce';
import { useSearchParam } from './useSearchParam';

/**
 * Custom hook for debounced search functionality
 * Combines useSearchParam with debounced callbacks for better UX
 *
 * @param paramKey - The URL parameter key to update (default: 'query')
 * @param delay - Debounce delay in milliseconds (default: 300)
 *
 * @example
 * const { handleSearch, currentValue } = useDebouncedSearch('query', 300);
 *
 * <input
 *   onChange={(e) => handleSearch(e.target.value)}
 *   defaultValue={currentValue}
 * />
 */
export function useDebouncedSearch(paramKey = 'query', delay = 300) {
  const { getParam, setParam } = useSearchParam();

  const handleSearch = useDebouncedCallback((term: string) => {
    setParam(paramKey, term);
  }, delay);

  const currentValue = getParam(paramKey);

  return {
    handleSearch,
    currentValue,
  };
}
