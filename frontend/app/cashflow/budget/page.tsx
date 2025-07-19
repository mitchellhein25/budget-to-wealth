'use client';

import { Budget } from '@/app/cashflow/budget/components/Budget';
import { BudgetFormData } from '@/app/cashflow/budget/components/BudgetFormData';
import BudgetsForm from '@/app/cashflow/budget/components/BudgetsForm';
import BudgetsList from '@/app/cashflow/budget/components/BudgetsList';
import BudgetSummary from '@/app/cashflow/budget/components/BudgetSummary';
import { transformFormDataToBudget } from '@/app/cashflow/budget/components/transformFormDataToBudget';
import { getCurrentMonthRange, messageTypeIsError } from '@/app/components/Utils';
import DatePicker from '@/app/components/DatePicker';
import { useDataListFetcher } from '@/app/hooks/useDataListFetcher';
import React, { useCallback, useEffect, useState } from 'react'
import { DateRange } from '../../components/DatePicker';
import CashFlowSideBar from '@/app/cashflow/components/CashFlowSideBar';
import { CashFlowEntry } from '@/app/cashflow/components/CashFlowEntry';
import { getBudgetsByDateRange } from '@/app/lib/api/data-methods/getBudgets';
import { getExpensesByDateRange } from '@/app/lib/api/data-methods/getExpenses';
import { useForm } from '@/app/hooks/useForm';

export default function BudgetsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const fetchBudgets = useCallback(async () => await getBudgetsByDateRange(dateRange), [dateRange]);
	const budgetsDataListFetchState = useDataListFetcher<Budget>(fetchBudgets, "budgets");
  const fetchExpenses = useCallback(async () => await getExpensesByDateRange(dateRange), [dateRange]);
	const expensesDataListFetchState = useDataListFetcher<CashFlowEntry>(fetchExpenses, "expenses");

  const convertBudgetToFormData = (budget: Budget) => ({
    id: budget.id?.toString(),
    amount: (budget.amount / 100).toFixed(2),
    categoryId: budget.categoryId,
  });

  const formState = useForm<Budget, BudgetFormData>(
    {
      itemName: "Budget",
      itemEndpoint: "Budgets",
      transformFormDataToItem: transformFormDataToBudget,
      convertItemToFormData: convertBudgetToFormData,
      fetchItems: () => fetchBudgets(),
    }
  );

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
            handleSubmit={formState.handleSubmit}
            editingFormData={formState.editingFormData}
            onChange={formState.onChange}
            onReset={formState.onReset}
            message={formState.message}
            isSubmitting={formState.isSubmitting}
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
                budgets={budgetsDataListFetchState.items}
                expenses={expensesDataListFetchState.items}
                dateRange={dateRange}
                isLoading={budgetsDataListFetchState.isLoading || expensesDataListFetchState.isLoading}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <BudgetsList
            budgets={budgetsDataListFetchState.items}
            expenses={expensesDataListFetchState.items}
            onBudgetDeleted={fetchBudgets}
            onBudgetIsEditing={formState.onItemIsEditing}
            isLoading={budgetsDataListFetchState.isLoading || expensesDataListFetchState.isLoading}
            isError={messageTypeIsError(budgetsDataListFetchState.message) || messageTypeIsError(expensesDataListFetchState.message)}
          />
        </div>
      </div>
    </div>
  )
}
