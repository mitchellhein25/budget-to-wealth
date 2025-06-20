'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/lib/models/cashflow/CashFlowCategory';
import InputFieldSetTemplate from '@/app/ui/components/form/InputFieldSetTemplate';
import React, { useCallback, useEffect, useState } from 'react'
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { CashFlowEntryFormData } from './CashFlowEntryFormData';

interface CashFlowEntriesInputsProps {
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: React.ChangeEventHandler;
  cashFlowType: CashFlowType;
}

export default function CashFlowEntriesInputs(props: CashFlowEntriesInputsProps) {
  const [categories, setCategories] = useState<CashFlowCategory[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const cashFlowTypeLower = props.cashFlowType.toLowerCase();
  
  const fetchCategories = useCallback(async () => {
    // setInfoMessage("");
    // setErrorMessage("");
    // setIsLoading(true);
    const response = await getRequest<CashFlowCategory>(`CashFlowCategories?cashFlowType=${props.cashFlowType}`);
    if (response.successful) {
      setCategories(response.data as CashFlowCategory[]);
    }
  }, [props.cashFlowType]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <input
        id={`${cashFlowTypeLower}-id`}
        name={`${cashFlowTypeLower}-id`}
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
            id={`${cashFlowTypeLower}-amount`}
            name={`${cashFlowTypeLower}-amount`}
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
            id={`${cashFlowTypeLower}-date`}
            name={`${cashFlowTypeLower}-date`}
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
            id={`${cashFlowTypeLower}-categoryId`}
            name={`${cashFlowTypeLower}-categoryId`}
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
      <InputFieldSetTemplate 
        label="Description" 
        isRequired={false}
        inputChild={
          <input
            id={`${cashFlowTypeLower}-description`}
            name={`${cashFlowTypeLower}-description`}
            type="text"
            value={props.editingFormData?.description ?? ""}
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
    </>
  )
}
