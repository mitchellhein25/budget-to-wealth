import React from 'react'
import { InputFieldSetTemplate } from '../../form';
import { CategoryFormData } from '@/app/components/categories/Category';

interface CategoriesInputsProps {
  editingFormData: Partial<CategoryFormData>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CategoriesInputs(props : CategoriesInputsProps) {
  return (
    <>
      <input
        id="id"
        name="id"
        readOnly
        type="text"
        value={props.editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate
        label="Name"
        isRequired={true}
        inputChild={
          <input
            id="name"
            name="name"
            type="text"
            required
            value={props.editingFormData?.name ?? ""}
            onChange={props.onChange}
            className="input w-full"
          />
        }
      />
    </>
  )
}
