'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormState } from '@/app/hooks';
import { createHoldingSnapshot, getAllHoldings, getHoldingSnapshotsByDateRange } from '@/app/lib/api/data-methods';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { formHasAnyValue, FormTemplate } from '@/app/components/form';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots/components';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings/components';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../';
import { HoldingInvestmentReturn, HoldingInvestmentReturnInputs, HoldingInvestmentReturnFormData } from '.';
import { convertDateToISOString, convertDollarsToCents, formatDate } from '@/app/components';

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

  const startSnapshotId = (formState.editingFormData as HoldingInvestmentReturnFormData)?.startHoldingSnapshotId;

  const endHoldingId = (formState.editingFormData as HoldingInvestmentReturnFormData)?.endHoldingSnapshotHoldingId;

  const hasStartSnapshot = useMemo(() => !!startSnapshotId, [startSnapshotId]);

  const selectedStartSnapshotHoldingId: string | null = useMemo(() => {
    const snapshot = startSnapshots.find(s => s.id?.toString() === startSnapshotId?.toString());
    return snapshot?.holdingId ?? null;
  }, [startSnapshotId, startSnapshots]);

  const filteredEndHoldings = useMemo(() => {
    const targetId = selectedStartSnapshotHoldingId ?? endHoldingId;
    if (!targetId)
      return holdings;
    return holdings.filter(h => h.id?.toString() === targetId.toString());
  }, [holdings, selectedStartSnapshotHoldingId, endHoldingId]);

  useEffect(() => {
    if (!hasStartSnapshot || endHoldingId === selectedStartSnapshotHoldingId) 
      return;

    const syntheticEvent = {
      target: {
        name: `${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotHoldingId`,
        value: selectedStartSnapshotHoldingId
      }
    } as React.ChangeEvent<HTMLInputElement>;
    formState.onChange(syntheticEvent);
  }, [selectedStartSnapshotHoldingId]);

  const onFormSubmit = async (formData: FormData) => {
    const date = formData.get(`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotDate`) as string;
    const balance = formData.get(`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotBalance`) as string;

    const endHoldingSnapshot = {
      holdingId: endHoldingId,
      date: convertDateToISOString(new Date(date)),
      balance: convertDollarsToCents(balance) ?? 0,
    }
    const result = await createHoldingSnapshot(endHoldingSnapshot);
    // Build a new FormData to avoid mutating a potentially read-only FormData
    const updatedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      updatedFormData.set(key, value as string);
    }
    if (endHoldingId) {
      updatedFormData.set(`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotHoldingId`, endHoldingId);
    }
    if (result.successful) {
      const newId = result.data?.id?.toString() ?? '';
      updatedFormData.set(`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotId`, newId);
    } else {
      formState.message = { text: result.responseMessage, type: 'ERROR'};
      }
    formState.handleSubmit(updatedFormData);
  }

  const inputs: React.ReactElement = 
    <HoldingInvestmentReturnInputs
      editingFormData={formState.editingFormData as HoldingInvestmentReturnFormData}
      onChange={formState.onChange}
      startSnapshots={startSnapshots}
      holdings={filteredEndHoldings}
      isEndHoldingLocked={hasStartSnapshot}
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
      handleSubmit={onFormSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}


