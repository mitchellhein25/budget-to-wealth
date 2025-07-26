"use client"

import React from "react"
import { FormState } from "@/app/hooks";
import { FormTemplate } from "../../form";
import { UpdateCreateButton, ResetButton } from "../../buttons";
import { Category, CategoryFormData } from "..";
import { CategoriesInputs } from "./CategoriesInputs";

interface CategoriesFormProps<T extends Category> {
  formState: FormState<T, CategoryFormData>;
  categoryTypeName: string;
}

export function CategoriesForm<T extends Category>({formState, categoryTypeName} : CategoriesFormProps<T>) {

  const formHeader: string = formState.editingFormData?.id ? `Edit ${categoryTypeName} Category` : `New ${categoryTypeName} Category`;

  const inputs: React.ReactElement = 
    <CategoriesInputs 
      editingFormData={formState.editingFormData}
      onChange={formState.onChange}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={formState.editingFormData?.id != null} 
          isDisabled={formState.isSubmitting}
        />
        <ResetButton 
          onClick={formState.onReset}
          isHidden={formState.editingFormData == null || formState.editingFormData.name == ""}
        />
      </>
    )

  return (
    <FormTemplate
      formId={`${categoryTypeName.toLowerCase()}-category-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}
