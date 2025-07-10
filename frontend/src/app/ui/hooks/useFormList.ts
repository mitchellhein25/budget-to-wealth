import { useState, useCallback } from 'react';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { MessageState } from '@/app/ui/components/Utils';
import { Budget } from '@/app/lib/models/cashflow/Budget';

export const useList = <T>(
  fetchEndpoint: string,
  itemName: string
) => {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

  const clearMessage = useCallback(() => {
    setTimeout(() => setMessage({ type: null, text: '' }), 1000 * 30);
  }, [setMessage]);

  const setInfoMessage = useCallback((text: string, type: 'form' | 'list') => {
    setMessage({ type: `${type}-info`, text });
    clearMessage();
  }, [clearMessage]);

  const setErrorMessage = useCallback((text: string, type: 'form' | 'list') => {
    setMessage({ type: `${type}-error`, text });
    clearMessage();
  }, [clearMessage]);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await getRequest<T>(fetchEndpoint);
      if (!response.successful) {
        setErrorMessage(`Failed to load ${itemName}. Please try again.`, 'list');
        return;
      }
      if (itemName === "Budgets") {
        const budgets = response.data as Budget[];
        budgets.forEach(budget => budget.name = budget.category?.name ?? "");
        setItems(budgets as T[]);
      }
      else
        setItems(response.data as T[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${itemName}. Please try again.`, 'list');
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchEndpoint, itemName, setErrorMessage]);

  return {
    items,
    isLoading,
    message,
    fetchItems,
    setMessage,
    setInfoMessage,
    setErrorMessage
  };
};