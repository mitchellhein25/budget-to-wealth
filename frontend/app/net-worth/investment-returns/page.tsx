'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { NetWorthSideBar } from '../holding-snapshots/components/NetWorthSideBar';
import { useForm, useMobileDetection } from '@/app/hooks';
import { getHoldingInvestmentReturnsByDateRange, getManualInvestmentReturnsByDateRange, HOLDING_INVESTMENT_RETURNS_ENDPOINT, MANUAL_INVESTMENT_RETURNS_ENDPOINT } from '@/app/lib/api/data-methods';
import { ManualInvestmentReturnFormData, transformFormDataToManualInvestmentReturn } from './components/form/manual-investment-return-form';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE, MANUAL_INVESTMENT_RETURN_ITEM_NAME, MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE } from './components/form';
import { InvestmentReturnForm } from './components/form/InvestmentReturnForm';
import { HoldingInvestmentReturnFormData, transformFormDataToHoldingInvestmentReturn } from './components/form/holding-investment-return-form';
import { ManualInvestmentReturn } from './components/ManualInvestmentReturn';
import { HoldingInvestmentReturn } from './components/HoldingInvestmentReturn';
import { InvestmentReturnList } from './components/list/InvestmentReturnList';
import { DateRange, getCurrentMonthRange, MESSAGE_TYPE_ERROR, MessageState, messageTypeIsError } from '@/app/components';

export default function InvestmentReturnsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [manualInvestmentReturns, setManualInvestmentReturns] = useState<ManualInvestmentReturn[]>([]);
  const [holdingInvestmentReturns, setHoldingInvestmentReturns] = useState<HoldingInvestmentReturn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const [isManualActive, setIsManualActive] = useState<boolean>(false);
  const isMobile = useMobileDetection();

  const fetchHoldingInvestmentReturnItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
    const response = await getHoldingInvestmentReturnsByDateRange(dateRange);
    if (!response.successful) {
      setErrorMessage(`Failed to load ${HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE}s. Please try again.`);
        return;
      }
      setHoldingInvestmentReturns(response.data as HoldingInvestmentReturn[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const fetchManualInvestmentReturnItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
    const response = await getManualInvestmentReturnsByDateRange(dateRange);
    if (!response.successful) {
      setErrorMessage(`Failed to load ${MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE}s. Please try again.`);
        return;
      }
      setManualInvestmentReturns(response.data as ManualInvestmentReturn[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

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
        <div className="flex flex-1 flex-col gap-2">
          <InvestmentReturnList
            manualInvestmentReturns={manualInvestmentReturns}
            holdingInvestmentReturns={holdingInvestmentReturns}
            onManualInvestmentReturnDeleted={fetchManualInvestmentReturnItems}
            onHoldingInvestmentReturnDeleted={fetchHoldingInvestmentReturnItems}
            onManualInvestmentReturnIsEditing={manualInvestmentReturnFormState.onItemIsEditing}
            onHoldingInvestmentReturnIsEditing={holdingInvestmentReturnFormState.onItemIsEditing}
            isLoading={isLoading}
            isError={messageTypeIsError(message)}
          />
        </div>
      </div>
    </div>
  )
}
