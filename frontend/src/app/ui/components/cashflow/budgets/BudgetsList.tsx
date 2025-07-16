'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { Pencil, Trash2, Equal, ArrowUp, ArrowDown } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { convertCentsToDollars, formatDate } from '../../Utils';
import ListTable from '@/app/ui/components/table/ListTable';
import { Budget } from '@/app/lib/models/cashflow/Budget';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';

interface BudgetsListProps {
	budgets: Budget[],
	expenses: CashFlowEntry[],
	onBudgetDeleted: () => void,
	onBudgetIsEditing: (budget: Budget) => void,
	isLoading: boolean,
	isError: boolean,
}

export default function BudgetsList(props: BudgetsListProps) {

	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteRequest<Budget>("Budgets", id);
			if (result.successful)
				props.onBudgetDeleted();
		}
	};

  function getAmountSpentInCategory(categoryId: string) {
    return props.expenses.filter(expense => expense.categoryId === categoryId).reduce((acc, expense) => acc + expense.amount, 0);
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
