'use client';

import React from 'react';
import { Budget } from '@/app/cashflow/budget/components/Budget';
import { CashFlowEntry } from '@/app/cashflow/components/CashFlowEntry';
import { DateRange } from '../../../components/DatePicker';
import { ArrowUp, ArrowDown, Equal } from 'lucide-react';
import TotalDisplay from '../../../components/TotalDisplay';

interface BudgetSummaryProps {
  budgets: Budget[];
  expenses: CashFlowEntry[];
  dateRange: DateRange;
  isLoading: boolean;
}

export default function BudgetSummary(props: BudgetSummaryProps) {

  const totalBudget = props.budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = props.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const overUnder = totalBudget - totalExpenses;

  const getStatusIcon = () => {
    if (overUnder === 0) return <Equal size={20} className="text-yellow-500" />;
    if (overUnder > 0) return <ArrowDown size={20} className="text-green-500" />;
    return <ArrowUp size={20} className="text-red-500" />;
  };

  const getOverUnderLabel = () => {
    if (overUnder === 0) return 'On Budget';
    if (overUnder > 0) return 'Under Budget';
    return 'Over Budget';
  };

  const isLoading = props.isLoading;

  return (
    <div className="flex gap-4">
      <TotalDisplay
        label="Total Budget"
        amount={totalBudget}
        isLoading={isLoading}
      />
      <TotalDisplay
        label="Total Expenses"
        amount={totalExpenses}
        isLoading={isLoading}
      />
      <div className="bg-base-200 rounded-lg p-4 min-w-[200px]">
        <div className="text-sm font-medium text-base-content/70 flex items-center gap-2">
          {getOverUnderLabel()}
          {getStatusIcon()}
        </div>
        <div className="text-2xl font-bold text-base-content">
          {isLoading ? '...' : (overUnder >= 0 ? '+' : '') + (overUnder / 100).toFixed(2)}
        </div>
      </div>
    </div>
  );
} 