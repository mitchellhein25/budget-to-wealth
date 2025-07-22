"use client"

import React from "react"
import FormTemplate from "../form/FormTemplate";
import UpdateCreateButton from "../buttons/UpdateCreateButton";
import ResetButton from "../buttons/ResetButton";
import CategoriesInputs from "./CategoriesInputs";
import { FormState } from "@/app/hooks";
import { Category, CategoryFormData } from "./Category";

interface CategoriesFormProps<T extends Category> {
  formState: FormState<T, CategoryFormData>;
  categoryTypeName: string;
}

export default function CategoriesForm<T extends Category>({formState, categoryTypeName} : CategoriesFormProps<T>) {

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
