'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/cashflow/components/CashFlowCategory';
import InputFieldSetTemplate from '@/app/components/form/InputFieldSetTemplate';
import React, { useCallback, useEffect, useState } from 'react'
import { BudgetFormData } from './BudgetFormData';
import { CashFlowType } from '@/app/cashflow/components/CashFlowType';
import { Edit } from 'lucide-react';
import Link from 'next/link';

interface BudgetInputsProps {
  editingFormData: Partial<BudgetFormData>;
  onChange: React.ChangeEventHandler;
}

export default function BudgetInputs(props: BudgetInputsProps) {
  const [categories, setCategories] = useState<CashFlowCategory[]>([]);
  
  const fetchCategories = useCallback(async () => {
    const response = await getRequest<CashFlowCategory>(`CashFlowCategories?cashFlowType=${CashFlowType.Expense}`);
    if (response.successful) {
      setCategories((response.data as CashFlowCategory[]).sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <input
        id={`budget-id`}
        name={`budget-id`}
        readOnly
        type="text"
        value={props.editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate 
        label="Amount" 
        isRequired={true}
        inputChild={
          <input
            id={`budget-amount`}
            name={`budget-amount`}
            type="text"
            value={props.editingFormData?.amount ?? ""}
            onChange={props.onChange}
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
              id={`budget-categoryId`}
              name={`budget-categoryId`}
              value={props.editingFormData.categoryId || ""}
              onChange={props.onChange}
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
