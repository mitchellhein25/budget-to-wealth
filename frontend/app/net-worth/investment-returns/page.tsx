'use client';

import React, { useCallback, useState } from 'react'
import { NetWorthSideBar } from '../holding-snapshots/components/NetWorthSideBar';
import { useForm, useFormListItemsFetch } from '@/app/hooks';
import { getHoldingInvestmentReturnsByDateRange, getManualInvestmentReturnsByDateRange, HOLDING_INVESTMENT_RETURNS_ENDPOINT, MANUAL_INVESTMENT_RETURNS_ENDPOINT } from '@/app/lib/api/data-methods';
import { convertManualInvestmentReturnItemToFormData, ManualInvestmentReturnFormData, transformFormDataToManualInvestmentReturn } from './components/form/manual-investment-return-form';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE, MANUAL_INVESTMENT_RETURN_ITEM_NAME, MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE } from './components/form';
import { InvestmentReturnForm } from './components/form/InvestmentReturnForm';
import { HoldingInvestmentReturnFormData, transformFormDataToHoldingInvestmentReturn } from './components/form/holding-investment-return-form';
import { ManualInvestmentReturn } from './components/ManualInvestmentReturn';
import { HoldingInvestmentReturn } from './components/HoldingInvestmentReturn';
import { InvestmentReturnList } from './components/list/InvestmentReturnList';
import { DatePicker, DateRange, getCurrentMonthRange, messageTypeIsError } from '@/app/components';
import ResponsiveFormListPage from '@/app/components/ui/ResponsiveFormListPage';
import { convertHoldingInvestmentReturnItemToFormData } from './components/form/holding-investment-return-form/functions';

export default function InvestmentReturnsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [isManualActive, setIsManualActive] = useState<boolean>(false);

  const [manualInvestmentReturns, setManualInvestmentReturns] = useState<ManualInvestmentReturn[]>([]);
  const fetchManualInvestmentReturnItemsFunction = useCallback(() => getManualInvestmentReturnsByDateRange(dateRange), [dateRange]);
  const { fetchItems: fetchManualInvestmentReturnItems, isPending: isPendingManualInvestmentReturns, message: messageManualInvestmentReturns } = useFormListItemsFetch<ManualInvestmentReturn>({
    fetchItems: fetchManualInvestmentReturnItemsFunction,
    itemName: MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE,
    setItems: setManualInvestmentReturns,
  });
  const manualInvestmentReturnFormState = useForm<ManualInvestmentReturn, ManualInvestmentReturnFormData>({
    itemName: MANUAL_INVESTMENT_RETURN_ITEM_NAME,
    itemEndpoint: MANUAL_INVESTMENT_RETURNS_ENDPOINT,
    transformFormDataToItem: transformFormDataToManualInvestmentReturn,
    convertItemToFormData: convertManualInvestmentReturnItemToFormData,
    fetchItems: fetchManualInvestmentReturnItems,
  });

  const [holdingInvestmentReturns, setHoldingInvestmentReturns] = useState<HoldingInvestmentReturn[]>([]);
  const fetchHoldingInvestmentReturnItemsFunction = useCallback(() => getHoldingInvestmentReturnsByDateRange(dateRange), [dateRange]);
  const { fetchItems: fetchHoldingInvestmentReturnItems, isPending: isPendingHoldingInvestmentReturns, message: messageHoldingInvestmentReturns } = useFormListItemsFetch<HoldingInvestmentReturn>({
    fetchItems: fetchHoldingInvestmentReturnItemsFunction,
    itemName: HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE,
    setItems: setHoldingInvestmentReturns,
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

    return (
      <ResponsiveFormListPage
        sideBar={<NetWorthSideBar />}
        totalDisplay={<div className="w-full"></div>}
        datePicker={
          <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        }
        form={
          <InvestmentReturnForm 
            isManualActive={isManualActive}
            setIsManualActive={setIsManualActive}
            manualInvestmentReturnFormState={manualInvestmentReturnFormState} 
            holdingInvestmentReturnFormState={holdingInvestmentReturnFormState} 
          />
        }
        list={
          <InvestmentReturnList
            manualInvestmentReturns={manualInvestmentReturns}
            holdingInvestmentReturns={holdingInvestmentReturns}
            onManualInvestmentReturnDeleted={fetchManualInvestmentReturnItems}
            onHoldingInvestmentReturnDeleted={fetchHoldingInvestmentReturnItems}
            onManualInvestmentReturnIsEditing={onManualInvestmentReturnIsEditing}
            onHoldingInvestmentReturnIsEditing={onHoldingInvestmentReturnIsEditing}
            isLoading={isPendingManualInvestmentReturns || isPendingHoldingInvestmentReturns}
            isError={messageTypeIsError(messageManualInvestmentReturns) || messageTypeIsError(messageHoldingInvestmentReturns)}
          />
        }
      />
    );
}
