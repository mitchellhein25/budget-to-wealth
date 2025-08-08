'use client'

import React from 'react';
import { ListTable } from '@/app/components/table/ListTable';
import { CashFlowEntry } from '@/app/cashflow/components';
import { deleteBudget } from '@/app/lib/api/data-methods';
import { BUDGET_ITEM_NAME, Budget } from '..';
import { DesktopBudgetRow } from './DesktopBudgetRow';
import { MobileBudgetCard } from './MobileBudgetCard';

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



	const tableHeaderRow = (
		<tr>
			<th className="w-1/6">Category</th>
			<th className="w-1/6">Amount</th>
      <th className="w-1/6">Spent</th>
      <th className="w-1/6">Remaining</th>
			<th className="w-1/6">Status</th>
			<th className="w-1/6 text-right">Actions</th>
		</tr>
	);

	const desktopRow = (budget: Budget) => (
		<DesktopBudgetRow
			key={budget.id}
			budget={budget}
			expenses={props.expenses}
			onEdit={props.onBudgetIsEditing}
			onDelete={handleDelete}
		/>
	);

	const mobileRow = (budget: Budget) => (
		<MobileBudgetCard
			key={budget.id}
			budget={budget}
			expenses={props.expenses}
			onEdit={props.onBudgetIsEditing}
			onDelete={handleDelete}
		/>
	);

	return (
		<ListTable
			title={`${BUDGET_ITEM_NAME}s`}
			headerRow={tableHeaderRow}
			bodyRow={desktopRow}
			mobileRow={mobileRow}
			items={props.budgets}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
