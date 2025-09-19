'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { MobileState, useForm, useFormListItemsFetch, useMobileDetection } from '@/app/hooks';
import { BUDGETS_ENDPOINT, getBudgetsByDateRange, getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api';
import { getFullMonthRange, messageTypeIsError } from '@/app/lib/utils';
import { DatePicker, DateRange, ResponsiveFormListPage } from '@/app/components';
import { CashFlowSideBar, CashFlowEntry, EXPENSE_ITEM_NAME_LOWERCASE } from '@/app/cashflow';
import { BUDGET_ITEM_NAME, Budget, BudgetFormData, transformFormDataToBudget, BudgetsForm, BudgetsList, BudgetSummary, BUDGET_ITEM_NAME_LOWERCASE, convertBudgetToFormData } from '@/app/cashflow/budget';

export default function BudgetsPage() {
	const [dateRange, setDateRange] = useState<DateRange>(getFullMonthRange(new Date()));
  const mobileState = useMobileDetection();

  const fetchBudgets = useCallback(() => getBudgetsByDateRange(dateRange), [dateRange]);
  const { fetchItems: fetchBudgetItems, isPending: isPendingBudgets, message: messageBudgets, items: budgets } = useFormListItemsFetch<Budget>({
    fetchItems: fetchBudgets,
    itemName: BUDGET_ITEM_NAME_LOWERCASE,
  });

  const fetchExpenses = useCallback(() => getCashFlowEntriesByDateRangeAndType(dateRange, 'Expense'), [dateRange]);
  const { fetchItems: fetchExpenseItems, isPending: isPendingExpenses, message: messageExpenses, items: expenses } = useFormListItemsFetch<CashFlowEntry>({
    fetchItems: fetchExpenses,
    itemName: EXPENSE_ITEM_NAME_LOWERCASE,
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
        <>
          <BudgetSummary
            budgets={budgets}
            expenses={expenses}
            dateRange={dateRange}
            isLoading={isPendingBudgets || isPendingExpenses}
          />
          {mobileState !== MobileState.XSMALL && <div className="w-full"></div>}
        </>
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
