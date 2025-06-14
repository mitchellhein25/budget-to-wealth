"use client"

import React from "react"
import { CashFlowCategory } from "@/app/lib/models/CashFlow/CashFlowCategory";
import FormTemplate from "../../../form/FormTemplate";
import UpdateCreateButton from "../../../buttons/UpdateCreateButton";
import ResetButton from "../../../buttons/ResetButton";
import { CashFlowType } from "@/app/lib/models/CashFlow/CashFlowType";
import CashFlowCategoriesInputs from "./CashFlowCategoriesInputs";

interface CashFlowCategoriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingCashFlowCategory: CashFlowCategory | null;
  onNameChange: (name: string) => void;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  cashFlowType: CashFlowType
}

export default function CashFlowCategoriesForm(props: CashFlowCategoriesFormProps) {

  const formHeader: string = props.editingCashFlowCategory?.id ? `Edit ${props.cashFlowType} Category` : `New ${props.cashFlowType} Category`;

  const inputs: React.ReactElement = 
    <CashFlowCategoriesInputs 
      editingCashFlowCategory={props.editingCashFlowCategory}
      onNameChange={props.onNameChange}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={props.editingCashFlowCategory?.id != null} 
          isDisabled={false}
        />
        <ResetButton 
          onClick={props.onReset}
          isHidden={props.editingCashFlowCategory == null || props.editingCashFlowCategory.name == ""}
        />
      </>
    )

  return (
    <FormTemplate
      formId={`${props.cashFlowType}-category-form`}
      handleSubmit={props.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      infoMessage={props.infoMessage}
      errorMessage={props.errorMessage}
    />
  )
}
