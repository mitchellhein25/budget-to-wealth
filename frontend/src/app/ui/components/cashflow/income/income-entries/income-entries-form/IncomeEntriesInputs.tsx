import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import InputFieldSetTemplate from '@/app/ui/components/InputFieldSetTemplate';
import React from 'react'

interface IncomeEntriesInputsProps {
  editingIncomeEntry: CashFlowEntry | null;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function IncomeEntriesInputs(props: IncomeEntriesInputsProps) {
  return (
    <>
      <input
        id="Id"
        name="Id"
        readOnly
        type="text"
        value={props.editingIncomeEntry?.id ?? ''}
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
            required
            value={props.editingIncomeEntry?.amount ?? ""}
            onChange={props.onChange}
            className="input w-full" 
            placeholder="0.00" 
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
            required
            value={props.editingIncomeEntry?.date ?? ""}
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
      <InputFieldSetTemplate 
        label="Category" 
        isRequired={true}
        inputChild={
          <select defaultValue="Pick a category" className="select">
            <option disabled={true}>Pick a category</option>
            <option>Chrome</option>
            <option>FireFox</option>
            <option>Safari</option>
          </select>}
      />
      <InputFieldSetTemplate 
        label="Description" 
        isRequired={false}
        inputChild={
          <input 
            id="income-description" 
            name="income-description"
            type="date"
            required
            value={props.editingIncomeEntry?.description ?? ""}
            onChange={props.onChange}
            className="input w-full" 
          />}
      />
    </>
  )
}
