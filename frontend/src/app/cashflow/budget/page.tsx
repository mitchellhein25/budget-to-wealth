'use client';

import { Budget } from '@/app/lib/models/cashflow/Budget';
import { BudgetFormData } from '@/app/ui/components/cashflow/budgets/BudgetFormData';
import BudgetsForm from '@/app/ui/components/cashflow/budgets/BudgetsForm';
import BudgetsList from '@/app/ui/components/cashflow/budgets/BudgetsList';
import { transformFormDataToBudget } from '@/app/ui/components/cashflow/budgets/transformFormDataToBudget';
import { cleanCurrencyInput, formatDate, getMonthRange } from '@/app/ui/components/cashflow/CashFlowUtils';
import DatePicker from '@/app/ui/components/DatePicker';
import { handleFormSubmit } from '@/app/ui/components/form/functions/handleFormSubmit';
import { useList } from '@/app/ui/hooks/useFormList';
import React, { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker';

export default function BudgetsPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getMonthRange(new Date()));
  const fetchEndpoint = `Budgets?startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`;
	const { items, isLoading, message, fetchItems, setMessage, setInfoMessage, setErrorMessage } = useList<Budget>(fetchEndpoint, "Budgets");
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
		fetchItems();
	}, [fetchItems]);

  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
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
        <div className="flex flex-1 flex-col gap-2">
          <DatePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <BudgetsList
            budgets={items}
            onBudgetDeleted={fetchItems}
            isLoading={isLoading}
            isError={message.type === 'list-error'}
            onBudgetIsEditing={onBudgetIsEditing}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  )
}
