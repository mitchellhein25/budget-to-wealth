'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import InputFieldSetTemplate from '@/app/ui/components/InputFieldSetTemplate';
import React, { useEffect, useState } from 'react'
import { CashFlowEntryFormData } from '../../../cashflow-helpers/CashFlowEntryFormData';

interface IncomeEntriesInputsProps {
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: React.ChangeEventHandler;
}

export default function IncomeEntriesInputs(props: IncomeEntriesInputsProps) {
  const [incomeCategories, setIncomeCategories] = useState<CashFlowCategory[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  async function fetchIncomeCategories() {
    // setInfoMessage("");
    // setErrorMessage("");
    // setIsLoading(true);
    const response = await getRequest<CashFlowCategory>("CashFlowCategories?cashFlowType=Income");
    if (response.successful) {
      setIncomeCategories(response.data as CashFlowCategory[]);
    }
  }

  useEffect(() => {
    fetchIncomeCategories();
  }, []);

  return (
    <>
      <input
        id="income-id"
        name="income-id"
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
            id="income-amount" 
            name="income-amount"
            type="text"
            value={props.editingFormData?.amount ?? ""}
            onChange={props.onChange}
            placeholder="0.00" 
            className="input m-0 w-full" 
          />}
      />
      <InputFieldSetTemplate 
        label="Date" 
        isRequired={true}
        inputChild={
          <input 
            id="income-date" 
            name="income-date"
            type="date"
            value={
              props.editingFormData?.date
                ? new Date(props.editingFormData.date).toISOString().slice(0, 10)
                : ""
            }
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <select 
            name="income-categoryId"
            value={props.editingFormData.categoryId || ""} 
            onChange={props.onChange}
            className="select"
          >
            <option value="" disabled>Pick a category</option>
            {incomeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        }
      />
      <InputFieldSetTemplate 
        label="Description" 
        isRequired={false}
        inputChild={
          <input 
            id="income-description" 
            name="income-description"
            type="text"
            value={props.editingFormData?.description ?? ""}
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
    </>
  )
}
