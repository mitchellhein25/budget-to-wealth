'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from '@/app/hooks';
import { getCurrentMonthRange, messageTypeIsError, DatePicker, DateRange } from '@/app/components';
import { CashFlowSideBar, CashFlowEntry, EXPENSE_ITEM_NAME_LOWERCASE } from '@/app/cashflow/components';
import { BUDGET_ITEM_NAME, Budget, BudgetFormData, transformFormDataToBudget, BudgetsForm, BudgetsList, BudgetSummary, BUDGET_ITEM_NAME_LOWERCASE, convertBudgetToFormData } from './components';
import { BUDGETS_ENDPOINT, getBudgetsByDateRange, getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api/data-methods';
import ResponsiveFormListPage from '@/app/components/ui/ResponsiveFormListPage';
import { useFormListItemsFetch } from '@/app/hooks/';

export default function BudgetsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const fetchBudgets = useCallback(() => getBudgetsByDateRange(dateRange), [dateRange]);
  const { fetchItems: fetchBudgetItems, isPending: isPendingBudgets, message: messageBudgets } = useFormListItemsFetch<Budget>({
    fetchItems: fetchBudgets,
    itemName: BUDGET_ITEM_NAME_LOWERCASE,
    setItems: setBudgets,
  });

  const [expenses, setExpenses] = useState<CashFlowEntry[]>([]);
  const fetchExpenses = useCallback(() => getCashFlowEntriesByDateRangeAndType(dateRange, 'Expense'), [dateRange]);
  const { fetchItems: fetchExpenseItems, isPending: isPendingExpenses, message: messageExpenses } = useFormListItemsFetch<CashFlowEntry>({
    fetchItems: fetchExpenses,
    itemName: EXPENSE_ITEM_NAME_LOWERCASE,
    setItems: setExpenses,
  });

  const formState = useForm<Budget, BudgetFormData>(
    {
      itemName: BUDGET_ITEM_NAME,
      itemEndpoint: BUDGETS_ENDPOINT,
      transformFormDataToItem: transformFormDataToBudget,
      convertItemToFormData: convertBudgetToFormData,
      fetchItems: fetchBudgetItems,
    }
  );

	useEffect(() => {
		fetchBudgetItems();
    fetchExpenseItems();
	}, [fetchBudgetItems, fetchExpenseItems]);

  return (
    <ResponsiveFormListPage
      sideBar={<CashFlowSideBar />}
      totalDisplay={
        <BudgetSummary
          budgets={budgets}
          expenses={expenses}
          dateRange={dateRange}
          isLoading={isPendingBudgets || isPendingExpenses}
        />
      }
      datePicker={
        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      }
      form={<BudgetsForm formState={formState}/>}
      list={
        <BudgetsList
          budgets={budgets}
          expenses={expenses}
          onBudgetDeleted={fetchBudgetItems}
          onBudgetIsEditing={formState.onItemIsEditing}
          isLoading={isPendingBudgets || isPendingExpenses}
          isError={messageTypeIsError(messageBudgets) || messageTypeIsError(messageExpenses)}
        />
      }
    />
  );
}
