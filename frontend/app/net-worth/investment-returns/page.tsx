'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { useForm, useFormListItemsFetch } from '@/app/hooks';
import { getHoldingInvestmentReturnsByDateRange, getManualInvestmentReturnsByDateRange, HOLDING_INVESTMENT_RETURNS_ENDPOINT, MANUAL_INVESTMENT_RETURNS_ENDPOINT } from '@/app/lib/api';
import { getFullMonthRange, messageTypeIsError } from '@/app/lib/utils';
import { DatePicker, DateRange, ResponsiveFormListPage } from '@/app/components';
import { NetWorthSideBar } from '@/app/net-worth';
import { InvestmentReturnList, ManualInvestmentReturn, HoldingInvestmentReturn, InvestmentReturnForm, HoldingInvestmentReturnFormData, transformFormDataToHoldingInvestmentReturn, convertManualInvestmentReturnItemToFormData, ManualInvestmentReturnFormData, transformFormDataToManualInvestmentReturn, HOLDING_INVESTMENT_RETURN_ITEM_NAME, HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE, MANUAL_INVESTMENT_RETURN_ITEM_NAME, MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE, convertHoldingInvestmentReturnItemToFormData } from '@/app/net-worth/investment-returns';

export default function InvestmentReturnsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getFullMonthRange(new Date()));
  const [isManualActive, setIsManualActive] = useState<boolean>(false);

  const fetchManualInvestmentReturnItemsFunction = useCallback(() => getManualInvestmentReturnsByDateRange(dateRange), [dateRange]);
  const { fetchItems: fetchManualInvestmentReturnItems, isPending: isPendingManualInvestmentReturns, message: messageManualInvestmentReturns, items: manualInvestmentReturnItems } = useFormListItemsFetch<ManualInvestmentReturn>({
    fetchItems: fetchManualInvestmentReturnItemsFunction,
    itemName: MANUAL_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE,
  });
  const manualInvestmentReturnFormState = useForm<ManualInvestmentReturn, ManualInvestmentReturnFormData>({
    itemName: MANUAL_INVESTMENT_RETURN_ITEM_NAME,
    itemEndpoint: MANUAL_INVESTMENT_RETURNS_ENDPOINT,
    transformFormDataToItem: transformFormDataToManualInvestmentReturn,
    convertItemToFormData: convertManualInvestmentReturnItemToFormData,
    fetchItems: fetchManualInvestmentReturnItems,
  });

  const fetchHoldingInvestmentReturnItemsFunction = useCallback(() => getHoldingInvestmentReturnsByDateRange(dateRange), [dateRange]);
  const { fetchItems: fetchHoldingInvestmentReturnItems, isPending: isPendingHoldingInvestmentReturns, message: messageHoldingInvestmentReturns, items: holdingInvestmentReturns } = useFormListItemsFetch<HoldingInvestmentReturn>({
    fetchItems: fetchHoldingInvestmentReturnItemsFunction,
    itemName: HOLDING_INVESTMENT_RETURN_ITEM_NAME_LOWERCASE,
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
          manualInvestmentReturns={manualInvestmentReturnItems}
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
