'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { CashFlowEntry } from '@/app/lib/models/cashflow/CashFlowEntry';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType';
import { formatCurrency } from '../../CashFlowUtils';
import ListTable, { ListTableItem } from '../../../table/ListTable';

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
			const result = await deleteRequest<CashFlowEntry>("CashFlowEntries", id);
			if (result.successful)
				props.onEntryDeleted();
		}
	};

	const tableHeaderRow = (
		<tr>
			<th className="w-1/5">Date</th>
			<th className="w-1/5">Amount</th>
			<th className="w-3/10">Category</th>
			<th className="w-3/10">Description</th>
			<th></th>
		</tr>
	);

	const tableBodyRow = (entry: CashFlowEntry) => (
		<tr key={entry.id}>
			<td className="flex-1">
				{entry.date.toLocaleLowerCase('en-US')}
			</td>
			<td className="flex-1">
				{formatCurrency(entry.amount)}
			</td>
			<td className="flex-1">
				{entry.category?.name}
			</td>
			<td className="flex-1">
				{entry.description}
			</td>
			<td className="flex space-x-2">
				<button
					id="edit-button"
					onClick={() => props.onEntryIsEditing(entry as CashFlowEntry)}
					className="p-1 hover:text-primary"
					aria-label="Edit"
				>
					<Pencil size={16} />
				</button>
				<button
					id="delete-button"
					onClick={() => handleDelete(entry.id as number)}
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
			title={props.cashFlowType + " Entries"}
			headerRow={tableHeaderRow}
			bodyRow={tableBodyRow}
			items={props.entries}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
