'use client';

import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { UpdateCreateButton, ResetButton, formHasAnyValue, FormTemplate } from '@/app/components';
import { BUDGET_ITEM_NAME, BUDGET_ITEM_NAME_LOWERCASE, Budget, BudgetFormData, BudgetInputs } from '@/app/cashflow/budget';


export function BudgetsForm({formState} : {formState: FormState<Budget, BudgetFormData>}) {
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = formState.editingFormData?.id ? `Edit ${BUDGET_ITEM_NAME}` : `New ${BUDGET_ITEM_NAME}`;

  const inputs: React.ReactElement = 
    <BudgetInputs
      editingFormData={formState.editingFormData}
      onChange={formState.onChange}
      setIsLoading={setIsLoading}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={formState.editingFormData?.id != null} 
          isDisabled={isLoading || formState.isSubmitting}
        />
        <ResetButton 
          onClick={formState.onReset}
          isHidden={!formHasAnyValue(formState)}
        />
      </>
    )

  return (
    <FormTemplate
      formId={`${BUDGET_ITEM_NAME_LOWERCASE}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}
