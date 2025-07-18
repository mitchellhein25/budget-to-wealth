"use client"

import React from "react"
import FormTemplate from "../form/FormTemplate";
import UpdateCreateButton from "../buttons/UpdateCreateButton";
import ResetButton from "../buttons/ResetButton";
import CategoriesInputs from "./CategoriesInputs";
import { Category } from "@/app/components/categories/Category";

interface CategoriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingCategory: Category | null;
  onNameChange: (name: string) => void;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  categoryTypeName: string;
}

export default function CategoriesForm(props: CategoriesFormProps) {

  const formHeader: string = props.editingCategory?.id ? `Edit ${props.categoryTypeName} Category` : `New ${props.categoryTypeName} Category`;

  const inputs: React.ReactElement = 
    <CategoriesInputs 
      editingCategory={props.editingCategory}
      onNameChange={props.onNameChange}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={props.editingCategory?.id != null} 
          isDisabled={false}
        />
        <ResetButton 
          onClick={props.onReset}
          isHidden={props.editingCategory == null || props.editingCategory.name == ""}
        />
      </>
    )

  return (
    <FormTemplate
      formId={`${props.categoryTypeName.toLowerCase()}-category-form`}
      handleSubmit={props.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      infoMessage={props.infoMessage}
      errorMessage={props.errorMessage}
    />
  )
}
