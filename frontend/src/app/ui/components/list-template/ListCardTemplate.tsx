'use client';
import React, { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { ListTemplateItem } from './ListTemplate';

export interface ListCardTemplateProps<T> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
}

export default function ListCardTemplate<T extends ListTemplateItem>(props: ListCardTemplateProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(props.item.name);

  const handleSave = () => {
    setIsEditing(false);
    if (editedName == props.item.name)
      return;
    props.onEdit({
      id: props.item.id,
      name: editedName,
    } as T);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(props.item.name);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex-1 mr-4">
        {isEditing ? (
          <input
            className="w-full p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            autoFocus
          />
        ) : (
          <span>{props.item.name}</span>
        )}
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-500"
              aria-label="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-600 hover:text-gray-400"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              id="edit-button"
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              id="delete-button"
              onClick={() => props.onDelete(props.item.id as number)}
              className="p-1 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
