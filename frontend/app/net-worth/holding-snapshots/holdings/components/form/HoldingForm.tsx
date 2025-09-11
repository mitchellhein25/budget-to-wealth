'use client';

import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { UpdateCreateButton, ResetButton, formHasAnyValue, FormTemplate } from '@/app/components';
import { HOLDING_ITEM_NAME, HOLDING_ITEM_NAME_LOWERCASE, Holding, HoldingInputs, HoldingFormData } from '@/app/net-worth/holding-snapshots/holdings';

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
          isHidden={!formHasAnyValue(formState)}
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
