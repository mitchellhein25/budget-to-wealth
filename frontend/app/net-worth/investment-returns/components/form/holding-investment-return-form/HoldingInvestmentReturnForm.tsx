'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { FormState } from '@/app/hooks';
import { getAllHoldings, getHoldingSnapshotsByDateRange } from '@/app/lib/api/data-methods';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { formHasAnyValue, FormTemplate } from '@/app/components/form';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots/components';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings/components';
import { DateRange } from '@/app/components';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../';
import { HoldingInvestmentReturn, HoldingInvestmentReturnInputs, HoldingInvestmentReturnFormData } from '.';

export function HoldingInvestmentReturnForm(
  {formState} : {formState: FormState<HoldingInvestmentReturn, HoldingInvestmentReturnFormData>}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [startSnapshots, setStartSnapshots] = useState<HoldingSnapshot[]>([]);
  
  const formHeader: string = formState.editingFormData?.id ? `Edit ${HOLDING_INVESTMENT_RETURN_ITEM_NAME}` : `New ${HOLDING_INVESTMENT_RETURN_ITEM_NAME}`;

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllHoldings();
    if (response.successful && response.data) {
      setHoldings(response.data.sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsLoading(false);
  }, [setIsLoading]);

  const fetchStartSnapshots = useCallback(async () => {
    if (!formState.editingFormData?.startHoldingSnapshotDate) {
      setStartSnapshots([]);
      return;
    }
    setIsLoading(true);
    const date = formState.editingFormData.startHoldingSnapshotDate;
    const dateRange = { startDate: new Date(date), endDate: new Date(date) } as DateRange;
    const response = await getHoldingSnapshotsByDateRange(dateRange);
    if (response.successful && response.data) {
      setStartSnapshots(response.data);
    }
    setIsLoading(false);
  }, [formState.editingFormData?.startHoldingSnapshotDate, setIsLoading]);


  useEffect(() => {
    fetchHoldings();
    fetchStartSnapshots();
  }, [fetchHoldings, fetchStartSnapshots]);

  const inputs: React.ReactElement = 
    <HoldingInvestmentReturnInputs
      editingFormData={formState.editingFormData as HoldingInvestmentReturnFormData}
      onChange={formState.onChange}
      startSnapshots={startSnapshots}
      holdings={holdings}
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
      formId={`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}


