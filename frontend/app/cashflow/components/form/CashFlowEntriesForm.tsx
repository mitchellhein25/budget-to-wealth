import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { FormTemplate } from '@/app/components/form';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { CashFlowEntriesInputs, CashFlowEntryFormData } from './';
import { CashFlowEntry, CashFlowType } from '..';

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
          isHidden={true}
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
