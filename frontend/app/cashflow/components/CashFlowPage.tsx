'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from '@/app/hooks';
import { CASH_FLOW_ENTRIES_ENDPOINT, getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api/data-methods';
import { DatePicker, DateRange, MESSAGE_TYPE_ERROR, MessageState, TotalDisplay, getCurrentMonthRange, messageTypeIsError } from '@/app/components';
import { CashFlowType, CashFlowEntry, CashFlowSideBar } from '@/app/cashflow/components';
import { CashFlowEntriesForm, CashFlowEntryFormData, transformCashFlowFormDataToEntry } from './form';
import CashFlowEntriesList from './list/CashFlowEntriesList';


export function CashFlowPage({cashFlowType}: {cashFlowType: CashFlowType}) {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [items, setItems] = useState<CashFlowEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

  const fetchCashFlowEntries = useCallback(() => getCashFlowEntriesByDateRangeAndType(dateRange, cashFlowType), [dateRange, cashFlowType]);

  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await fetchCashFlowEntries();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${cashFlowType} entries. Please try again.`);
        return;
      }
      setItems(response.data as CashFlowEntry[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${cashFlowType} entries. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCashFlowEntries, cashFlowType]);

  const transformFormDataToEntry = (formData: FormData) => transformCashFlowFormDataToEntry(formData, cashFlowType);

  const convertCashFlowEntryToFormData = (cashFlowEntry: CashFlowEntry) => {
    return {
      id: cashFlowEntry.id?.toString(),
      amount: (cashFlowEntry.amount / 100).toFixed(2),
      date: new Date(cashFlowEntry.date),
      categoryId: cashFlowEntry.categoryId,
      description: cashFlowEntry.description ?? "",
      recurrenceFrequency: cashFlowEntry.recurrenceFrequency,
      recurrenceEndDate: cashFlowEntry.recurrenceEndDate,
    }
	};

  const formState = useForm<CashFlowEntry, CashFlowEntryFormData>(
    {
      itemName: cashFlowType,
      itemEndpoint: CASH_FLOW_ENTRIES_ENDPOINT,
      transformFormDataToItem: transformFormDataToEntry,
      convertItemToFormData: convertCashFlowEntryToFormData,
      fetchItems: fetchCashFlowEntries,
    }
  );

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  const totalAmount = useMemo(() => items.reduce((sum, entry) => sum + entry.amount, 0), [items]);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <CashFlowSideBar />
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <CashFlowEntriesForm
            cashFlowType={cashFlowType}
            formState={formState}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DatePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
            <div className="flex-1 flex justify-center">
              <TotalDisplay
                label={`Total ${cashFlowType}`}
                amount={totalAmount}
                isLoading={isLoading}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <CashFlowEntriesList
            cashFlowType={cashFlowType}
            entries={items}
            onEntryDeleted={fetchItems}
            onEntryIsEditing={formState.onItemIsEditing}
            isLoading={isLoading}
            isError={messageTypeIsError(message)}
          />
        </div>
      </div>
    </div>
  )
}
