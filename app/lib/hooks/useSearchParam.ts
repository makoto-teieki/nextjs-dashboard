'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook for managing URL search parameters
 * Provides type-safe methods to read and update query parameters
 *
 * @example
 * const { getParam, setParam, deleteParam } = useSearchParam();
 *
 * // Read a parameter
 * const query = getParam('query');
 *
 * // Set a parameter (automatically resets page to 1)
 * setParam('query', 'search term');
 *
 * // Delete a parameter
 * deleteParam('query');
 */
export function useSearchParam() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Get the value of a search parameter
   */
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  /**
   * Set a search parameter value
   * Automatically resets page to 1 when updating
   */
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1'); // Reset to first page
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  /**
   * Delete a search parameter
   */
  const deleteParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  /**
   * Set multiple parameters at once
   */
  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1'); // Reset to first page

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  return {
    getParam,
    setParam,
    deleteParam,
    setParams,
    searchParams,
  };
}
