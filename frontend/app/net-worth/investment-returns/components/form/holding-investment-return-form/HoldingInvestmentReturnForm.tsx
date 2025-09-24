'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormState } from '@/app/hooks';
import { getAllHoldings, getHoldingSnapshotsByDateRange } from '@/app/lib/api';
import { UpdateCreateButton, ResetButton, formHasAnyValue, FormTemplate } from '@/app/components';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, HoldingInvestmentReturnInputs, HoldingInvestmentReturnFormData, HoldingInvestmentReturn, holdingInvestmentFormOnSubmit } from '@/app/net-worth/investment-returns';

export function HoldingInvestmentReturnForm(
  { formState }: { formState: FormState<HoldingInvestmentReturn, HoldingInvestmentReturnFormData> }
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

  useEffect(() => {
    fetchHoldings();
    fetchStartSnapshots();
  }, [fetchHoldings, fetchStartSnapshots]);

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
  
  const message = useMemo(() => {
    if (formState.message.text) 
      return formState.message;
    if (endSnapshotCreateUpdateError) 
      return { text: endSnapshotCreateUpdateError, type: 'ERROR' };
    return { text: '', type: null };
  }, [formState.message, endSnapshotCreateUpdateError]);

  return (
    <FormTemplate
      formId={`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-form`}
      handleSubmit={(formData) => holdingInvestmentFormOnSubmit(formData, setEndSnapshotCreateUpdateError, endHoldingId, formState)}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={message}
    />
  )
}


