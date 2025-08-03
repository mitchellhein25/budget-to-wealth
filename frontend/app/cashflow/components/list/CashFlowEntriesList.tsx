'use client'

import React from 'react';
import { deleteCashFlowEntry } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';
import { CashFlowEntry, CashFlowType } from '..';
import { MobileCashFlowEntryCard } from './MobileCashFlowEntryCard';
import DesktopCashFlowEntryRow from './DesktopCashFlowEntryRow';

interface CashFlowEntriesListProps {
	entries: CashFlowEntry[],
	onEntryDeleted: () => void,
	onEntryIsEditing: (entry: CashFlowEntry) => void,
	isLoading: boolean,
	isError: boolean,
	cashFlowType: CashFlowType,
}

export default function CashFlowEntriesList(props: CashFlowEntriesListProps) {
	
	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteCashFlowEntry(id);
			if (result.successful)
				props.onEntryDeleted();
		}
	};

	// const getRecurrenceText = (entry: CashFlowEntry) => {
	// 	if (!entry.recurrenceFrequency) {
	// 		return '';
	// 	}
		
	// 	let text = entry.recurrenceFrequency === RecurrenceFrequency.Every2Weeks ? 'Every 2 Weeks' : entry.recurrenceFrequency.toString();
	// 	if (entry.recurrenceEndDate) {
	// 		text += ` until ${new Date(entry.recurrenceEndDate).toLocaleDateString()}`;
	// 	}
		
	// 	return text;
	// };

	const tableHeaderRow = (
		<tr>
			<th className="w-1/6">Date</th>
			<th className="w-1/6">Amount</th>
			<th className="w-1/5">Category</th>
			<th className="w-1/5">Description</th>
			{/* <th className="w-1/5">Recurrence</th> */}
			<th className="text-right">Actions</th>
		</tr>
	);

	const desktopRow = (entry: CashFlowEntry) => (
		<DesktopCashFlowEntryRow
			key={entry.id}
			entry={entry}
			onEdit={props.onEntryIsEditing}
			onDelete={handleDelete}
		/>
	);

	const mobileRow = (entry: CashFlowEntry) => (
		<MobileCashFlowEntryCard
			key={entry.id}
			entry={entry}
			onEdit={props.onEntryIsEditing}
			onDelete={handleDelete}
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
