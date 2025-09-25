'use client';

import { useState } from 'react';
import { FetchResult } from '@/app/lib/api';

interface UseDeleteConfirmationProps<T> {
  deleteFunction: (id: number) => Promise<FetchResult<T>>;
  onSuccess: () => void;
}

export function useDeleteConfirmation<T>({
  deleteFunction,
  onSuccess
}: UseDeleteConfirmationProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
    setIsLoading(false);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;

    setIsLoading(true);
    try {
      const result = await deleteFunction(itemToDelete);
      if (result.successful) {
        onSuccess();
        closeDeleteModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    isLoading,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  };
}
