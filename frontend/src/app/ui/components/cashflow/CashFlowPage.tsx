'use client';

import React, { useEffect, useState } from 'react'
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';
import { formatDate, getMonthRange } from '../Utils';
import { DateRange } from 'react-day-picker';
import CashFlowEntriesList from './entries/list/CashFlowEntriesList';
import DatePicker from '../DatePicker';
import CashFlowEntriesForm from './entries/form/CashFlowEntriesForm';
import { cashFlowFormOnChange } from './entries/form/functions/cashFlowFormOnChange';
import { CashFlowEntryFormData } from './entries/form/CashFlowEntryFormData';
import { useList } from '../../hooks/useFormList';
import { handleFormSubmit } from '../form/functions/handleFormSubmit';
import { transformFormDataToEntry } from './entries/form/functions/transformFormDataToEntry';
import CashFlowSideBar from './entries/CashFlowSideBar';

type CashFlowPageProps = {
  cashFlowType: CashFlowType;
}

export default function CashFlowPage(props: CashFlowPageProps) {
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));

	const fetchEndpoint = `CashFlowEntries?entryType=${props.cashFlowType}&startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`;
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
        <div className="flex flex-1 flex-col gap-2">
          <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
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
