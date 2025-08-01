'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from '@/app/hooks';
import { getCurrentMonthRange, messageTypeIsError, DatePicker, DateRange, MessageState, MESSAGE_TYPE_ERROR } from '@/app/components';
import { CashFlowSideBar, CashFlowEntry, EXPENSE_ITEM_NAME_LOWERCASE } from '@/app/cashflow/components';
import { BUDGET_ITEM_NAME, Budget, BudgetFormData, transformFormDataToBudget, BudgetsForm, BudgetsList, BudgetSummary, BUDGET_ITEM_NAME_LOWERCASE } from './components';
import { BUDGETS_ENDPOINT, getBudgetsByDateRange, getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api/data-methods';

export default function BudgetsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<CashFlowEntry[]>([]);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [messageBudgets, setMessageBudgets] = useState<MessageState>({ type: null, text: '' });
  const [messageExpenses, setMessageExpenses] = useState<MessageState>({ type: null, text: '' });

  const fetchBudgets = useCallback(() => getBudgetsByDateRange(dateRange), [dateRange]);
  const fetchExpenses = useCallback(() => getCashFlowEntriesByDateRangeAndType(dateRange, 'Expense'), [dateRange]);

  const fetchBudgetItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessageBudgets({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoadingBudgets(true);
      setMessageBudgets({ type: null, text: '' });
      const response = await fetchBudgets();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${BUDGET_ITEM_NAME_LOWERCASE}s. Please try again.`);
        return;
      }
      setBudgets(response.data as Budget[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${BUDGET_ITEM_NAME_LOWERCASE}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoadingBudgets(false);
    }
  }, [fetchBudgets]);

  const fetchExpenseItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessageExpenses({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoadingExpenses(true);
      setMessageExpenses({ type: null, text: '' });
      const response = await fetchExpenses();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${EXPENSE_ITEM_NAME_LOWERCASE}s. Please try again.`);
        return;
      }
      setExpenses(response.data as CashFlowEntry[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${EXPENSE_ITEM_NAME_LOWERCASE}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoadingExpenses(false);
    }
  }, [fetchExpenses]);

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
      fetchItems: fetchBudgetItems,
    }
  );

	useEffect(() => {
		fetchBudgetItems();
    fetchExpenseItems();
	}, [fetchBudgetItems, fetchExpenseItems]);

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
                budgets={budgets}
                expenses={expenses}
                dateRange={dateRange}
                isLoading={isLoadingBudgets || isLoadingExpenses}
              />
            </div>
            <div className="flex-1"></div>
          </div>
          <BudgetsList
            budgets={budgets}
            expenses={expenses}
            onBudgetDeleted={fetchBudgetItems}
            onBudgetIsEditing={formState.onItemIsEditing}
            isLoading={isLoadingBudgets || isLoadingExpenses}
            isError={messageTypeIsError(messageBudgets) || messageTypeIsError(messageExpenses)}
          />
        </div>
      </div>
    </div>
  )
}
