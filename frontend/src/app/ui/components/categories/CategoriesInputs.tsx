import { Category } from '@/app/lib/models/Category';
import React from 'react'
import InputFieldSetTemplate from '../form/InputFieldSetTemplate';

interface CategoriesInputsProps {
  editingCategory: Category | null;
  onNameChange: (name: string) => void;
}

export default function CategoriesInputs(props : CategoriesInputsProps) {
  return (
    <>
      <input
        id="Id"
        name="Id"
        readOnly
        type="text"
        value={props.editingCategory?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate
        label="Name"
        isRequired={true}
        inputChild={
          <input
            id="Name"
            name="Name"
            type="text"
            required
            value={props.editingCategory?.name ?? ""}
            onChange={(e) => props.onNameChange(e.target.value)}
            className="input w-full"
          />
        }
      />
    </>
  )
}
