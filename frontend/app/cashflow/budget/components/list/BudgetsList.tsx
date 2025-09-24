'use client'

import React from 'react';
import { archiveBudget } from '@/app/lib/api';
import { ListTable, DeleteConfirmationModal } from '@/app/components';
import { useDeleteConfirmation } from '@/app/hooks';
import { CashFlowEntry } from '@/app/cashflow';
import { BUDGET_ITEM_NAME, Budget, DesktopBudgetRow, MobileBudgetCard } from '@/app/cashflow/budget';

interface BudgetsListProps {
	budgets: Budget[],
	expenses: CashFlowEntry[],
	onBudgetDeleted: () => void,
	onBudgetIsEditing: (budget: Budget) => void,
	isLoading: boolean,
	isError: boolean,
}

export function BudgetsList(props: BudgetsListProps) {

	const {
		isModalOpen,
		isLoading: isDeleting,
		openDeleteModal,
		closeDeleteModal,
		confirmDelete
	} = useDeleteConfirmation({
		deleteFunction: archiveBudget,
		onSuccess: props.onBudgetDeleted
	});

	const columnWidths = {
		category: "w-4/12",
		amount: "w-2/12",
		spent: "w-2/12",
		remaining: "w-2/12",
		actions: "w-2/12"
	};

	const tableHeaderRow = (
		<tr>
			<th className={columnWidths.category}>Category</th>
			<th className={columnWidths.amount}>Amount</th>
      <th className={columnWidths.spent}>Spent</th>
      <th className={columnWidths.remaining}>Remaining</th>
			<th className={columnWidths.actions + " text-center"}>Actions</th>
		</tr>
	);

	const desktopRow = (budget: Budget) => (
		<DesktopBudgetRow
			key={budget.id}
			budget={budget}
			expenses={props.expenses}
			onEdit={props.onBudgetIsEditing}
			onDelete={openDeleteModal}
			columnWidths={columnWidths}
		/>
	);

	const mobileRow = (budget: Budget) => (
		<MobileBudgetCard
			key={budget.id}
			budget={budget}
			expenses={props.expenses}
			onEdit={props.onBudgetIsEditing}
			onDelete={openDeleteModal}
		/>
	);

	return (
		<>
			<ListTable
				title={`${BUDGET_ITEM_NAME}s`}
				headerRow={tableHeaderRow}
				bodyRow={desktopRow}
				mobileRow={mobileRow}
				items={props.budgets}
				isError={props.isError}
				isLoading={props.isLoading}
			/>
			<DeleteConfirmationModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Budget"
				message="Are you sure you want to delete this budget? This action cannot be undone."
			/>
		</>
	);
}
