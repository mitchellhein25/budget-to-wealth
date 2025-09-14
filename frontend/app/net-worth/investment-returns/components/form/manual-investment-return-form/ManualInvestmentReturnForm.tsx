'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { FormState } from '@/app/hooks';
import { getManualInvestmentCategories, ManualInvestmentCategory } from '@/app/lib/api';
import { UpdateCreateButton, ResetButton, FormTemplate, formHasAnyValue } from '@/app/components';
import { ManualInvestmentReturnFormData, ManualInvestmentInputs, ManualInvestmentReturn, MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, MANUAL_INVESTMENT_RETURN_ITEM_NAME } from '@/app/net-worth/investment-returns';

export function ManualInvestmentReturnForm(
  {formState} : {formState: FormState<ManualInvestmentReturn, ManualInvestmentReturnFormData>}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [manualCategories, setManualCategories] = useState<ManualInvestmentCategory[]>([]);
  const fetchManualCategories = useCallback(async () => {
    setIsLoading(true);
    const resp = await getManualInvestmentCategories();
    if (resp.successful && resp.data) {
      setManualCategories(resp.data);
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    fetchManualCategories();
  }, [fetchManualCategories]);
  
  const formHeader: string = formState.editingFormData?.id ? `Edit ${MANUAL_INVESTMENT_RETURN_ITEM_NAME}` : `New ${MANUAL_INVESTMENT_RETURN_ITEM_NAME}`;

  const inputs: React.ReactElement = 
    <ManualInvestmentInputs
      editingFormData={formState.editingFormData as ManualInvestmentReturnFormData}
      onChange={formState.onChange}
      manualCategories={manualCategories}
    />

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
      formId={`${MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}


