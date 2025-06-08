'use client';

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';
import { putRequest } from '@/app/lib/api/rest-methods/putRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
import IncomeEntriesForm from '@/app/ui/components/cashflow/income/income-entries/income-entries-form/IncomeEntriesForm'
import { z } from 'zod';
import React, { useCallback, useEffect, useState } from 'react'

const numberRegex = /^\d+(\.\d{0,2})?$/;

const incomeEntryFormSchema = z.object({
	id: z.string().uuid().optional(),
	amount: z.string().trim().min(1, { message: "Amount field is required." })
		.refine(
			(val) => {
				const cleaned = val.replace(/[,\s]/g, '');
				return numberRegex.test(cleaned);
			},
			{ message: "Amount must be a valid currency format (e.g., 100.50)" }
		)
		.refine(
			(val) => {
				const cleaned = val.replace(/[,\s]/g, '');
				const parsed = parseFloat(cleaned);
				return parsed > 0;
			},
			{ message: "Amount must be greater than 0" }
		)
		.transform((val) => {
			return val.replace(/[,\s]/g, '');
		}),
	date: z.date({ message: "Date field is required." }),
	categoryId: z.string().trim().min(1, { message: "Category field is required" }),
	description: z.string().trim().optional(),
});

export type IncomeEntryFormData = z.infer<typeof incomeEntryFormSchema>;

type MessageState = {
	type: 'info' | 'error' | null;
	text: string;
};

const convertDollarsToCents = (dollarAmount: string): number | null => {
	const parsed = Number.parseFloat(dollarAmount);
	if (isNaN(parsed))
		return null;
	return Math.round(parsed * 100);
};

export default function Income() {
	const [incomeEntries, setIncomeEntries] = useState<CashFlowEntry[]>([]);
	const [editingFormData, setEditingFormData] = useState<Partial<IncomeEntryFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

	const clearMessage = useCallback(() => {
		setTimeout(() => setMessage({ type: null, text: '' }), 5000);
	}, []);

	const setInfoMessage = useCallback((text: string) => {
		setMessage({ type: 'info', text });
		clearMessage();
	}, [clearMessage]);

	const setErrorMessage = useCallback((text: string) => {
		setMessage({ type: 'error', text });
		clearMessage();
	}, [clearMessage]);

	const getValidationResult = (formData: FormData) => {
		const rawData = {
			id: formData.get("income-id") as string || undefined,
			amount: formData.get("income-amount") as string,
			date: new Date(formData.get("income-date") as string),
			categoryId: formData.get("income-category") as string,
			description: formData.get("income-description") as string || "",
		};

		return incomeEntryFormSchema.safeParse(rawData);
	}

	const transformFormDataToEntry = (formData: FormData): { entry: CashFlowEntry | null; errors: string[] } => {
		try {
			const validationResult = getValidationResult(formData);
			if (!validationResult.success) {
				const errors = validationResult.error.errors.map(err => err.message);
				return { entry: null, errors: [errors[0]] };
			}

			const validatedData = validationResult.data;
			const amountInCents = convertDollarsToCents(validatedData.amount);

			if (amountInCents === null) {
				return { entry: null, errors: ["Invalid amount format"] };
			}

			const entry: CashFlowEntry = {
				amount: amountInCents,
				date: validatedData.date.toDateString(),
				categoryId: "",
				description: validatedData.description || "",
				entryType: CashFlowType.Income
			};
			
			return { entry, errors: [] };
		} catch (error) {
			return { entry: null, errors: ["An unexpected validation error occurred"] };
		}
	};

	const handleSubmit = useCallback(async (formData: FormData) => {
		try {
			setIsSubmitting(true);
			setMessage({ type: null, text: '' });

			const { entry: cashFlowEntry, errors } = transformFormDataToEntry(formData);
			if (!cashFlowEntry || errors.length > 0) {
				setErrorMessage(errors.join(', '));
				return;
			}

			const idValue = formData.get("income-id") as string;
			const isEditing = Boolean(idValue);

			const response = isEditing
				? await putRequest<CashFlowEntry>("CashFlowEntries", idValue, cashFlowEntry)
				: await postRequest<CashFlowEntry>("CashFlowEntries", cashFlowEntry);

			if (!response.successful) {
				const action = isEditing ? "update" : "create";
				setErrorMessage(`Failed to ${action} income entry: ${response.responseMessage}`);
				return;
			}

			await fetchIncomeEntries();
			setEditingFormData({});
			const action = isEditing ? "updated" : "created";
			setInfoMessage(`Income entry ${action} successfully.`);

		} catch (error) {
			setErrorMessage("An unexpected error occurred. Please try again.");
			console.error("Submit error:", error);
		} finally {
			setIsSubmitting(false);
		}
	}, []);

	const onEntryIsEditing = useCallback((formData: IncomeEntryFormData) => {
		setEditingFormData(formData);
		setMessage({ type: null, text: '' });
	}, []);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = event.target;
		const fieldName = name.replace("income-", "");
		if (fieldName === "amount")
		{
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
		<div className="flex gap-6 p-6">
			<CashflowSideBar />
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
	)
}
