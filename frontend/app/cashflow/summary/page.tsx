'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormListItemsFetch, useSidebarDetection, useMobileDetection, MobileState } from '@/app/hooks';
import { getCashFlowEntriesByDateRangeAndType } from '@/app/lib/api';
import { getCurrentMonthRange } from '@/app/lib/utils';
import { DatePicker, DateRange, TotalDisplay } from '@/app/components';
import { CashFlowType, CashFlowEntry, EXPENSE_ITEM_NAME_LOWERCASE, INCOME_ITEM_NAME_LOWERCASE, INCOME_ITEM_NAME, CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME, CashFlowSideBar } from '@/app/cashflow';
import OverUnderOnIcon from '@/app/components/ui/OverUnderOnIcon';

export default function SummaryPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange(new Date()));
  const showSidebar = useSidebarDetection();
  const mobileState = useMobileDetection();

  const fetchExpenses = useCallback(() => {
    return getCashFlowEntriesByDateRangeAndType(dateRange, CashFlowType.EXPENSE);
  }, [dateRange]);
  const fetchIncomes = useCallback(() => {
    return getCashFlowEntriesByDateRangeAndType(dateRange, CashFlowType.INCOME);
  }, [dateRange]);

  const { fetchItems: fetchExpenseItems, isPending: isExpensePending, items: itemsExpense } = useFormListItemsFetch<CashFlowEntry>({
    fetchItems: fetchExpenses,
    itemName: EXPENSE_ITEM_NAME_LOWERCASE
  });
  const { fetchItems: fetchIncomeItems, isPending: isIncomePending, items: itemsIncome } = useFormListItemsFetch<CashFlowEntry>({
    fetchItems: fetchIncomes,
    itemName: INCOME_ITEM_NAME_LOWERCASE
  });

  useEffect(() => {
    fetchExpenseItems();
    fetchIncomeItems();
  }, [fetchExpenseItems, fetchIncomeItems]);

  const totalExpenseAmount = useMemo(() => itemsExpense.reduce((sum, entry) => sum + entry.amount, 0), [itemsExpense]);

  const totalIncomeAmount = useMemo(() => itemsIncome.reduce((sum, entry) => sum + entry.amount, 0), [itemsIncome]);

  const incomeTotalDisplay = (marginOverride?: string) => (
    <TotalDisplay
      label={`Total ${INCOME_ITEM_NAME}`}
      amount={totalIncomeAmount}
      isLoading={isIncomePending}
      marginOverride={marginOverride}
      className="w-2/5"
    />
  )

  const expenseTotalDisplay = (marginOverride?: string) => (
    <TotalDisplay
      label={`Total ${EXPENSE_ITEM_NAME}`}
      amount={totalExpenseAmount}
      isLoading={isExpensePending}
      marginOverride={marginOverride}
      className="w-2/5"
    />
  ) 

  const cashflowTotalDisplay = (marginOverride?: string) => (
    <TotalDisplay
      label={CASHFLOW_ITEM_NAME}
      amount={totalIncomeAmount - totalExpenseAmount}
      isLoading={isIncomePending}
      amountPrefix={totalIncomeAmount - totalExpenseAmount >= 0 ? '+' : ''}
      labelSuffix={<OverUnderOnIcon value={totalIncomeAmount - totalExpenseAmount} size={20} />}
      marginOverride={marginOverride}
      className="w-4/5"
    />
  )

  return (
    <div className="page-layout">
      {showSidebar && <CashFlowSideBar />}
      <div className="flex flex-1 flex-col gap-2 items-center">
        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        {mobileState === MobileState.XSMALL ? (
          <>
            <div className="flex flex-row gap-2 w-4/5">
              {incomeTotalDisplay("m-0")}
              {expenseTotalDisplay("m-0")}
            </div>
            <div className="flex flex-row gap-2 w-4/5">
              {cashflowTotalDisplay("m-0")}
            </div>
          </>
        ) : (
          <div className="flex flex-row gap-2 w-4/5">
            {incomeTotalDisplay()}
            {expenseTotalDisplay()}
            {cashflowTotalDisplay()}
          </div>
        )}
      </div>
    </div>
  )
}
