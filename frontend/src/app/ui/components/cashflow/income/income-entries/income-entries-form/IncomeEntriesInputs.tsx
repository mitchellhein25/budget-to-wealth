import { IncomeEntryFormData } from '@/app/cashflow/income/page';
import InputFieldSetTemplate from '@/app/ui/components/InputFieldSetTemplate';
import React from 'react'

interface IncomeEntriesInputsProps {
  editingFormData: Partial<IncomeEntryFormData>;
  onChange: React.ChangeEventHandler;
}

export default function IncomeEntriesInputs(props: IncomeEntriesInputsProps) {
  
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
            value={props.editingFormData?.date?.toString() ?? ""}
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <select 
            name="income-category"
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
