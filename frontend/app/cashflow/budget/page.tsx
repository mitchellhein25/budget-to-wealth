'use client';

import { Budget } from '@/app/cashflow/budget/components/Budget';
import { BudgetFormData } from '@/app/cashflow/budget/components/BudgetFormData';
import BudgetsForm from '@/app/cashflow/budget/components/BudgetsForm';
import BudgetsList from '@/app/cashflow/budget/components/BudgetsList';
import BudgetSummary from '@/app/cashflow/budget/components/BudgetSummary';
import { transformFormDataToBudget } from '@/app/cashflow/budget/components/transformFormDataToBudget';
import { cleanCurrencyInput, convertDateToISOString, formatDate, getCurrentMonthRange, messageTypeIsError } from '@/app/components/Utils';
import DatePicker from '@/app/components/DatePicker';
import { handleFormSubmit } from '@/app/components/form/functions/handleFormSubmit';
import { useDataListFetcher } from '@/app/components/form/useDataListFetcher';
import React, { useCallback, useEffect, useState } from 'react'
import { DateRange } from '../../components/DatePicker';
import CashFlowSideBar from '@/app/cashflow/components/CashFlowSideBar';
import { CashFlowEntry } from '@/app/cashflow/components/CashFlowEntry';
import { getBudgetsByDateRange } from '@/app/lib/api/data-methods/getBudgets';
import { getExpensesByDateRange } from '@/app/lib/api/data-methods/getExpenses';

export default function BudgetsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const fetchBudgets = useCallback(async () => await getBudgetsByDateRange(dateRange), [dateRange]);
	const budgetsDataListFetchState = useDataListFetcher<Budget>(fetchBudgets, "budgets");
  const fetchExpenses = useCallback(async () => await getExpensesByDateRange(dateRange), [dateRange]);
	const expensesDataListFetchState = useDataListFetcher<CashFlowEntry>(fetchExpenses, "expenses");

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingFormData, setEditingFormData] = useState<Partial<BudgetFormData>>({});

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const fieldName = name.replace('budget-', '');
    let cleanedValue: string | null = value;
    if (fieldName === "amount") {
      cleanedValue = cleanCurrencyInput(value);
      if (cleanedValue == null)
        return;
    }
    setEditingFormData(
        prev => prev ? 
        { ...prev, [fieldName]: cleanedValue } : 
        { [fieldName]: cleanedValue } as BudgetFormData)
  }

  const handleSubmit = (formData: FormData) => 
		handleFormSubmit<Budget | null, BudgetFormData>(
			formData,
			(formData) => transformFormDataToBudget(formData),
			setIsSubmitting,
			setMessage,
			setErrorMessage,
			setInfoMessage,
			fetchItems,
			setEditingFormData,
			"Budget",
			"Budgets"
	);

  const onBudgetIsEditing = (budget: Budget) => {
		setEditingFormData({
			id: budget.id?.toString(),
			amount: (budget.amount / 100).toFixed(2),
			categoryId: budget.categoryId,
		});
		setMessage({ type: null, text: '' });
	};

  const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};

	useEffect(() => {
		fetchBudgets();
    fetchExpenses();
	}, [fetchBudgets, fetchExpenses]);

  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <CashFlowSideBar />
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <BudgetsForm
            handleSubmit={handleSubmit}
            editingFormData={editingFormData}
            onChange={onChange}
            onReset={onReset}
            errorMessage={message.type === 'form-error' ? message.text : ''}
            infoMessage={message.type === 'form-info' ? message.text : ''}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
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
              <BudgetSummary
                budgets={dataListFetchState.items}
                expenses={expenses}
                dateRange={dateRange}
                isLoading={dataListFetchState.isLoading}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <BudgetsList
            budgets={budgetsDataListFetchState.items}
            expenses={expensesDataListFetchState.items}
            onBudgetDeleted={fetchBudgets}
            onBudgetIsEditing={onBudgetIsEditing}
            isLoading={budgetsDataListFetchState.isLoading || expensesDataListFetchState.isLoading}
            isError={messageTypeIsError(budgetsDataListFetchState.message) || messageTypeIsError(expensesDataListFetchState.message)}
          />
        </div>
      </div>
    </div>
  )
}
