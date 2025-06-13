'use client';

import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import { CashFlowEntryFormData } from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowEntryFormData';
import { cashFlowFormOnChange } from '@/app/ui/components/cashflow/cashflow-helpers/cashFlowFormOnChange';
import CashFlowPage from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowPage';
import { getMonthRange, MessageState } from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowUtils';
import { fetchCashFlowEntries } from '@/app/ui/components/cashflow/cashflow-helpers/fetchCashFlowEntries';
import { handleCashFlowFormSubmit } from '@/app/ui/components/cashflow/cashflow-helpers/handleCashFlowFormSubmit';
import IncomeEntriesForm from '@/app/ui/components/cashflow/income/income-entries/income-entries-form/IncomeEntriesForm'
import CashFlowEntriesList from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowEntriesList';
import DatePicker from '@/app/ui/components/DatePicker';
import React, { useCallback, useEffect, useState } from 'react'
import { DateRange } from "react-day-picker";

export default function Income() {
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));
	const [incomeEntries, setIncomeEntries] = useState<CashFlowEntry[]>([]);
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
		fetchIncomeEntries,
		setEditingFormData,
		CashFlowType.Income
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

	const fetchIncomeEntries = async () => fetchCashFlowEntries(
		CashFlowType.Income,
		setIncomeEntries,
		setIsLoading,
		setMessage,
		setErrorMessage
	);

	const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchIncomeEntries();
	}, []);

	return (
		<CashFlowPage
			formComponent={
				<IncomeEntriesForm
					handleSubmit={handleSubmit}
					editingFormData={editingFormData}
					onChange={(event) => cashFlowFormOnChange(event, setEditingFormData, CashFlowType.Income)}
					onReset={onReset}
					errorMessage={message.type === 'error' ? message.text : ''}
					infoMessage={message.type === 'info' ? message.text : ''}
					isLoading={isLoading}
					isSubmitting={isSubmitting}
				/>
			}
			datePickerComponent={
				<DatePicker
					dateRange={dateRange}
					setDateRange={setDateRange}
				/>
			}
			listComponent={
				<CashFlowEntriesList
					entries={incomeEntries}
					onEntryDeleted={fetchIncomeEntries}
					isLoading={isLoading}
					isError={message.type === 'error'}
					onEntryIsEditing={onEntryIsEditing}
					cashFlowType={CashFlowType.Income}
				/>
			}
		/>
	)
}
