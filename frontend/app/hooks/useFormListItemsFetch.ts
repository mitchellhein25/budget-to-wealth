'use client';

import { useCallback, useState, useTransition } from "react";
import { MessageState, MessageType } from "@/app/lib/utils";
import { FetchResult } from "@/app/lib/api";

export type useItemsFetchResult<T> = {
  isPending: boolean;
  fetchItems: () => void;
  message: MessageState;
  items: T[];
}

export type useItemsFetchArgs<T> = {
  fetchItems: () => Promise<FetchResult<T[]>>;
  itemName: string;
}

export const useFormListItemsFetch = <T>(args: useItemsFetchArgs<T>) : useItemsFetchResult<T> => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const [items, setItems] = useState<T[]>([]);

  const { fetchItems: fetchItemsFn, itemName } = args;

  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MessageType.ERROR, text });
    try {
      setMessage({ type: null, text: '' });
      
      const response = await fetchItemsFn();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${itemName}s. Please try again.`);
        return;
      }
      setItems(response.data as T[]);
    } catch {
      setErrorMessage(`An error occurred while loading ${itemName}s. Please try again.`);
    }
  }, [fetchItemsFn, itemName]);


  const fetchItemsWithTransition = useCallback(() => {
    startTransition(async () => {
      await fetchItems();
    });
  }, [fetchItems, startTransition]);

  return {
    isPending,
    fetchItems: fetchItemsWithTransition,
    message,
    items,
  }
}