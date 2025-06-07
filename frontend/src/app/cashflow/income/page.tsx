'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';
import { putRequest } from '@/app/lib/api/rest-methods/putRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
import IncomeEntriesForm from '@/app/ui/components/cashflow/income/income-entries/income-entries-form/IncomeEntriesForm'
import React, { useEffect, useState } from 'react'

export type IncomeEntryFormData = {
	id?: string;
	amount: string;
	date: string;
	categoryId: string;
	description: string;
}

export default function Income() {
	const [incomeEntries, setIncomeEntries] = useState<CashFlowEntry[]>([]);
	const [editingFormData, setEditingFormData] = useState<IncomeEntryFormData>({} as IncomeEntryFormData);;
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [infoMessage, setInfoMessage] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	
	async function handleSubmit(formData: FormData) {
			const amount : string = formData.get("income-amount") as string;
			const amountInCents: number = Number.parseInt((Number.parseFloat(amount) * 100).toString());
			const cashFlowEntry: CashFlowEntry = {  
				amount: amountInCents, 
				date: formData.get("income-date") as string,
				categoryId: formData.get("income-category") as string,
				description: formData.get("income-description") as string,
				entryType: CashFlowType.Income
			};
			
			let response = null
			const idValue = formData.get("income-id");
			if (idValue)
				response = await putRequest<CashFlowEntry>("CashFlowEntries", idValue as string, cashFlowEntry);
			else
				response = await postRequest<CashFlowEntry>("CashFlowEntries", cashFlowEntry);
			const actionVerb: string = !idValue ? "create" : "update";
			if (!response.successful)
				setErrorMessage(`Failed to ${actionVerb} income entry: "` + response.responseMessage);
			else {
				fetchIncomeEntries();
				setEditingFormData({} as IncomeEntryFormData);
				setInfoMessage(`Income entry ${actionVerb}d successfully.`);
			}
		}
	
		function onEntryIsEditing(formData: IncomeEntryFormData){
			setEditingFormData(formData);
		}

		function onChange(event: React.ChangeEvent<HTMLInputElement>) {
			const { name, value } = event.target;
			setEditingFormData((prev) => ({ ...prev, [name.replace("income-", "")]: value }));
		}

		async function fetchIncomeEntries() {
			setInfoMessage("");
			setErrorMessage("");
			setIsLoading(true);
			const response = await getRequest<CashFlowEntry>("CashFlowEntries?entryType=Income");
			setIncomeEntries(response.data as CashFlowEntry[]);
			if (!response.successful) {
				setIsError(true);
			}
			setIsLoading(false);
		}
	
		function onReset() {
			setEditingFormData({} as IncomeEntryFormData);
			setInfoMessage("");
			setErrorMessage("");
		}
	
		useEffect(() => {
			fetchIncomeEntries();
		}, []);

	return (
		<div className="flex gap-6 p-6">
			<CashflowSideBar />
			<IncomeEntriesForm
				handleSubmit={handleSubmit}
				editingFormData={editingFormData}
				onChange={onChange}
				onReset={onReset}
				errorMessage={errorMessage}
				infoMessage={infoMessage}
			/>
		</div>
	)
}
