'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { Pencil, Trash2, Equal, ArrowUp, ArrowDown } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '../../Utils';
import ListTable from '@/app/ui/components/table/ListTable';
import { Budget } from '@/app/lib/models/cashflow/Budget';
import { DateRange } from 'react-day-picker';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';
import { getRequest } from '@/app/lib/api/rest-methods/getRequest';
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';

interface BudgetsListProps {
	budgets: Budget[],
	onBudgetDeleted: () => void,
	onBudgetIsEditing: (budget: Budget) => void,
	isLoading: boolean,
	isError: boolean,
  dateRange: DateRange,
}

export default function BudgetsList(props: BudgetsListProps) {
  const [expenses, setExpenses] = useState<CashFlowEntry[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  
  const fetchExpenses = useCallback(async () => {
    // setInfoMessage("");
    // setErrorMessage("");
    // setIsLoading(true);
    const response = await getRequest<CashFlowEntry>(`CashFlowEntries?cashFlowType=${CashFlowType.Expense}&startDate=${formatDate(props.dateRange.from)}&endDate=${formatDate(props.dateRange.to)}`);
    if (response.successful) {
      setExpenses(response.data as CashFlowEntry[]);
    }
  }, [props.dateRange]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteRequest<Budget>("Budgets", id);
			if (result.successful)
				props.onBudgetDeleted();
		}
	};

  function getAmountSpentInCategory(categoryId: string) {
    return expenses.filter(expense => expense.categoryId === categoryId).reduce((acc, expense) => acc + expense.amount, 0);
  }

  function getRemainingBudget(budget: Budget) {
    return budget.amount - getAmountSpentInCategory(budget.categoryId);
  }

	const tableHeaderRow = (
		<tr>
			<th className="w-1/5">Category</th>
			<th className="w-1/5">Amount</th>
      <th className="w-1/5">Spent</th>
      <th className="w-1/5">Remaining</th>
			<th className="w-1/5">Status</th>
		</tr>
	);

	const tableBodyRow = (budget: Budget) => (
		<tr key={budget.id}>
			<td className="flex-1">
				{budget.category?.name}
			</td>
			<td className="flex-1">
				{formatCurrency(budget.amount)}
			</td>
      <td className="flex-1">
        {formatCurrency(getAmountSpentInCategory(budget.categoryId))}
      </td>
      <td className="flex-1">
        {formatCurrency(getRemainingBudget(budget))}
      </td>
      <td className={"flex-1 " + (getRemainingBudget(budget) == 0 ? "text-yellow-500" : getRemainingBudget(budget) > 0 ? "text-green-500" : "text-red-500")}>
        {getRemainingBudget(budget) == 0 ? <Equal size={22} /> : getRemainingBudget(budget) > 0 ? <ArrowDown size={22} /> : <ArrowUp size={22} />}
      </td>
			<td className="flex space-x-2">
				<button
					id="edit-button"
					onClick={() => props.onBudgetIsEditing(budget)}
					className="p-1 hover:text-primary"
					aria-label="Edit"
				>
					<Pencil size={16} />
				</button>
				<button
					id="delete-button"
					onClick={() => handleDelete(budget.id as number)}
					className="p-1 hover:text-error"
					aria-label="Delete"
				>
					<Trash2 size={16} />
				</button>
			</td>
		</tr>
	);

	return (
		<ListTable
			title={"Budgets"}
			headerRow={tableHeaderRow}
			bodyRow={tableBodyRow}
			items={props.budgets}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
