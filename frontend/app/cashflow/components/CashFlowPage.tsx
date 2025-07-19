'use client';

import React, { useEffect, useState } from 'react'
import { CashFlowType } from '@/app/cashflow/components/CashFlowType';
import { CashFlowEntry } from '@/app/cashflow/components/CashFlowEntry';
import { convertDateToISOString, getCurrentMonthRange } from '../../components/Utils';
import { DateRange } from '../../components/DatePicker';
import CashFlowEntriesList from './list/CashFlowEntriesList';
import DatePicker from '../../components/DatePicker';
import CashFlowEntriesForm from './form/CashFlowEntriesForm';
import { cashFlowFormOnChange } from './form/functions/cashFlowFormOnChange';
import { CashFlowEntryFormData } from './form/CashFlowEntryFormData';
import { useList } from '../../hooks/useDataListFetcher';
import { handleFormSubmit } from '../../components/form/functions/handleFormSubmit';
import { transformFormDataToEntry } from './form/functions/transformFormDataToEntry';
import CashFlowSideBar from './CashFlowSideBar';
import TotalDisplay from '../../components/TotalDisplay';

type CashFlowPageProps = {
  cashFlowType: CashFlowType;
}

export default function CashFlowPage(props: CashFlowPageProps) {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));

	const fetchEndpoint = `CashFlowEntries?entryType=${props.cashFlowType}&startDate=${convertDateToISOString(dateRange.from)}&endDate=${convertDateToISOString(dateRange.to)}`;
	const { items, isLoading, message, fetchItems, setMessage, setInfoMessage, setErrorMessage } = useList<CashFlowEntry>(fetchEndpoint, `${props.cashFlowType} entries`);

	const [editingFormData, setEditingFormData] = useState<Partial<CashFlowEntryFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (formData: FormData) => 
		handleFormSubmit<CashFlowEntry | null, CashFlowEntryFormData>(
			formData,
			(formData) => transformFormDataToEntry(formData, props.cashFlowType),
			setIsSubmitting,
			setMessage,
			setErrorMessage,
			setInfoMessage,
			fetchItems,
			setEditingFormData,
			props.cashFlowType,
			"CashFlowEntries"
	);

	const onEntryIsEditing = (cashFlowEntry: CashFlowEntry) => {
		setEditingFormData({
			id: cashFlowEntry.id?.toString(),
			amount: (cashFlowEntry.amount / 100).toFixed(2),
			date: new Date(cashFlowEntry.date),
			categoryId: cashFlowEntry.categoryId,
			description: cashFlowEntry.description ?? "",
			recurrenceFrequency: cashFlowEntry.recurrenceFrequency,
			recurrenceEndDate: cashFlowEntry.recurrenceEndDate,
		});
		setMessage({ type: null, text: '' });
	};

	const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
  
  const total = items.reduce((sum, entry) => sum + entry.amount, 0);
	const totalLabel = props.cashFlowType === CashFlowType.Income ? 'Total Income' : 'Total Expenses';
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <CashFlowSideBar />
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <CashFlowEntriesForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={(event) => cashFlowFormOnChange(event, setEditingFormData, props.cashFlowType)}
            onReset={onReset}
            errorMessage={message.type === 'form-error' ? message.text : ''}
            infoMessage={message.type === 'form-info' ? message.text : ''}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            cashFlowType={props.cashFlowType}
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
                label={totalLabel}
                amount={total}
                isLoading={isLoading}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <CashFlowEntriesList
            entries={items}
            onEntryDeleted={fetchItems}
            isLoading={isLoading}
            isError={message.type === 'list-error'}
            onEntryIsEditing={onEntryIsEditing}
            cashFlowType={props.cashFlowType}
          />
        </div>
      </div>
    </div>
  )
}
