import { Budget } from '@/app/lib/models/cashflow/Budget';
import { BudgetFormData } from '@/app/ui/components/cashflow/budgets/BudgetFormData';
import { transformFormDataToBudget } from '@/app/ui/components/cashflow/budgets/transformFormDataToBudget';
import { convertDollarsToCents, formatDate, getMonthRange } from '@/app/ui/components/cashflow/CashFlowUtils';
import { CashFlowEntryFormData } from '@/app/ui/components/cashflow/entries/form/CashFlowEntryFormData';
import { transformFormDataToEntry } from '@/app/ui/components/cashflow/entries/form/functions/transformFormDataToEntry';
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
    const { value } = event.target;
    setEditingFormData(prev => prev ? { ...prev, value } : { event.target.name: value } as BudgetFormData)
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
    
  )
}
