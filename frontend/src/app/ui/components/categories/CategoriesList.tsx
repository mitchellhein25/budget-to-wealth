'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { Category } from '@/app/lib/models/Category';
import { Pencil, Trash2 } from 'lucide-react';

type CategoriesListProps<T extends Category> = {
  categories: T[],
  categoryTypeName: string,
  deleteEndpoint: string
  onCategoryDeleted: () => void,
  onCategoryIsEditing: (category: T) => void,
  isLoading: boolean,
  isError: boolean,
}

export default function CategoriesList<T extends Category>(props: CategoriesListProps<T>) {
  const categoryTypeNameLower = props.categoryTypeName.toLowerCase();

  async function handleDelete(id: number) {
    const result = await deleteRequest<T>(props.deleteEndpoint, id);
    if (result.successful)
      props.onCategoryDeleted();
  };

  if (props.isError) {
    return (
      <div className="alert alert-error alert-sm">
        <span>Failed to load {categoryTypeNameLower} categories.</span>
      </div>
    );
  }

  if (props.isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="loading loading-spinner loading-md"></div>
        <span className="ml-2">Loading {categoryTypeNameLower} categories...</span>
      </div>
    );
  }

  if (props.categories.length === 0) {
    return (
      <div className="text-center py-6 text-base-content/70">
        <p>No {categoryTypeNameLower} categories found.</p>
        <p className="text-sm mt-1">Create your first category above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-center">
        {props.categoryTypeName} Categories
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {props.categories.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
          <div key={category.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg border border-base-300">
            <span className="font-medium truncate">{category.name}</span>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => props.onCategoryIsEditing(category)}
                className="btn btn-ghost btn-xs btn-circle"
                title="Edit category"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(category.id as number)}
                className="btn btn-ghost btn-xs btn-circle text-error hover:text-error"
                title="Delete category"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
