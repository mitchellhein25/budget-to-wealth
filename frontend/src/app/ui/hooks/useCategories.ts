import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { Category } from '@/app/lib/models/Category';

export const useCategories = <T extends Category>(endpoint: string) => {
  const [categories, setCategories] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage('');
      
      const response = await getRequest<T>(endpoint);
      
      if (!response.successful) {
        setIsError(true);
        setErrorMessage('Failed to load categories');
        return;
      }
      
      setCategories(response.data as T[]);
    } catch (error) {
      setIsError(true);
      setErrorMessage('An error occurred while loading categories');
      console.error('Fetch categories error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    isError,
    errorMessage,
    refetch
  };
}; 