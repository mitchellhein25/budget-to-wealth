'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { ListTable } from '../../table/ListTable';
import { Category } from '../Category';
import { MobileCategoryCard } from './MobileCategoryCard';
import { DesktopCategoryRow } from './DesktopCategoryRow';

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
      			<th className="w-20 text-right">Actions</th>
    </tr>
  );

  const desktopRow = (category: T) => (
    <DesktopCategoryRow
      key={category.id}
      category={category}
      onEdit={props.onCategoryIsEditing}
      onDelete={handleDelete}
    />
  );

  const mobileRow = (category: T) => (
    <MobileCategoryCard
      key={category.id}
      category={category}
      onEdit={props.onCategoryIsEditing}
      onDelete={handleDelete}
    />
  );

  return (
    <ListTable
      title={`${props.categoryTypeName} Categories`}
      items={props.categories}
      headerRow={tableHeaderRow}
      bodyRow={desktopRow}
      mobileRow={mobileRow}
      isLoading={props.isLoading}
      isError={props.isError}
    />
  );
}
