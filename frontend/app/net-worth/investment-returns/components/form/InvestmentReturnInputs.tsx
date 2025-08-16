'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../constants';
import { InvestmentReturnFormData, ManualInvestmentInputs, HoldingInvestmentReturnInputs } from './';
import { DateRange } from '@/app/components/';
import { getAllHoldings, getHoldingSnapshotsByDateRange, getManualInvestmentCategories } from '@/app/lib/api/data-methods';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings/components';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots/components/HoldingSnapshot';

type ManualInvestmentCategory = { id: number; name: string };

interface InvestmentReturnInputsProps {
  editingFormData: InvestmentReturnFormData;
  onChange: React.ChangeEventHandler;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InvestmentReturnInputs({ editingFormData, onChange, setIsLoading }: InvestmentReturnInputsProps) {
  const [isManual, setIsManual] = useState<boolean>(!!editingFormData.isManualInvestment);
  const [manualCategories, setManualCategories] = useState<ManualInvestmentCategory[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [startSnapshots, setStartSnapshots] = useState<HoldingSnapshot[]>([]);

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllHoldings();
    if (response.successful && response.data) {
      setHoldings(response.data.sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsLoading(false);
  }, [setIsLoading]);

  const fetchStartSnapshots = useCallback(async () => {
    if (!editingFormData.startHoldingSnapshotDate) {
      setStartSnapshots([]);
      return;
    }
    setIsLoading(true);
    const date = editingFormData.startHoldingSnapshotDate;
    const dateRange = { startDate: new Date(date), endDate: new Date(date) } as DateRange;
    const response = await getHoldingSnapshotsByDateRange(dateRange);
    if (response.successful && response.data) {
      setStartSnapshots(response.data);
    }
    setIsLoading(false);
  }, [editingFormData.startHoldingSnapshotDate, setIsLoading]);

  const fetchManualCategories = useCallback(async () => {
    setIsLoading(true);
    const resp = await getManualInvestmentCategories();
    if (resp.successful && resp.data) {
      setManualCategories(resp.data);
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    fetchHoldings();
    fetchStartSnapshots();
    fetchManualCategories();
  }, [fetchHoldings, fetchStartSnapshots, fetchManualCategories]);

  return (
    <>
      <input
        id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-id`}
        name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-id`}
        readOnly
        type="text"
        value={editingFormData?.id ?? ''}
        hidden={true}
      />

      <div className="flex items-center gap-2">
        <input
          id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`}
          name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`}
          type="checkbox"
          className="checkbox"
          checked={isManual}
          onChange={(e) => {
            setIsManual(e.target.checked);
            const syntheticEvent = { target: { name: `${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`, value: String(e.target.checked) } } as any;
            onChange(syntheticEvent);
          }}
        />
        <label htmlFor={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`}>Is Non-Holding Investment</label>
      </div>

      {isManual ? (
        <ManualInvestmentInputs
          editingFormData={editingFormData}
          onChange={onChange}
          manualCategories={manualCategories}
        />
      ) : (
        <HoldingInvestmentReturnInputs
          editingFormData={editingFormData}
          onChange={onChange}
          startSnapshots={startSnapshots}
          holdings={holdings}
        />
      )}
    </>
  )
}


