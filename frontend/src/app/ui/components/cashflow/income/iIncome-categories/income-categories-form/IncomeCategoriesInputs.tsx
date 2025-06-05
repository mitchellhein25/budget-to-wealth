import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import React from 'react'

interface IncomeCategoriesInputsProps {
  editingIncomeCategory: CashFlowCategory | null;
  onNameChange: (name: string) => void;
}

export default function IncomeCategoriesInputs(props : IncomeCategoriesInputsProps) {
  return (
    <>
      <input
        id="Id"
        name="Id"
        readOnly
        type="text"
        value={props.editingIncomeCategory?.id ?? ''}
        hidden={true}
      />
      <label htmlFor="Name" className="label">
        Name
      </label>
      <input
        id="Name"
        name="Name"
        type="text"
        required
        value={props.editingIncomeCategory?.name ?? ""}
        onChange={(e) => props.onNameChange(e.target.value)}
        className="input w-full"
      />
    </>
  )
}
