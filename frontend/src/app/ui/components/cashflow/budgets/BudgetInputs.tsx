'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/lib/models/cashflow/CashFlowCategory';
import InputFieldSetTemplate from '@/app/ui/components/form/InputFieldSetTemplate';
import React, { useCallback, useEffect, useState } from 'react'
import { BudgetFormData } from './BudgetFormData';
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';

interface BudgetInputsProps {
  editingFormData: Partial<BudgetFormData>;
  onChange: React.ChangeEventHandler;
}

export default function BudgetInputs(props: BudgetInputsProps) {
  const [categories, setCategories] = useState<CashFlowCategory[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  
  const fetchCategories = useCallback(async () => {
    // setInfoMessage("");
    // setErrorMessage("");
    // setIsLoading(true);
    const response = await getRequest<CashFlowCategory>(`CashFlowCategories?cashFlowType=${CashFlowType.Expense}`);
    if (response.successful) {
      setCategories(response.data as CashFlowCategory[]);
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
          <select
            id={`budget-categoryId`}
            name={`budget-categoryId`}
            value={props.editingFormData.categoryId || ""}
            onChange={props.onChange}
            className="select"
          >
            <option value="" disabled>Pick a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        }
      />
    </>
  )
}
