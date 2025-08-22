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
import { DatePicker, DateRange, getCurrentMonthRange, ListTableItem, MESSAGE_TYPE_ERROR, MessageState, messageTypeIsError } from '@/app/components';
import { FetchResult } from '@/app/lib/api/apiClient';

export default function InvestmentReturnsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [manualInvestmentReturns, setManualInvestmentReturns] = useState<ManualInvestmentReturn[]>([]);
  const [holdingInvestmentReturns, setHoldingInvestmentReturns] = useState<HoldingInvestmentReturn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const [isManualActive, setIsManualActive] = useState<boolean>(false);
  const isMobile = useMobileDetection();

  const fetchReturnItems = async <T extends ListTableItem>(
    fetchItems: (dateRange: DateRange) => Promise<FetchResult<T[]>>, 
    setItems: (items: T[]) => void, 
    itemName: string
  ) => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
    const response = await fetchItems(dateRange);
    if (!response.successful) {
      setErrorMessage(`Failed to load ${itemName}s. Please try again.`);
        return;
      }
      setItems(response.data as T[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${itemName}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHoldingInvestmentReturnItems = useCallback(() => fetchReturnItems(
    getHoldingInvestmentReturnsByDateRange, 
    setHoldingInvestmentReturns, 
    HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE), [dateRange]);

    
  const fetchManualInvestmentReturnItems = useCallback(() => fetchReturnItems(
    getManualInvestmentReturnsByDateRange, 
    setManualInvestmentReturns, 
    MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE), [dateRange]);
    
  const convertManualInvestmentReturnItemToFormData = (item: ManualInvestmentReturn) : ManualInvestmentReturnFormData => ({
      id: item.id?.toString(),
      manualInvestmentCategoryId: item.manualInvestmentCategoryId,
      manualInvestmentReturnDate: new Date(item.manualInvestmentReturnDate),
      manualInvestmentPercentageReturn: item.manualInvestmentPercentageReturn.toString(),
      manualInvestmentRecurrenceFrequency: item.manualInvestmentRecurrenceFrequency,
      manualInvestmentRecurrenceEndDate: item.manualInvestmentRecurrenceEndDate,
    });

  const convertHoldingInvestmentReturnItemToFormData = (item: HoldingInvestmentReturn) : HoldingInvestmentReturnFormData => ({
    id: item.id?.toString(),
    startHoldingSnapshotDate: new Date(item.startHoldingSnapshot?.date ?? ''),
    startHoldingSnapshotId: item.startHoldingSnapshotId,
    endHoldingSnapshotId: item.endHoldingSnapshotId,
    endHoldingSnapshotHoldingId: item.endHoldingSnapshot?.holdingId ?? '',
    endHoldingSnapshotDate: new Date(item.endHoldingSnapshot?.date ?? ''),
    endHoldingSnapshotBalance: (item.endHoldingSnapshot?.balance ?? 0 / 100).toFixed(2),
    totalContributions: (item.totalContributions / 100).toFixed(2),
    totalWithdrawals: (item.totalWithdrawals / 100).toFixed(2),
  });

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

  const onManualInvestmentReturnIsEditing = (investmentReturn: ManualInvestmentReturn) => {
    setIsManualActive(true);
    manualInvestmentReturnFormState.onItemIsEditing(investmentReturn);
  };

  const onHoldingInvestmentReturnIsEditing = (investmentReturn: HoldingInvestmentReturn) => {
    setIsManualActive(false);
    holdingInvestmentReturnFormState.onItemIsEditing(investmentReturn);
  };

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
          <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <InvestmentReturnList
            manualInvestmentReturns={manualInvestmentReturns}
            holdingInvestmentReturns={holdingInvestmentReturns}
            onManualInvestmentReturnDeleted={fetchManualInvestmentReturnItems}
            onHoldingInvestmentReturnDeleted={fetchHoldingInvestmentReturnItems}
            onManualInvestmentReturnIsEditing={onManualInvestmentReturnIsEditing}
            onHoldingInvestmentReturnIsEditing={onHoldingInvestmentReturnIsEditing}
            isLoading={isLoading}
            isError={messageTypeIsError(message)}
          />
        </div>
      </div>
    </div>
  )
}
