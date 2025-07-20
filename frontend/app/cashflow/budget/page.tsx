'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Budget, BudgetsForm, BudgetFormData, transformFormDataToBudget, BudgetsList, BudgetSummary, BUDGET_ITEM_NAME } from './components';
import { getCurrentMonthRange, messageTypeIsError, DatePicker, DateRange } from '@/app/components';
import { useForm, useDataListFetcher } from '@/app/hooks';
import { CashFlowSideBar, CashFlowEntry } from '@/app/cashflow/components';
import { getBudgetsByDateRange, getExpensesByDateRange, BUDGETS_ENDPOINT } from '@/app/lib/api/data-methods';

export default function BudgetsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const fetchBudgets = useCallback(() => getBudgetsByDateRange(dateRange), [dateRange]);
	const budgetsDataListFetchState = useDataListFetcher<Budget>(fetchBudgets, BUDGET_ITEM_NAME);
  const fetchExpenses = useCallback(() => getExpensesByDateRange(dateRange), [dateRange]);
	const expensesDataListFetchState = useDataListFetcher<CashFlowEntry>(fetchExpenses, "expenses");

  const convertBudgetToFormData = (budget: Budget) => ({
    id: budget.id?.toString(),
    amount: (budget.amount / 100).toFixed(2),
    categoryId: budget.categoryId,
  });

  const formState = useForm<Budget, BudgetFormData>(
    {
      itemName: BUDGET_ITEM_NAME,
      itemEndpoint: BUDGETS_ENDPOINT,
      transformFormDataToItem: transformFormDataToBudget,
      convertItemToFormData: convertBudgetToFormData,
      fetchItems: () => budgetsDataListFetchState.fetchItems(),
    }
  );

	useEffect(() => {
		budgetsDataListFetchState.fetchItems();
    expensesDataListFetchState.fetchItems();
	}, [dateRange]);

  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <CashFlowSideBar />
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          <BudgetsForm
            formState={formState}
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
            onBudgetDeleted={budgetsDataListFetchState.fetchItems}
            onBudgetIsEditing={formState.onItemIsEditing}
            isLoading={budgetsDataListFetchState.isLoading || expensesDataListFetchState.isLoading}
            isError={messageTypeIsError(budgetsDataListFetchState.message) || messageTypeIsError(expensesDataListFetchState.message)}
          />
        </div>
      </div>
    </div>
  )
}
