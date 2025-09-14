'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { getExpenseCategoriesList  } from '@/app/lib/api';
import { InputFieldSetTemplate, CurrencyInputField } from '@/app/components';
import { CashFlowCategory } from '@/app/cashflow';
import { BUDGET_ITEM_NAME_LOWERCASE, BudgetFormData } from '@/app/cashflow/budget';

interface BudgetInputsProps {
  editingFormData: Partial<BudgetFormData>;
  onChange: React.ChangeEventHandler;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetInputs({ editingFormData, onChange, setIsLoading }: BudgetInputsProps) {
  const [categories, setCategories] = useState<CashFlowCategory[]>([]);
  
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await getExpenseCategoriesList();
    if (response.successful) {
      setCategories((response.data as CashFlowCategory[]).sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <input
        id={`${BUDGET_ITEM_NAME_LOWERCASE}-id`}
        name={`${BUDGET_ITEM_NAME_LOWERCASE}-id`}
        readOnly
        type="text"
        value={editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate 
        label="Amount" 
        isRequired={true}
        inputChild={
          <CurrencyInputField
            id={`${BUDGET_ITEM_NAME_LOWERCASE}-amount`}
            name={`${BUDGET_ITEM_NAME_LOWERCASE}-amount`}
            value={editingFormData?.amount ?? ""}
            onChange={onChange}
            placeholder="0.00"
            className="input m-0 w-full"
          />}
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`${BUDGET_ITEM_NAME_LOWERCASE}-categoryId`}
              name={`${BUDGET_ITEM_NAME_LOWERCASE}-categoryId`}
              value={editingFormData.categoryId || ""}
              onChange={onChange}
              className="select flex-1"
            >
              <option value="" disabled>Pick a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Link
              href="/cashflow/expenses/expense-categories?returnUrl=/cashflow/budget"
              className="btn btn-ghost btn-sm btn-circle"
              title="Edit Expense Categories"
            >
              <Edit size={16} />
            </Link>
          </div>
        }
      />
    </>
  )
}
