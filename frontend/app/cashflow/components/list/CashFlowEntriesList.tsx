'use client'

import React, { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteCashFlowEntry } from '@/app/lib/api/data-methods';
import { convertCentsToDollars } from '@/app/components';
import { ListTable } from '@/app/components/table/ListTable';
import { CashFlowEntry, CashFlowType } from '..';

interface CashFlowEntriesListProps {
	entries: CashFlowEntry[],
	onEntryDeleted: () => void,
	onEntryIsEditing: (entry: CashFlowEntry) => void,
	isLoading: boolean,
	isError: boolean,
	cashFlowType: CashFlowType,
}

interface MobileCardProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
}

function MobileCashFlowCard({ entry, onEdit, onDelete }: MobileCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="card bg-base-100 border border-base-300 shadow-sm">
			<div className="card-body p-4">
				{/* Main card content */}
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<div className="flex items-center space-x-3 mb-2">
							<div className="text-sm font-medium text-base-content">
								{entry.date.toLocaleLowerCase('en-US')}
							</div>
							<div className="text-lg font-bold text-base-content">
								{convertCentsToDollars(entry.amount)}
							</div>
						</div>
						{entry.category?.name && (
							<span className="badge badge-primary badge-sm">
								{entry.category.name}
							</span>
						)}
					</div>
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="btn btn-ghost btn-sm"
						aria-label={isExpanded ? 'Collapse' : 'Expand'}
					>
						{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
					</button>
				</div>

				{/* Expanded content */}
				{isExpanded && (
					<div className="mt-4 pt-4 border-t border-base-300">
						{/* Description */}
						<div className="mb-4">
							<h4 className="text-sm font-medium text-base-content/70 mb-1">Description</h4>
							<p className="text-base-content">{entry.description}</p>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end space-x-2">
							<button
								onClick={() => onEdit(entry)}
								className="btn btn-ghost btn-sm text-primary hover:bg-primary hover:text-primary-content"
								aria-label="Edit"
							>
								<Pencil size={16} />
								<span className="ml-1">Edit</span>
							</button>
							<button
								onClick={() => onDelete(entry.id as number)}
								className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
								aria-label="Delete"
							>
								<Trash2 size={16} />
								<span className="ml-1">Delete</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
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

	const mobileRow = (entry: CashFlowEntry) => (
		<MobileCashFlowCard
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
			bodyRow={tableBodyRow}
			mobileRow={mobileRow}
			items={props.entries}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
