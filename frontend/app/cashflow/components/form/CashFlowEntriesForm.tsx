import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { formHasAnyValue, FormTemplate } from '@/app/components/form';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { CashFlowEntriesInputs, CashFlowEntry, CashFlowEntryFormData, CashFlowType } from '..';

export function CashFlowEntriesForm({formState, cashFlowType} : {formState: FormState<CashFlowEntry, CashFlowEntryFormData>, cashFlowType: CashFlowType}) {
  
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = formState.editingFormData?.id ? `Edit ${cashFlowType} Entry` : `New ${cashFlowType} Entry`;

  const inputs: React.ReactElement = 
    <CashFlowEntriesInputs
      cashFlowType={cashFlowType}
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
      formId={`${cashFlowType.toLowerCase()}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}
