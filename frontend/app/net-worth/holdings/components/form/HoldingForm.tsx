import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { FormTemplate } from '@/app/components/form';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { HOLDING_ITEM_NAME, HOLDING_ITEM_NAME_LOWERCASE, Holding, HoldingInputs, HoldingFormData } from '../';

export function HoldingForm(
  {formState} : {formState: FormState<Holding, HoldingFormData>}
 ) {
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = formState.editingFormData?.id ? `Edit ${HOLDING_ITEM_NAME}` : `New ${HOLDING_ITEM_NAME}`;

  const inputs: React.ReactElement = 
    <HoldingInputs
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
      formId={`${HOLDING_ITEM_NAME_LOWERCASE}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}
