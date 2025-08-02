'use client'

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteCashFlowEntry } from '@/app/lib/api/data-methods';
import { convertCentsToDollars } from '@/app/components';
import { ListTable } from '@/app/components/table/ListTable';
import { CashFlowEntry, CashFlowType, RecurrenceFrequency } from '..';

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

	const getRecurrenceText = (entry: CashFlowEntry) => {
		if (!entry.recurrenceFrequency) {
			return '';
		}
		
		let text = entry.recurrenceFrequency === RecurrenceFrequency.Every2Weeks ? 'Every 2 Weeks' : entry.recurrenceFrequency.toString();
		if (entry.recurrenceEndDate) {
			text += ` until ${new Date(entry.recurrenceEndDate).toLocaleDateString()}`;
		}
		
		return text;
	};

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

	const tableBodyRow = (entry: CashFlowEntry) => (
		<tr key={entry.id} className="hover">
			<td className="whitespace-nowrap">
				{entry.date.toLocaleLowerCase('en-US')}
			</td>
			<td className="whitespace-nowrap font-medium">
				{convertCentsToDollars(entry.amount)}
			</td>
			<td className="whitespace-nowrap">
				{entry.category?.name && (
					<span className="badge badge-primary badge-sm">
						{entry.category.name}
					</span>
				)}
			</td>
			<td>
				<div className="max-w-xs truncate" title={entry.description}>
					{entry.description}
				</div>
			</td>
			{/* <td className="whitespace-nowrap">
				{getRecurrenceText(entry)}
			</td> */}
			<td className="text-right">
				<div className="flex items-center justify-end space-x-2">
					<button
						id="edit-button"
						onClick={() => props.onEntryIsEditing(entry as CashFlowEntry)}
						className="btn btn-ghost btn-xs text-primary hover:bg-primary hover:text-primary-content"
						aria-label="Edit"
					>
						<Pencil size={16} />
					</button>
					<button
						id="delete-button"
						onClick={() => handleDelete(entry.id as number)}
						className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
						aria-label="Delete"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</td>
		</tr>
	);

	return (
		<ListTable
			title={props.cashFlowType + " Entries"}
			headerRow={tableHeaderRow}
			bodyRow={tableBodyRow}
			items={props.entries}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
