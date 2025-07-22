'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CashFlowType } from '@/app/cashflow/components/CashFlowType';
import { CashFlowEntry } from '@/app/cashflow/components/CashFlowEntry';
import { getCurrentMonthRange, messageTypeIsError } from '../../components/Utils';
import { DateRange } from '../../components/DatePicker';
import CashFlowEntriesList from './list/CashFlowEntriesList';
import { DatePicker } from '@/app/components';
import CashFlowEntriesForm from './form/CashFlowEntriesForm';
import { CashFlowEntryFormData } from './form/CashFlowEntryFormData';
import { useDataListFetcher } from '../../hooks/useDataListFetcher';
import { transformCashFlowFormDataToEntry } from './form/functions/transformFormDataToEntry';
import { CashFlowSideBar } from './CashFlowSideBar';
import TotalDisplay from '../../components/TotalDisplay';
import { getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api/data-methods/cashFlowEntryRequests';
import { useForm } from '@/app/hooks';
import { CASH_FLOW_ENTRIES_ENDPOINT } from '@/app/lib/api/data-methods/endpoints';


export function CashFlowPage({cashFlowType}: {cashFlowType: CashFlowType}) {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const fetchCashFlowEntries = useCallback(() => getCashFlowEntriesByDateRangeAndType(dateRange, cashFlowType), [dateRange, cashFlowType]);
  const cashFlowEntriesDataListFetchState = useDataListFetcher<CashFlowEntry>(fetchCashFlowEntries, `${cashFlowType} entries`);

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
      fetchItems: () => cashFlowEntriesDataListFetchState.fetchItems(),
    }
  );

	useEffect(() => {
		cashFlowEntriesDataListFetchState.fetchItems();
	}, [dateRange]);
  
  const totalAmount = useMemo(() => cashFlowEntriesDataListFetchState.items.reduce((sum, entry) => sum + entry.amount, 0), [cashFlowEntriesDataListFetchState.items]);
  
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
                isLoading={cashFlowEntriesDataListFetchState.isLoading}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <CashFlowEntriesList
            cashFlowType={cashFlowType}
            entries={cashFlowEntriesDataListFetchState.items}
            onEntryDeleted={cashFlowEntriesDataListFetchState.fetchItems}
            onEntryIsEditing={formState.onItemIsEditing}
            isLoading={cashFlowEntriesDataListFetchState.isLoading}
            isError={messageTypeIsError(cashFlowEntriesDataListFetchState.message)}
          />
        </div>
      </div>
    </div>
  )
}
