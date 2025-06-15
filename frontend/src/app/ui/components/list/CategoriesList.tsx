'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { Category } from '@/app/lib/models/Category';
import { Pencil, Trash2 } from 'lucide-react';

type CategoriesListProps<T extends Category> = {
  categories: T[],
  categoryName: string,
  endpoint: string
  onCategoryDeleted: () => void,
  onCategoryIsEditing: (category: T) => void,
  isLoading: boolean,
  isError: boolean,
}

export default function CategoriesList<T extends Category>(props: CategoriesListProps<T>) {
  const categoryNameLower = props.categoryName.toLowerCase();

  async function handleDelete(id: number) {
    const result = await deleteRequest<T>(props.endpoint, id);
    if (result.successful)
      props.onCategoryDeleted();
  };

  if (props.isError) {
    return (
      <p className="alert alert-error alert-soft">Failed to load {categoryNameLower} categories.</p>
    );
  }

  if (props.isLoading) {
    return (<p className="alert alert-info alert-soft">Loading {categoryNameLower} categories...</p>);
  }

  if (props.categories.length === 0) {
    return (
      <p className="alert alert-warning alert-soft">You haven’t added any {categoryNameLower} categories yet.</p>
    );
  }

  return (
    <div className="space-y-4 flex flex-col justify-center">
      <h2 className="text-lg text-center">{props.categoryName} Categories</h2>
      <ul className="list">
        {props.categories.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
          <li key={category.id} className="list-row">
            <div className="flex-1 mr-4">
              <span>{category.name}</span>
            </div>
            <div></div>
            <div className="flex space-x-2">
              <>
                <button
                  id="edit-button"
                  onClick={() => props.onCategoryIsEditing(category)}
                  className="p-1 hover:text-primary"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  id="delete-button"
                  onClick={() => handleDelete(category.id as number)}
                  className="p-1 hover:text-error"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
