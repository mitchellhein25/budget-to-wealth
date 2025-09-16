'use client';

import React, { useMemo } from 'react';
import { DateRange, TotalDisplay } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow';
import { BUDGET_ITEM_NAME, Budget } from '@/app/cashflow/budget';
import OverUnderOnIcon from '@/app/components/ui/OverUnderOnIcon';

interface BudgetSummaryProps {
  budgets: Budget[];
  expenses: CashFlowEntry[];
  dateRange: DateRange;
  isLoading: boolean;
}

export function BudgetSummary(props: BudgetSummaryProps) {

  const totalBudget = useMemo(() => props.budgets.reduce((sum, budget) => sum + budget.amount, 0), [props.budgets]);
  const totalExpenses = useMemo(() => props.expenses.reduce((sum, expense) => sum + expense.amount, 0), [props.expenses]);
  const overUnder = totalBudget - totalExpenses;

  const getOverUnderLabel = () => {
    if (overUnder === 0) return `On ${BUDGET_ITEM_NAME}`;
    if (overUnder > 0) return `Under ${BUDGET_ITEM_NAME}`;
    return `Over ${BUDGET_ITEM_NAME}`;
  };

  const isLoading = props.isLoading;

  return (
    <div className="flex flex-col sm:gap-1 w-full">
      <div className="flex sm:gap-2">
        <TotalDisplay
          label={`Total ${BUDGET_ITEM_NAME}`}
          amount={totalBudget}
          isLoading={isLoading}
          marginOverride="m-1"
        />
        <TotalDisplay
          label="Total Expenses"
          amount={totalExpenses}
          isLoading={isLoading}
          marginOverride="m-1"
        />
      </div>
      <TotalDisplay
          label={getOverUnderLabel()}
          labelSuffix={<OverUnderOnIcon value={overUnder} size={20} />}
          amount={overUnder}
          isLoading={isLoading}
          amountPrefix={overUnder >= 0 ? '+' : ''}
          marginOverride="m-1"
        />
    </div>
  );
} 