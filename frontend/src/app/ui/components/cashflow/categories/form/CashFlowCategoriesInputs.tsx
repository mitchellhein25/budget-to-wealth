import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import React from 'react'

interface CashFlowCategoriesInputsProps {
  editingCashFlowCategory: CashFlowCategory | null;
  onNameChange: (name: string) => void;
}

export default function CashFlowCategoriesInputs(props : CashFlowCategoriesInputsProps) {
  return (
    <>
      <input
        id="Id"
        name="Id"
        readOnly
        type="text"
        value={props.editingCashFlowCategory?.id ?? ''}
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
        value={props.editingCashFlowCategory?.name ?? ""}
        onChange={(e) => props.onNameChange(e.target.value)}
        className="input w-full"
      />
    </>
  )
}
