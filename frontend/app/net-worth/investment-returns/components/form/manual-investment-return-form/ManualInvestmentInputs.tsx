import React from 'react'
import { InputFieldSetTemplate } from '@/app/components/form'

import { Category } from '@/app/components/categories/Category';
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../'
import { ManualInvestmentReturnFormData } from '.';
import { convertDateToISOString } from '@/app/components/Utils';
import { RecurrenceFrequency } from '@/app/cashflow/components/components/RecurrenceFrequency';

interface ManualInvestmentInputsProps {
  editingFormData: Partial<ManualInvestmentReturnFormData>;
  onChange: React.ChangeEventHandler;
  manualCategories: Category[];
}

export function ManualInvestmentInputs({ editingFormData, onChange, manualCategories }: ManualInvestmentInputsProps) {
  const formId = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  return (
    <>
      <input
        id={`${formId}-id`}
        name={`${formId}-id`}
        readOnly
        type="text"
        value={editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate
        label="Manual Investment Category"
        isRequired={true}
        inputChild={
          <select
            id={`${formId}-manualInvestmentCategoryId`}
            name={`${formId}-manualInvestmentCategoryId`}
            value={editingFormData.manualInvestmentCategoryId || ""}
            onChange={onChange}
            className="select w-full"
          >
            <option value="" disabled>Pick a category</option>
            {manualCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        }
      />
      <InputFieldSetTemplate
        label="Return Date"
        isRequired={true}
        inputChild={
          <input
            id={`${formId}-manualInvestmentReturnDate`}
            name={`${formId}-manualInvestmentReturnDate`}
            type="date"
            value={editingFormData.manualInvestmentReturnDate 
              ? convertDateToISOString(new Date(editingFormData.manualInvestmentReturnDate)) 
              : convertDateToISOString(new Date())}
            onChange={onChange}
            className="input w-full"
          />
        }
      />
      <InputFieldSetTemplate
        label="Percentage Return (%)"
        isRequired={true}
        inputChild={
          <input
            id={`${formId}-manualInvestmentPercentageReturn`}
            name={`${formId}-manualInvestmentPercentageReturn`}
            type="number"
            step="0.01"
            value={editingFormData.manualInvestmentPercentageReturn || ""}
            onChange={onChange}
            placeholder="00.00%"
            className="input w-full"
          />
        }
      />
      <InputFieldSetTemplate
        label="Recurrence"
        isRequired={false}
        inputChild={
          <select
            id={`${formId}-manualInvestmentRecurrenceFrequency`}
            name={`${formId}-manualInvestmentRecurrenceFrequency`}
            value={editingFormData.manualInvestmentRecurrenceFrequency || ""}
            onChange={onChange}
            className="select w-full"
          >
            <option value="">No recurrence</option>
            {Object.values(RecurrenceFrequency).map((f) => (
              <option key={f} value={f}>{f === RecurrenceFrequency.EVERY_2_WEEKS ? 'Every 2 Weeks' : f}</option>
            ))}
          </select>
        }
      />
      {editingFormData.manualInvestmentRecurrenceFrequency && (
        <InputFieldSetTemplate
          label="Recurrence End Date"
          isRequired={false}
          inputChild={
            <input
              id={`${formId}-manualInvestmentRecurrenceEndDate`}
              name={`${formId}-manualInvestmentRecurrenceEndDate`}
              type="date"
              value={editingFormData.manualInvestmentRecurrenceEndDate || ""}
              onChange={onChange}
              className="input w-full"
            />
          }
        />
      )}
    </>
  )
}
