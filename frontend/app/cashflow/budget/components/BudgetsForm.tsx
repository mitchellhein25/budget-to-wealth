import React, { useState } from 'react'
import FormTemplate from '@/app/components/form/FormTemplate';
import UpdateCreateButton from '@/app/components/buttons/UpdateCreateButton';
import ResetButton from '@/app/components/buttons/ResetButton';
import { BudgetFormData } from './BudgetFormData';
import BudgetInputs from './BudgetInputs';
import { FormState } from '@/app/hooks/useForm';
import { Budget } from './Budget';
import { BUDGET_ITEM_NAME, BUDGET_ITEM_NAME_LOWERCASE } from './constants';


export default function BudgetsForm({formState} : {formState: FormState<Budget, BudgetFormData>}) {
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
          isHidden={true}
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
