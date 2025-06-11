'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import { CashFlowEntryFormData } from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowEntryFormData';
import { getMonthRange, MessageState, numberRegex } from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowUtils';
import { handleCashFlowFormSubmit } from '@/app/ui/components/cashflow/cashflow-helpers/handleCashFlowFormSubmit';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
import IncomeEntriesForm from '@/app/ui/components/cashflow/income/income-entries/income-entries-form/IncomeEntriesForm'
import IncomeEntriesList from '@/app/ui/components/cashflow/income/income-entries/IncomeEntriesList';
import React, { useCallback, useEffect, useState } from 'react'
import { DateRange, DayPicker } from "react-day-picker";

export default function Income() {
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));
	const [incomeEntries, setIncomeEntries] = useState<CashFlowEntry[]>([]);
	const [editingFormData, setEditingFormData] = useState<Partial<CashFlowEntryFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

	const clearMessage = useCallback(() => {
		// setTimeout(() => setMessage({ type: null, text: '' }), 5000);
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

	const onEntryIsEditing = useCallback((cashFlowEntry: CashFlowEntry) => {
		setEditingFormData({
			id: cashFlowEntry.id?.toString(),
			amount: (cashFlowEntry.amount / 100).toFixed(2),
			date: new Date(cashFlowEntry.date),
			categoryId: cashFlowEntry.categoryId,
			description: cashFlowEntry.description ?? "",
		});
		setMessage({ type: null, text: '' });
	}, []);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = event.target;
		const fieldName = name.replace("income-", "");
		if (fieldName === "amount") {
			value = value.replace(/[^\d.]/g, '');

			const decimalCount = (value.match(/\./g) || []).length;
			if (decimalCount > 1) {
				return;
			}

			const decimalIndex = value.indexOf('.');
			if (decimalIndex !== -1 && value.length - decimalIndex > 3) {
				value = value.substring(0, decimalIndex + 3);
			}

			if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
				value = value.substring(1);
			}

			if (value !== '' && !numberRegex.test(value)) {
				return;
			}
		}
		setEditingFormData((prev) => ({ ...prev, [fieldName]: value }));
	}, []);

	const fetchIncomeEntries = useCallback(async () => {
		try {
			setIsLoading(true);
			setMessage({ type: null, text: '' });

			const response = await getRequest<CashFlowEntry>("CashFlowEntries?entryType=Income");

			if (!response.successful) {
				setErrorMessage("Failed to load income entries. Please try again.");
				return;
			}

			setIncomeEntries(response.data as CashFlowEntry[]);
		} catch (error) {
			setErrorMessage("An error occurred while loading income entries.");
			console.error("Fetch error:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const onReset = useCallback(() => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	}, []);

	useEffect(() => {
		fetchIncomeEntries();
	}, []);

	return (
		<div className="flex gap-6 p-6 h-full min-h-screen">
			<CashflowSideBar />
			<div className="flex flex-1 gap-6">
				<div className="flex-shrink-0">
					<IncomeEntriesForm
						handleSubmit={handleSubmit}
						editingFormData={editingFormData}
						onChange={onChange}
						onReset={onReset}
						errorMessage={message.type === 'error' ? message.text : ''}
						infoMessage={message.type === 'info' ? message.text : ''}
						isLoading={isLoading}
						isSubmitting={isSubmitting}
					/>
				</div>
				<div className="flex flex-1 flex-col gap-2">
					<div className="flex flex-col items-center space-y-2">
						<label className="text-lg text-center">
							Select Date Range
						</label>
						<button popoverTarget="rdp-popover" className="input input-border flex justify-center w-fit">
							{`${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`}
						</button>
						<div popover="auto" id="rdp-popover" className="dropdown flex justify-center">
							<DayPicker
								className="react-day-picker"
								mode="range"
								selected={dateRange}
								onSelect={setDateRange}
								required={true}
								classNames={{
									today: 'text-primary',
									selected: '',
								}}
							/>
						</div>
					</div>
					<IncomeEntriesList
						entries={incomeEntries}
						onEntryDeleted={fetchIncomeEntries}
						isLoading={isLoading}
						isError={message.type === 'error'}
						onEntryIsEditing={onEntryIsEditing}
					/>
				</div>
			</div>
		</div>
	)
}
