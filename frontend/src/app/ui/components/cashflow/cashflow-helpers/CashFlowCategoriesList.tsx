'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import { Pencil, Trash2 } from 'lucide-react';

interface CashFlowCategoriesListProps {
  categories: CashFlowCategory[],
  onCategoryDeleted: () => void,
  onCategoryIsEditing: (category: CashFlowCategory) => void,
  isLoading: boolean,
  isError: boolean,
  cashFlowType: CashFlowType
}

export default function CashFlowCategoriesList(props: CashFlowCategoriesListProps) {
  const endpoint: string = "CashFlowCategories";
  const cashFlowTypeLower = props.cashFlowType.toLowerCase();

  async function handleDelete(id: number) {
    const result = await deleteRequest<CashFlowCategory>(endpoint, id);
    if (result.successful)
      props.onCategoryDeleted();
  };

  if (props.isError) {
    return (
      <p className="alert alert-error alert-soft">Failed to load {cashFlowTypeLower} categories.</p>
    );
  }

  if (props.isLoading) {
    return (<p className="alert alert-info alert-soft">Loading {cashFlowTypeLower} categories...</p>);
  }

  if (props.categories.length === 0) {
    return (
      <p className="alert alert-warning alert-soft">You haven’t added any {cashFlowTypeLower} categories yet.</p>
    );
  }

  return (
    <div className="space-y-4 flex flex-col justify-center">
      <h2 className="text-lg text-center">{props.cashFlowType} Categories</h2>
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
