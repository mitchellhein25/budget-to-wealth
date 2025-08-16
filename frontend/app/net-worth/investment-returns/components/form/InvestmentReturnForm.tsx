'use client';

import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { formHasAnyValue, FormTemplate } from '@/app/components/form';
import { INVESTMENT_RETURN_ITEM_NAME, INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../constants';
import { InvestmentReturn } from '../InvestmentReturn';
import { InvestmentReturnFormData } from './InvestmentReturnFormData';
import { InvestmentReturnInputs } from './InvestmentReturnInputs';

export function InvestmentReturnForm(
  {formState} : {formState: FormState<InvestmentReturn, InvestmentReturnFormData>}
) {
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = formState.editingFormData?.id ? `Edit ${INVESTMENT_RETURN_ITEM_NAME}` : `New ${INVESTMENT_RETURN_ITEM_NAME}`;

  const inputs: React.ReactElement = 
    <InvestmentReturnInputs
      editingFormData={formState.editingFormData as InvestmentReturnFormData}
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
      formId={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}


