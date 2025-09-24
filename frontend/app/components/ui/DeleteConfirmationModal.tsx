import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this? This action cannot be undone.",
  isLoading = false
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-base-content/70">{message}</p>

          <div className="modal-action">
            <button
              onClick={onClose}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="btn btn-error"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
