import { useCallback, useState, useTransition } from "react";
import { MessageState, MessageType } from "@/app/components";
import { FetchResult } from "@/app/lib/api";

export type useItemsFetchResult = {
  isPending: boolean;
  fetchItems: () => void;
  message: MessageState;
}

export type useItemsFetchArgs<T> = {
  fetchItems: () => Promise<FetchResult<T[]>>;
  itemName: string;
  setItems: (items: T[]) => void;
}

export const useFormListItemsFetch = <T>(args: useItemsFetchArgs<T>) : useItemsFetchResult => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MessageType.ERROR, text });
    try {
      setMessage({ type: null, text: '' });
      
      const response = await args.fetchItems();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${args.itemName}s. Please try again.`);
        return;
      }
      args.setItems(response.data as T[]);
    } catch {
      setErrorMessage(`An error occurred while loading ${args.itemName}s. Please try again.`);
    }
  }, [args.fetchItems, args.itemName, args.setItems]);


  const fetchItemsWithTransition = useCallback(() => {
    startTransition(async () => {
      await fetchItems();
    });
  }, [fetchItems, startTransition]);

  return {
    isPending,
    fetchItems: fetchItemsWithTransition,
    message,
  }
}