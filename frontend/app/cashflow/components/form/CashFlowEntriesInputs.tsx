'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { getCategoriesList } from '@/app/lib/api';
import { convertDateToISOString } from '@/app/lib/utils';
import { InputFieldSetTemplate, CurrencyInputField } from '@/app/components';
import { CashFlowType, CashFlowCategory, INCOME_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE_PLURAL, CashFlowEntryFormData, RecurrenceFrequency } from '@/app/cashflow';

interface CashFlowEntriesInputsProps {
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: React.ChangeEventHandler;
  cashFlowType: CashFlowType;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CashFlowEntriesInputs({ editingFormData, onChange, cashFlowType, setIsLoading }: CashFlowEntriesInputsProps) {
  const [categories, setCategories] = useState<CashFlowCategory[]>([]);
  const [noEndDate, setNoEndDate] = useState(false);
  const cashFlowTypeLower = cashFlowType.toLowerCase();
  
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await getCategoriesList(cashFlowType);
    if (response.successful) {
      setCategories((response.data as CashFlowCategory[]).sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsLoading(false);
  }, [cashFlowType, setIsLoading]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoriesPageUrl = () => `/cashflow/${cashFlowTypeLower === INCOME_ITEM_NAME_LOWERCASE ? INCOME_ITEM_NAME_LOWERCASE : EXPENSE_ITEM_NAME_LOWERCASE_PLURAL}/${cashFlowTypeLower}-categories`;

  return (
    <>
      <input
        id={`${cashFlowTypeLower}-id`}
        name={`${cashFlowTypeLower}-id`}
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
            id={`${cashFlowTypeLower}-amount`}
            name={`${cashFlowTypeLower}-amount`}
            value={editingFormData?.amount ?? ""}
            onChange={onChange}
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
              editingFormData?.date
                ? convertDateToISOString(new Date(editingFormData.date))
                : convertDateToISOString(new Date())
            }
            onChange={onChange}
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
              href={getCategoriesPageUrl()}
              className="btn btn-ghost btn-sm btn-circle"
              title={`Edit ${cashFlowType} Categories`}
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
            value={editingFormData?.description ?? ""}
            onChange={onChange}
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
            value={editingFormData.recurrenceFrequency || ""}
            onChange={onChange}
            className="select w-full"
          >
            <option value="">No recurrence</option>
            {Object.values(RecurrenceFrequency).map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency === RecurrenceFrequency.EVERY_2_WEEKS ? 'Every 2 Weeks' : frequency}
              </option>
            ))}
          </select>
        }
      />
      {editingFormData.recurrenceFrequency && (
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
                      onChange(syntheticEvent);
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
                  value={editingFormData.recurrenceEndDate || ""}
                  onChange={onChange}
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
