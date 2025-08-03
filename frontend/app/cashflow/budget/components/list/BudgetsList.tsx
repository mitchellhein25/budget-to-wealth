'use client'

import React, { useMemo }	 from 'react';
import { Equal, ArrowUp, ArrowDown } from 'lucide-react';
import { convertCentsToDollars } from '@/app/components';
import { ListTable } from '@/app/components/table/ListTable';
import { CashFlowEntry } from '@/app/cashflow/components';
import { deleteBudget } from '@/app/lib/api/data-methods';
import { BUDGET_ITEM_NAME, Budget } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

interface BudgetsListProps {
	budgets: Budget[],
	expenses: CashFlowEntry[],
	onBudgetDeleted: () => void,
	onBudgetIsEditing: (budget: Budget) => void,
	isLoading: boolean,
	isError: boolean,
}

export function BudgetsList(props: BudgetsListProps) {

	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteBudget(id);
			if (result.successful)
				props.onBudgetDeleted();
		}
	};

  const getAmountSpentInCategory = useMemo(() => {
    return (categoryId: string) => props.expenses.filter(expense => expense.categoryId === categoryId)
												 	.reduce((acc, expense) => acc + expense.amount, 0);
  }, [props.expenses]);

  const getRemainingBudget = (budget: Budget) => {
    return budget.amount - getAmountSpentInCategory(budget.categoryId);
  };

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
									{convertCentsToDollars(budget.amount)}
				</td>
				<td className="flex-1">
					{convertCentsToDollars(getAmountSpentInCategory(budget.categoryId))}
				</td>
				<td className="flex-1">
					{convertCentsToDollars(getRemainingBudget(budget))}
      </td>
      <td className={"flex-1 " + (getRemainingBudget(budget) == 0 ? "text-yellow-500" : getRemainingBudget(budget) > 0 ? "text-green-500" : "text-red-500")}>
        {getRemainingBudget(budget) == 0 ? <Equal size={22} /> : getRemainingBudget(budget) > 0 ? <ArrowDown size={22} /> : <ArrowUp size={22} />}
      </td>
			<td className="flex space-x-2">
				<EditButton 
					onClick={() => props.onBudgetIsEditing(budget)}
					className="p-1 hover:text-primary"
				/>
				<DeleteButton 
					onClick={() => handleDelete(budget.id as number)}
					className="p-1 hover:text-error"
				/>
			</td>
		</tr>
	);

	return (
		<ListTable
			title={`${BUDGET_ITEM_NAME}s`}
			headerRow={tableHeaderRow}
			bodyRow={tableBodyRow}
			items={props.budgets}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
