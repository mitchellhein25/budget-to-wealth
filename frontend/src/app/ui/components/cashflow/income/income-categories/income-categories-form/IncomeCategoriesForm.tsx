"use client"

import React from "react"
import { CashFlowCategory } from "@/app/lib/models/CashFlow/CashFlowCategory";
import FormTemplate from "../../../../FormTemplate";
import UpdateCreateButton from "../../../../buttons/UpdateCreateButton";
import ResetButton from "../../../../buttons/ResetButton";
import IncomeCategoriesInputs from "./IncomeCategoriesInputs";

interface IncomeCategoriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingIncomeCategory: CashFlowCategory | null;
  onNameChange: (name: string) => void;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
}

export default function IncomeCategoriesForm(props: IncomeCategoriesFormProps) {

  const formHeader: string = props.editingIncomeCategory?.id ? "Edit Income Category" : "New Income Category";

  const inputs: React.ReactElement = 
    <IncomeCategoriesInputs 
      editingIncomeCategory={props.editingIncomeCategory}
      onNameChange={props.onNameChange}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton isUpdateState={props.editingIncomeCategory?.id != null} />
        <ResetButton 
          onClick={props.onReset}
          isHidden={props.editingIncomeCategory == null || props.editingIncomeCategory.name == ""}
        />
      </>
    )

  return (
    <FormTemplate
      handleSubmit={props.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      infoMessage={props.infoMessage}
      errorMessage={props.errorMessage}
    />
  )
}
