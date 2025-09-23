'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormState } from '@/app/hooks';
import { createHoldingSnapshot, getAllHoldings, getHoldingSnapshotsByDateRange, updateHoldingSnapshot, FetchResult } from '@/app/lib/api';
import { convertDateToISOString, convertDollarsToCents, getFirstDayOfMonth } from '@/app/lib/utils';
import { UpdateCreateButton, ResetButton, formHasAnyValue, FormTemplate } from '@/app/components';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, HoldingInvestmentReturnInputs, HoldingInvestmentReturnFormData, HoldingInvestmentReturn } from '@/app/net-worth/investment-returns';

export function HoldingInvestmentReturnForm(
  {formState} : {formState: FormState<HoldingInvestmentReturn, HoldingInvestmentReturnFormData>}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [startSnapshots, setStartSnapshots] = useState<HoldingSnapshot[]>([]);
  const [endSnapshotCreateUpdateError, setEndSnapshotCreateUpdateError] = useState("");
  
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
    const date = new Date(formState.editingFormData.startHoldingSnapshotDate);
    const dateRange = { from: date, to: date };
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
  }, [selectedStartSnapshotHoldingId, endHoldingId, formState, hasStartSnapshot]);

  const onFormSubmit = async (formData: FormData) => {
    const formId = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID
    const startDateValue = formData.get(`${formId}-startHoldingSnapshotDate`) as string;
    const endDateValue = formData.get(`${formId}-endHoldingSnapshotDate`) as string;
    const firstDayOfStartDateMonth = getFirstDayOfMonth(new Date(startDateValue));
    const firstDayOfEndDateMonth = getFirstDayOfMonth(new Date(endDateValue));
    if (startDateValue !== firstDayOfStartDateMonth  || startDateValue > endDateValue || new Date(endDateValue).getMonth() - new Date(startDateValue).getMonth() > 1) {
      setEndSnapshotCreateUpdateError("The start snapshot date must be the first day of the month before the end snapshot date.");
      return;
    }
    if (endDateValue !== firstDayOfEndDateMonth) {
      setEndSnapshotCreateUpdateError("The end snapshot date must be the first day of the month after the start snapshot date.");
      return;
    }

    const endHoldingSnapshotId = formData.get(`${formId}-endHoldingSnapshotId`) as string;
    const date = formData.get(`${formId}-endHoldingSnapshotDate`) as string;
    const balance = formData.get(`${formId}-endHoldingSnapshotBalance`) as string;

    const endHoldingSnapshot = {
      holdingId: endHoldingId,
      date: convertDateToISOString(new Date(date)),
      balance: convertDollarsToCents(balance) ?? 0,
    }
    if (!endHoldingId) {
      setEndSnapshotCreateUpdateError("End holding is required.");
      return;
    }
    if (!date) {
      setEndSnapshotCreateUpdateError("End holding snapshot date is required.");
      return;
    }
    if (!balance) {
      setEndSnapshotCreateUpdateError("End holding snapshot balance is required.");
      return;
    }

    let result: FetchResult<HoldingSnapshot> | null = null;
    if (endHoldingSnapshotId) {
      result = await updateHoldingSnapshot(endHoldingSnapshotId, endHoldingSnapshot);
    } else {
      result = await createHoldingSnapshot(endHoldingSnapshot);
    }
    if (!result.successful) {
      setEndSnapshotCreateUpdateError("Failed to create/update end holding snapshot. New investment return will not be created." + result.responseMessage);
      return;
    }
    // Build a new FormData to avoid mutating a potentially read-only FormData
    const updatedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      updatedFormData.set(key, value as string);
    }
    if (endHoldingId) {
      updatedFormData.set(`${formId}-endHoldingSnapshotHoldingId`, endHoldingId);
    }
    const newId = result.data?.id?.toString() ?? '';
    updatedFormData.set(`${formId}-endHoldingSnapshotId`, newId);
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

  const message = formState.message.text ? formState.message : endSnapshotCreateUpdateError ? { text: endSnapshotCreateUpdateError, type: 'ERROR' } : { text: '', type: null };

  return (
    <FormTemplate
      formId={`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-form`}
      handleSubmit={onFormSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={message}
    />
  )
}


