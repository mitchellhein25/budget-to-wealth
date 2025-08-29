'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useMobileDetection } from '@/app/hooks';
import { CASH_FLOW_ENTRIES_ENDPOINT, getCashFlowEntriesByDateRangeAndType, getRecurringCashFlowEntries } from '@/app/lib/api/data-methods';
import { DatePicker, DateRange, MESSAGE_TYPE_ERROR, MessageState, TotalDisplay, getCurrentMonthRange, messageTypeIsError } from '@/app/components';
import { CashFlowType, CashFlowEntry, CashFlowSideBar } from '@/app/cashflow/components';
import { CashFlowEntriesForm, CashFlowEntryFormData, transformCashFlowFormDataToEntry } from './form';
import CashFlowEntriesList from './list/CashFlowEntriesList';

export function CashFlowPage({cashFlowType, recurringOnly}: {cashFlowType: CashFlowType, recurringOnly?: boolean}) {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [items, setItems] = useState<CashFlowEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const isMobile = useMobileDetection();

  const fetchCashFlowEntries = useCallback(() => {
    if (recurringOnly) {
      return getRecurringCashFlowEntries(cashFlowType);
    } else {
      return getCashFlowEntriesByDateRangeAndType(dateRange, cashFlowType);
    }
  }, [dateRange, cashFlowType, recurringOnly]);

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
      fetchItems: fetchItems,
    }
  );

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  const totalAmount = useMemo(() => items.reduce((sum, entry) => sum + entry.amount, 0), [items]);
  
  return (
    <div className="page-layout">
      {!isMobile && <CashFlowSideBar />}
      <div className="flex flex-1 gap-3 sm:gap-6">
        {isMobile ? (
          <div className="flex-1 flex flex-col gap-3 sm:gap-6">
            <div className="w-full">
              <CashFlowEntriesForm
                cashFlowType={cashFlowType}
                formState={formState}
              />
            </div>
            
            {!recurringOnly && <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full">
                <DatePicker
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </div>
              <div className="flex justify-center">
                <TotalDisplay
                  label={`Total ${cashFlowType}`}
                  amount={totalAmount}
                  isLoading={isLoading}
                />
              </div>
            </div>}
            
            <div className="flex-1">
              <CashFlowEntriesList
                cashFlowType={cashFlowType}
                entries={items}
                onEntryDeleted={fetchItems}
                onEntryIsEditing={formState.onItemIsEditing}
                isLoading={isLoading}
                isError={messageTypeIsError(message)}
                recurringOnly={recurringOnly}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0">
              <CashFlowEntriesForm
                cashFlowType={cashFlowType}
                formState={formState}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:gap-4">
              {!recurringOnly && <div className="flex items-center justify-between">
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
              </div>}
              <CashFlowEntriesList
                cashFlowType={cashFlowType}
                entries={items}
                onEntryDeleted={fetchItems}
                onEntryIsEditing={formState.onItemIsEditing}
                isLoading={isLoading}
                isError={messageTypeIsError(message)}
                recurringOnly={recurringOnly}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
