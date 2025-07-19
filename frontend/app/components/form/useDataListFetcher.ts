import { useState, useCallback } from 'react';
import { GetRequestResultList } from '@/app/lib/api/rest-methods/getRequest';
import { MessageState } from '@/app/components/Utils';

export type DataListFetcherState<T> = {
  items: T[],
  fetchItems: () => Promise<void>,
  isLoading: boolean,
  message: MessageState,
  setMessage: (message: MessageState) => void
}

export const useDataListFetcher = <T>(
  fetchFunction: () => Promise<GetRequestResultList<T>>,
  itemDescription: string
): DataListFetcherState<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: "ERROR", text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await fetchFunction();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${itemDescription}. Please try again.`);
        return;
      }
      setItems(response.data as T[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${itemDescription}. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, itemDescription]);

  return {
    items,
    isLoading,
    message,
    fetchItems,
    setMessage
  };
};