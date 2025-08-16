import React from 'react'
import { InputFieldSetTemplate } from '../../form';
import { CategoryFormData } from '@/app/components/categories/Category';

interface CategoriesInputsProps {
  editingFormData: Partial<CategoryFormData>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categoryTypeName: string;
}

export function CategoriesInputs(props : CategoriesInputsProps) {
  return (
    <>
      <input
        id={`${props.categoryTypeName}-id`}
        name={`${props.categoryTypeName}-id`}
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
            id={`${props.categoryTypeName}-name`}
            name={`${props.categoryTypeName}-name`}
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
