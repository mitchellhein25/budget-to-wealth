'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useFormListItemsFetch } from '@/app/hooks';
import { CASH_FLOW_ENTRIES_ENDPOINT, getCashFlowEntriesByDateRangeAndType, getRecurringCashFlowEntries } from '@/app/lib/api/data-methods';
import { DatePicker, DateRange, TotalDisplay, getCurrentMonthRange, messageTypeIsError } from '@/app/components';
import { CashFlowType, CashFlowEntry, CashFlowSideBar } from '@/app/cashflow/components';
import { CashFlowEntriesForm, CashFlowEntryFormData, convertCashFlowEntryToFormData, transformCashFlowFormDataToEntry } from './form';
import CashFlowEntriesList from './list/CashFlowEntriesList';
import ResponsiveFormListPage from '@/app/components/ui/ResponsiveFormListPage';

export function CashFlowPage({cashFlowType, recurringOnly}: {cashFlowType: CashFlowType, recurringOnly?: boolean}) {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));

  const [items, setItems] = useState<CashFlowEntry[]>([]);
  const fetchCashFlowEntries = useCallback(() => {
    if (recurringOnly) {
      return getRecurringCashFlowEntries(cashFlowType);
    } else {
      return getCashFlowEntriesByDateRangeAndType(dateRange, cashFlowType);
    }
  }, [dateRange, cashFlowType, recurringOnly]);
  const { fetchItems, isPending, message } = useFormListItemsFetch<CashFlowEntry>({
    fetchItems: fetchCashFlowEntries,
    itemName: cashFlowType.toLowerCase(),
    setItems: setItems,
  });convertCashFlowEntryToFormData

  const formState = useForm<CashFlowEntry, CashFlowEntryFormData>(
    {
      itemName: cashFlowType,
      itemEndpoint: CASH_FLOW_ENTRIES_ENDPOINT,
      transformFormDataToItem: (formData: FormData) => transformCashFlowFormDataToEntry(formData, cashFlowType),
      convertItemToFormData: convertCashFlowEntryToFormData,
      fetchItems: fetchItems,
    }
  );

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  const totalAmount = useMemo(() => items.reduce((sum, entry) => sum + entry.amount, 0), [items]);

  return (
    <ResponsiveFormListPage
      showTotalAndDatePicker={!recurringOnly}
      sideBar={<CashFlowSideBar />}
      totalDisplay={
        <TotalDisplay
          label={`Total ${cashFlowType}`}
          amount={totalAmount}
          isLoading={isPending}
        />
      }
      datePicker={
        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      }
      form={
        <CashFlowEntriesForm
          cashFlowType={cashFlowType}
          formState={formState}
        />
      }
      list={
        <CashFlowEntriesList
          cashFlowType={cashFlowType}
          entries={items}
          onEntryDeleted={fetchItems}
          onEntryIsEditing={formState.onItemIsEditing}
          isLoading={isPending}
          isError={messageTypeIsError(message)}
          recurringOnly={recurringOnly}
        />
      }
    />
  );
}
