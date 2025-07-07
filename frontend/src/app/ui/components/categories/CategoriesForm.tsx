"use client"

import React from "react"
import FormTemplate from "../form/FormTemplate";
import UpdateCreateButton from "../buttons/UpdateCreateButton";
import ResetButton from "../buttons/ResetButton";
import CategoriesInputs from "./CategoriesInputs";
import { Category } from "@/app/lib/models/Category";

interface CategoriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingCategory: Category | null;
  onNameChange: (name: string) => void;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  categoryTypeName: string;
  disableForm?: boolean;
}

export default function CategoriesForm(props: CategoriesFormProps) {

  const formHeader: string = props.editingCategory?.id ? `Edit ${props.categoryTypeName} Category` : `New ${props.categoryTypeName} Category`;

  const inputs: React.ReactElement = 
    <CategoriesInputs 
      editingCategory={props.editingCategory}
      onNameChange={props.onNameChange}
    />;

  // Handle manual form submission when disableForm is true
  const handleManualSubmit = () => {
    if (!props.editingCategory?.name?.trim()) return;
    
    const formData = new FormData();
    formData.append("Name", props.editingCategory.name);
    if (props.editingCategory.id) {
      formData.append("Id", props.editingCategory.id.toString());
    }
    
    props.handleSubmit(formData);
  };

  const buttons: React.ReactElement = (
    <>
      <UpdateCreateButton 
        isUpdateState={props.editingCategory?.id != null} 
        isDisabled={!props.editingCategory?.name?.trim()}
        onClick={props.disableForm ? handleManualSubmit : undefined}
        disableForm={props.disableForm}
      />
      <ResetButton 
        onClick={props.onReset}
        isHidden={props.editingCategory == null || props.editingCategory.name == ""}
        disableForm={props.disableForm}
      />
    </>
  )

  // If disableForm is true, render with better drawer layout
  if (props.disableForm) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">
          {formHeader}
        </h3>
        {inputs}
        <div className="flex justify-center gap-2">
          {buttons}
        </div>
        {props.errorMessage && (
          <div className="alert alert-error alert-sm">
            <span>{props.errorMessage}</span>
          </div>
        )}
        {props.infoMessage && (
          <div className="alert alert-success alert-sm">
            <span>{props.infoMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Default rendering with FormTemplate
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
