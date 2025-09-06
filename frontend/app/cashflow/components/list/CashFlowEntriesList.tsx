'use client'

import React from 'react';
import { deleteCashFlowEntry } from '@/app/lib/api';
import { ListTable } from '@/app/components';
import { CashFlowEntry, CashFlowType, DesktopCashFlowEntryRow, MobileCashFlowEntryCard } from '@/app/cashflow';

interface CashFlowEntriesListProps {
	entries: CashFlowEntry[],
	onEntryDeleted: () => void,
	onEntryIsEditing: (entry: CashFlowEntry) => void,
	isLoading: boolean,
	isError: boolean,
	cashFlowType: CashFlowType,
	recurringOnly?: boolean,
}

export function CashFlowEntriesList(props: CashFlowEntriesListProps) {
	
	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteCashFlowEntry(id);
			if (result.successful)
				props.onEntryDeleted();
		}
	};

	const columnWidths = {
		date: "w-2/12",
		amount: "w-2/12", 
		category: "w-2/12",
		description: "w-4/12",
		recurrence: "w-1/12",
		actions: "w-1/12"
	};

	const tableHeaderRow = (
		<tr>
			<th className={columnWidths.date}>Date</th>
			<th className={columnWidths.amount}>Amount</th>
			<th className={columnWidths.category}>Category</th>
			<th className={columnWidths.description}>Description</th>
			{props.recurringOnly && <th className={columnWidths.recurrence}>Recurrence</th>}
			<th className={columnWidths.actions + " text-center"}>Actions</th>
		</tr>
	);

	const desktopRow = (entry: CashFlowEntry) => (
		<DesktopCashFlowEntryRow
			key={entry.id}
			entry={entry}
			columnWidths={columnWidths}
			onEdit={props.onEntryIsEditing}
			onDelete={handleDelete}
			recurringOnly={props.recurringOnly}
			actionColumnWidth={columnWidths.actions}
		/>
	);

	const mobileRow = (entry: CashFlowEntry) => (
		<MobileCashFlowEntryCard
			key={entry.id}
			entry={entry}
			onEdit={props.onEntryIsEditing}
			onDelete={handleDelete}
			recurringOnly={props.recurringOnly}
		/>
	);

	return (
		<ListTable
			title={props.cashFlowType + " Entries"}
			headerRow={tableHeaderRow}
			bodyRow={desktopRow}
			mobileRow={mobileRow}
			items={props.entries}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
