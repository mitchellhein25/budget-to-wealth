'use client'

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';
import { putRequest } from '@/app/lib/api/rest-methods/putRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import IncomeCategoriesForm from '@/app/ui/components/cashflow/income/income-categories/income-categories-form/IncomeCategoriesForm';
import IncomeCategoriesList from '@/app/ui/components/cashflow/income/income-categories/IncomeCategoriesList';
import React, { useEffect, useState } from 'react'

export default function IncomeCategories() {
  const [incomeCategories, setIncomeCategories] = useState<CashFlowCategory[]>([]);
	const [editingIncomeCategory, setEditingIncomeCategory] = useState<CashFlowCategory | null>(null);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [infoMessage, setInfoMessage] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function handleSubmit(formData: FormData) {
		const nameValue = formData.get("Name") as string;
		const cashFlowEntry: CashFlowCategory = { name: nameValue, categoryType: CashFlowType.Income };
		let response = null
		const idValue = formData.get("Id");
		if (idValue)
			response = await putRequest<CashFlowCategory>("CashFlowCategories", idValue as string, cashFlowEntry);
		else
			response = await postRequest<CashFlowCategory>("CashFlowCategories", cashFlowEntry);
		const actionVerb: string = !idValue ? "create" : "update";
		if (!response.successful)
			setErrorMessage(`Failed to ${actionVerb} income category: "` + response.responseMessage);
		else {
			fetchIncomeCategories();
			setEditingIncomeCategory(null)
			setInfoMessage(`Income category ${actionVerb}d successfully.`);
		}
	}

	function onCategoryIsEditing(category: CashFlowCategory){
		setEditingIncomeCategory(category);
	}

	async function fetchIncomeCategories() {
		setInfoMessage("");
		setErrorMessage("");
		setIsLoading(true);
		const response = await getRequest<CashFlowCategory>("CashFlowCategories?cashFlowType=Income");
		setIncomeCategories(response.data as CashFlowCategory[]);
		if (!response.successful) {
			setIsError(true);
		}
		setIsLoading(false);
	}

	function onReset() {
		setEditingIncomeCategory(null)
		setInfoMessage("");
		setErrorMessage("");
	}

	useEffect(() => {
		fetchIncomeCategories();
	}, []);

	// if (!isLoggedIn)
	// 	return <></>;

	return (
		<div className="flex gap-6 p-6">
			<IncomeCategoriesForm
				handleSubmit={handleSubmit}
				editingIncomeCategory={editingIncomeCategory}
				onNameChange={(name: string) => setEditingIncomeCategory(prev => prev ? { ...prev, name } : { name, categoryType: CashFlowType.Income })}
				onReset={onReset}
				errorMessage={errorMessage}
				infoMessage={infoMessage}
			/>
			<IncomeCategoriesList
				categories={incomeCategories}
				onCategoryDeleted={fetchIncomeCategories}
				isLoading={isLoading}
				isError={isError}
				onCategoryIsEditing={onCategoryIsEditing}
			/>
		</div>
	)
}
