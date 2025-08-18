'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormState } from '@/app/hooks';
import { getAllHoldings, getHoldingSnapshotsByDateRange } from '@/app/lib/api/data-methods';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { formHasAnyValue, FormTemplate } from '@/app/components/form';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots/components';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings/components';
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
    const dateRange = { from: new Date(date), to: new Date(date) };
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

  const selectedStartSnapshotHoldingId: number | null = useMemo(() => {
    const startId = (formState.editingFormData as HoldingInvestmentReturnFormData)?.startHoldingSnapshotId;
    if (!startId)
      return null;
    const snapshot = startSnapshots.find(s => Number(s.id) === Number(startId));
    const holdingIdFromSnapshot = snapshot?.holdingId;
    if (!holdingIdFromSnapshot)
      return snapshot?.holding?.id ?? null;
    const numericHoldingId = Number(holdingIdFromSnapshot);
    if (!Number.isNaN(numericHoldingId)) return numericHoldingId;
    return snapshot?.holding?.id ?? null;
  }, [formState.editingFormData, startSnapshots]);

  const isEndHoldingLocked = useMemo(() => {
    const startSnapshotId = (formState.editingFormData as HoldingInvestmentReturnFormData)?.startHoldingSnapshotId;
    return !!startSnapshotId;
  }, [formState.editingFormData]);

  const filteredEndHoldings = useMemo(() => {
    if (!isEndHoldingLocked)
      return holdings;
    const endHoldingFromForm = (formState.editingFormData as HoldingInvestmentReturnFormData)?.endHoldingSnapshotHoldingId;
    const targetId = selectedStartSnapshotHoldingId ?? (endHoldingFromForm ? Number(endHoldingFromForm) : null);
    if (!targetId)
      return holdings;
    return holdings.filter(h => Number(h.id) === Number(targetId));
  }, [holdings, isEndHoldingLocked, selectedStartSnapshotHoldingId, formState.editingFormData]);

  useEffect(() => {
    if (!selectedStartSnapshotHoldingId) 
      return;
    const currentEndHoldingId = (formState.editingFormData as HoldingInvestmentReturnFormData)?.endHoldingSnapshotHoldingId;
    if (Number(currentEndHoldingId) === Number(selectedStartSnapshotHoldingId)) 
      return;
    const syntheticEvent = {
      target: {
        name: `${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotHoldingId`,
        value: String(selectedStartSnapshotHoldingId)
      }
    } as React.ChangeEvent<HTMLInputElement>;
    formState.onChange(syntheticEvent);
  }, [selectedStartSnapshotHoldingId]);

  const inputs: React.ReactElement = 
    <HoldingInvestmentReturnInputs
      editingFormData={formState.editingFormData as HoldingInvestmentReturnFormData}
      onChange={formState.onChange}
      startSnapshots={startSnapshots}
      holdings={filteredEndHoldings}
      isEndHoldingLocked={isEndHoldingLocked}
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


