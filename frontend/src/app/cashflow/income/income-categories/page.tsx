'use client'

import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';
import { putRequest } from '@/app/lib/api/rest-methods/putRequest';
import { CashFlowCategory } from '@/app/lib/models/CashFlow/CashFlowCategory';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import CashFlowCategoriesList from '@/app/ui/components/cashflow/cashflow-helpers/CashFlowCategoriesList';
import CashflowSideBar from '@/app/ui/components/cashflow/CashflowSideBar'
import CashFlowCategoriesForm from '@/app/ui/components/cashflow/income/income-categories/income-categories-form/CashFlowCategoriesForm';
import React, { useEffect, useState } from 'react'

export default function IncomeCategories() {
  const [incomeCategories, setIncomeCategories] = useState<CashFlowCategory[]>([]);
	const [editingIncomeCategory, setEditingIncomeCategory] = useState<CashFlowCategory | null>(null);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<string>("");

	async function handleSubmit(formData: FormData) {
		const nameValue = formData.get("Name") as string;
		const cashFlowEntry: CashFlowCategory = { name: nameValue, categoryType: CashFlowType.Income };
		let response = null
		const idValue = formData.get("Id");
		if (idValue)
			response = await putRequest<CashFlowCategory>("CashFlowCategories", idValue as string, cashFlowEntry);
		else
			response = await postRequest<CashFlowCategory>("CashFlowCategories", cashFlowEntry);
		const actionVerb: string = idValue == null ? "create" : "update";
		if (!response.successful)
			setMessage(`Failed to ${actionVerb} income category: "` + response.responseMessage);
		else {
			setMessage(`Income category ${actionVerb}d successfully.`);
			fetchIncomeCategories();
			setEditingIncomeCategory(null)
		}
	}

	function onCategoryIsEditing(category: CashFlowCategory){
		setEditingIncomeCategory(category);
	}

	async function fetchIncomeCategories() {
		setIsLoading(true);
		const response = await getRequest<CashFlowCategory>("CashFlowCategories?cashFlowType=Income");
		setIncomeCategories(response.data as CashFlowCategory[]);
		if (!response.successful) {
			setIsError(true);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		fetchIncomeCategories();
	}, []);

	// if (!isLoggedIn)
	// 	return <></>;

	return (
		<div className="flex gap-6 p-6">
			<CashflowSideBar />
			<CashFlowCategoriesForm
				handleSubmit={handleSubmit}
				editingCashFlowCategory={editingIncomeCategory}
				onNameChange={(name: string) => setEditingIncomeCategory(prev => prev ? { ...prev, name } : { name, categoryType: CashFlowType.Income })}
				onReset={() => setEditingIncomeCategory(null)}
				infoMessage={isError ? "" : message}
				errorMessage={isError ? message : ""}
				cashFlowType={CashFlowType.Income}
			/>
			<CashFlowCategoriesList
				categories={incomeCategories}
				onCategoryDeleted={fetchIncomeCategories}
				onCategoryIsEditing={onCategoryIsEditing}
				isLoading={isLoading}
				isError={isError}
				cashFlowType={CashFlowType.Income}
			/>
		</div>
	)
}
