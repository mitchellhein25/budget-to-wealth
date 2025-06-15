'use client';

import React, { useCallback, useEffect, useState } from 'react'
import CashflowSideBar from './CashflowSideBar'
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';
import { handleCashFlowFormSubmit } from './entries/form/functions/handleCashFlowFormSubmit';
import { getMonthRange, MessageState } from './CashFlowUtils';
import { DateRange } from 'react-day-picker';
import CashFlowEntriesList from './entries/list/CashFlowEntriesList';
import DatePicker from '../DatePicker';
import CashFlowEntriesForm from './entries/form/CashFlowEntriesForm';
import { cashFlowFormOnChange } from './entries/form/functions/cashFlowFormOnChange';
import { CashFlowEntryFormData } from './entries/form/functions/CashFlowEntryFormData';
import { fetchCashFlowEntries } from './entries/list/fetchCashFlowEntries';

type CashFlowPageProps = {
  cashFlowType: CashFlowType;
}

export default function CashFlowPage(props: CashFlowPageProps) {
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));
	const [cashFlowEntries, setCashFlowEntries] = useState<CashFlowEntry[]>([]);
	const [editingFormData, setEditingFormData] = useState<Partial<CashFlowEntryFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

	const clearMessage = useCallback(() => {
		setTimeout(() => setMessage({ type: null, text: '' }), 1000 * 10);
	}, []);

	const setInfoMessage = useCallback((text: string) => {
		setMessage({ type: 'info', text });
		clearMessage();
	}, [clearMessage]);

	const setErrorMessage = useCallback((text: string) => {
		setMessage({ type: 'error', text });
		clearMessage();
	}, [clearMessage]);

	const handleSubmit = (formData: FormData) => handleCashFlowFormSubmit(
		formData,
		setIsSubmitting,
		setMessage,
		setErrorMessage,
		setInfoMessage,
		fetchEntries,
		setEditingFormData,
		props.cashFlowType
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

	const fetchEntries = async () => fetchCashFlowEntries(
		props.cashFlowType,
		setCashFlowEntries,
		setIsLoading,
		setMessage,
		setErrorMessage
	);

	const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchEntries();
	}, []);
  
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <CashflowSideBar />
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <CashFlowEntriesForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={(event) => cashFlowFormOnChange(event, setEditingFormData, props.cashFlowType)}
            onReset={onReset}
            errorMessage={message.type === 'error' ? message.text : ''}
            infoMessage={message.type === 'info' ? message.text : ''}
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
            entries={cashFlowEntries}
            onEntryDeleted={fetchEntries}
            isLoading={isLoading}
            isError={message.type === 'error'}
            onEntryIsEditing={onEntryIsEditing}
            cashFlowType={props.cashFlowType}
          />
        </div>
      </div>
    </div>
  )
}
