import { InputFieldSetTemplate } from '@/app/components/form'
import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../constants'
import React, { useMemo } from 'react'
import { InvestmentReturnFormData } from './InvestmentReturnFormData';
import { Category } from '@/app/components/categories/Category';
import { RecurrenceFrequency } from '@/app/cashflow/components/components/RecurrenceFrequency';

interface ManualInvestmentInputsProps {
  editingFormData: Partial<InvestmentReturnFormData>;
  onChange: React.ChangeEventHandler;
  manualCategories: Category[];
}

export function ManualInvestmentInputs({ editingFormData, onChange, manualCategories }: ManualInvestmentInputsProps) {
  return (
    <>
      <InputFieldSetTemplate
        label="Manual Investment Category"
        isRequired={true}
        inputChild={
          <select
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentCategoryId`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentCategoryId`}
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
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentReturnDate`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentReturnDate`}
            type="date"
            value={editingFormData.manualInvestmentReturnDate || ""}
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
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentPercentageReturn`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentPercentageReturn`}
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
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentRecurrenceFrequency`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentRecurrenceFrequency`}
            value={editingFormData.manualInvestmentRecurrenceFrequency || ""}
            onChange={onChange}
            className="select w-full"
          >
            <option value="">No recurrence</option>
            {Object.values(RecurrenceFrequency).map((f) => (
              <option key={f} value={f}>{f === 'Every2Weeks' ? 'Every 2 Weeks' : f}</option>
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
              id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentRecurrenceEndDate`}
              name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-manualInvestmentRecurrenceEndDate`}
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
