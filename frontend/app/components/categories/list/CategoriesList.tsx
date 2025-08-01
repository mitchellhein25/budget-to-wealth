'use client'

import { Pencil, Trash2 } from 'lucide-react';
import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { ListTable } from '../../table/ListTable';
import { Category } from '../Category';

type CategoriesListProps<T extends Category> = {
  categories: T[],
  categoryTypeName: string,
  deleteEndpoint: string
  onCategoryDeleted: () => void,
  onCategoryIsEditing: (category: T) => void,
  isLoading: boolean,
  isError: boolean,
}

export function CategoriesList<T extends Category>(props: CategoriesListProps<T>) {
  async function handleDelete(id: number) {
    const result = await deleteRequest<T>(props.deleteEndpoint, id);
    if (result.successful)
      props.onCategoryDeleted();
  };

  const tableHeaderRow = (
    <tr>
      <th className="w-3/4">Name</th>
      <th className="w-1/4"></th>
    </tr>
  );

  const tableBodyRow = (category: T) => (
    <tr key={category.id}>
      <td className="flex-1">
        {category.name}
      </td>
      <td className="flex space-x-2">
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
      </td>
    </tr>
  );

  return (
    <ListTable
      title={`${props.categoryTypeName} Categories`}
      items={props.categories}
      headerRow={tableHeaderRow}
      bodyRow={tableBodyRow}
      isLoading={props.isLoading}
      isError={props.isError}
    />
  );
}
