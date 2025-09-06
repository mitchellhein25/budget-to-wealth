'use client';

import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Equal } from 'lucide-react';
import { DateRange, TotalDisplay } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow';
import { BUDGET_ITEM_NAME, Budget } from '@/app/cashflow/budget';

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

  const getStatusIcon = () => {
    if (overUnder === 0) return <Equal size={20} className="text-yellow-500" />;
    if (overUnder > 0) return <ArrowDown size={20} className="text-green-500" />;
    return <ArrowUp size={20} className="text-red-500" />;
  };

  const getOverUnderLabel = () => {
    if (overUnder === 0) return `On ${BUDGET_ITEM_NAME}`;
    if (overUnder > 0) return `Under ${BUDGET_ITEM_NAME}`;
    return `Over ${BUDGET_ITEM_NAME}`;
  };

  const isLoading = props.isLoading;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex gap-2">
        <TotalDisplay
          label={`Total ${BUDGET_ITEM_NAME}`}
          amount={totalBudget}
          isLoading={isLoading}
        />
        <TotalDisplay
          label="Total Expenses"
          amount={totalExpenses}
          isLoading={isLoading}
        />
      </div>
      <div className="bg-base-200 rounded p-2">
        <div className="text-xs font-medium text-base-content/70 flex items-center gap-1">
          {getOverUnderLabel()}
          {getStatusIcon()}
        </div>
        <div className="text-lg font-bold text-base-content">
          {isLoading ? '...' : (overUnder >= 0 ? '+' : '') + (overUnder / 100).toFixed(2)}
        </div>
      </div>
    </div>
  );
} 