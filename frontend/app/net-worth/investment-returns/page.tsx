'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { NetWorthSideBar } from '../holding-snapshots/components/NetWorthSideBar';
import { useForm, useMobileDetection } from '@/app/hooks';
import { HOLDING_INVESTMENT_RETURNS_ENDPOINT, MANUAL_INVESTMENT_RETURNS_ENDPOINT } from '@/app/lib/api/data-methods';
import { ManualInvestmentReturn, ManualInvestmentReturnFormData, transformFormDataToManualInvestmentReturn } from './components/form/manual-investment-return-form';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, MANUAL_INVESTMENT_RETURN_ITEM_NAME } from './components/form';
import { InvestmentReturnForm } from './components/form/InvestmentReturnForm';
import { HoldingInvestmentReturn, HoldingInvestmentReturnFormData, transformFormDataToHoldingInvestmentReturn } from './components/form/holding-investment-return-form';

export default function InvestmentReturnsPage() {
  const isMobile = useMobileDetection();
  const [isManualActive, setIsManualActive] = useState<boolean>(false);

  const fetchManualInvestmentReturnItems = useCallback(async () => {
  }, []);

  const fetchHoldingInvestmentReturnItems = useCallback(async () => {
  }, []);

  const convertManualInvestmentReturnItemToFormData = (item: ManualInvestmentReturn): ManualInvestmentReturnFormData => {
    console.log(item);
    return {} as ManualInvestmentReturnFormData;
  };

  const convertHoldingInvestmentReturnItemToFormData = (item: HoldingInvestmentReturn): HoldingInvestmentReturnFormData => {
    console.log(item);
    return {} as HoldingInvestmentReturnFormData;
  };

  const manualInvestmentReturnFormState = useForm<ManualInvestmentReturn, ManualInvestmentReturnFormData>({
    itemName: MANUAL_INVESTMENT_RETURN_ITEM_NAME,
    itemEndpoint: MANUAL_INVESTMENT_RETURNS_ENDPOINT,
    transformFormDataToItem: transformFormDataToManualInvestmentReturn,
    convertItemToFormData: convertManualInvestmentReturnItemToFormData,
    fetchItems: fetchManualInvestmentReturnItems,
  });

  const holdingInvestmentReturnFormState = useForm<HoldingInvestmentReturn, HoldingInvestmentReturnFormData>({
    itemName: HOLDING_INVESTMENT_RETURN_ITEM_NAME,
    itemEndpoint: HOLDING_INVESTMENT_RETURNS_ENDPOINT,
    transformFormDataToItem: transformFormDataToHoldingInvestmentReturn,
    convertItemToFormData: convertHoldingInvestmentReturnItemToFormData,
    fetchItems: fetchHoldingInvestmentReturnItems,
  });

  useEffect(() => {
    fetchManualInvestmentReturnItems();
    fetchHoldingInvestmentReturnItems();
  }, [fetchManualInvestmentReturnItems, fetchHoldingInvestmentReturnItems]);
  
  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      {!isMobile && <NetWorthSideBar />}
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <InvestmentReturnForm 
            isManualActive={isManualActive}
            setIsManualActive={setIsManualActive}
            manualInvestmentReturnFormState={manualInvestmentReturnFormState} 
            holdingInvestmentReturnFormState={holdingInvestmentReturnFormState} 
          />
        </div>
        <div className="flex-1">{/* TODO: list view */}</div>
      </div>
    </div>
  )
}
