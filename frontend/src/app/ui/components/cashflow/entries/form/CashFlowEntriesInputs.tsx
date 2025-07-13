'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowCategory } from '@/app/lib/models/cashflow/CashFlowCategory';
import InputFieldSetTemplate from '@/app/ui/components/form/InputFieldSetTemplate';
import React, { useCallback, useEffect, useState } from 'react'
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { CashFlowEntryFormData } from './CashFlowEntryFormData';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { RecurrenceFrequency } from '@/app/lib/models/cashflow/RecurrenceFrequency';
import { convertDateToISOString } from '../../../Utils';

interface CashFlowEntriesInputsProps {
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: React.ChangeEventHandler;
  cashFlowType: CashFlowType;
}

export default function CashFlowEntriesInputs(props: CashFlowEntriesInputsProps) {
  const [categories, setCategories] = useState<CashFlowCategory[]>([]);
  const [noEndDate, setNoEndDate] = useState(false);
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

  const getCategoriesPageUrl = () => {
    switch (props.cashFlowType) {
      case CashFlowType.Income:
        return '/cashflow/income/income-categories';
      case CashFlowType.Expense:
      default:
        return '/cashflow/expenses/expense-categories';
    }
  };

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
                ? convertDateToISOString(new Date(props.editingFormData.date))
                : convertDateToISOString(new Date())
            }
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`${cashFlowTypeLower}-categoryId`}
              name={`${cashFlowTypeLower}-categoryId`}
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
              href={getCategoriesPageUrl()}
              className="btn btn-ghost btn-sm btn-circle"
              title={`Edit ${props.cashFlowType} Categories`}
            >
              <Edit size={16} />
            </Link>
          </div>
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
      <InputFieldSetTemplate 
        label="Recurrence Frequency" 
        isRequired={false}
        inputChild={
          <select
            id={`${cashFlowTypeLower}-recurrenceFrequency`}
            name={`${cashFlowTypeLower}-recurrenceFrequency`}
            value={props.editingFormData.recurrenceFrequency || ""}
            onChange={props.onChange}
            className="select w-full"
          >
            <option value="">No recurrence</option>
            {Object.values(RecurrenceFrequency).map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency === RecurrenceFrequency.Every2Weeks ? 'Every 2 Weeks' : frequency}
              </option>
            ))}
          </select>
        }
      />
      {props.editingFormData.recurrenceFrequency && (
        <InputFieldSetTemplate 
          label="Recurrence End Date" 
          isRequired={false}
          inputChild={
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${cashFlowTypeLower}-neverEnd`}
                  name={`${cashFlowTypeLower}-neverEnd`}
                  checked={noEndDate}
                  onChange={(e) => {
                    setNoEndDate(e.target.checked);
                    if (e.target.checked) {
                      const syntheticEvent = {
                        target: {
                          name: `${cashFlowTypeLower}-recurrenceEndDate`,
                          value: ''
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      props.onChange(syntheticEvent);
                    }
                  }}
                  className="checkbox"
                />
                <label htmlFor={`${cashFlowTypeLower}-neverEnd`} className="text-sm">
                  No end date
                </label>
              </div>
              {!noEndDate && (
                <input
                  id={`${cashFlowTypeLower}-recurrenceEndDate`}
                  name={`${cashFlowTypeLower}-recurrenceEndDate`}
                  type="date"
                  value={props.editingFormData.recurrenceEndDate || ""}
                  onChange={props.onChange}
                  className="input w-full" 
                />
              )}
            </div>
          }
        />
      )}
    </>
  )
}
