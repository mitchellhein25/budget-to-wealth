'use client';

import { Budget } from '@/app/lib/models/cashflow/Budget';
import { BudgetFormData } from '@/app/ui/components/cashflow/budgets/BudgetFormData';
import BudgetsForm from '@/app/ui/components/cashflow/budgets/BudgetsForm';
import BudgetsList from '@/app/ui/components/cashflow/budgets/BudgetsList';
import BudgetSummary from '@/app/ui/components/cashflow/budgets/BudgetSummary';
import { transformFormDataToBudget } from '@/app/ui/components/cashflow/budgets/transformFormDataToBudget';
import { cleanCurrencyInput, convertDateToISOString, formatDate, getCurrentMonthRange } from '@/app/ui/components/Utils';
import DatePicker from '@/app/ui/components/DatePicker';
import { handleFormSubmit } from '@/app/ui/components/form/functions/handleFormSubmit';
import { useList } from '@/app/ui/hooks/useFormList';
import React, { useCallback, useEffect, useState } from 'react'
import { DateRange } from '../../ui/components/DatePicker';
import CashFlowSideBar from '@/app/ui/components/cashflow/entries/CashFlowSideBar';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';

export default function BudgetsPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const fetchEndpoint = `Budgets?startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`;
	const { items, isLoading, message, fetchItems, setMessage, setInfoMessage, setErrorMessage } = useList<Budget>(fetchEndpoint, "Budgets");
	const [editingFormData, setEditingFormData] = useState<Partial<BudgetFormData>>({});
  const [expenses, setExpenses] = useState<CashFlowEntry[]>([]);

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
  
  const fetchExpenses = useCallback(async () => {
    const response = await getRequest<CashFlowEntry>(`CashFlowEntries?entryType=${CashFlowType.Expense}&startDate=${convertDateToISOString(dateRange.from)}&endDate=${convertDateToISOString(dateRange.to)}`);
    if (response.successful) {
      setExpenses(response.data as CashFlowEntry[]);
    }
  }, [dateRange]);

	useEffect(() => {
		fetchItems();
    fetchExpenses();
	}, [fetchItems, fetchExpenses]);

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
                budgets={items}
                expenses={expenses}
                dateRange={dateRange}
                isLoading={isLoading}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <BudgetsList
            budgets={items}
            expenses={expenses}
            onBudgetDeleted={fetchItems}
            isLoading={isLoading}
            isError={message.type === 'list-error'}
            onBudgetIsEditing={onBudgetIsEditing}
          />
        </div>
      </div>
    </div>
  )
}
