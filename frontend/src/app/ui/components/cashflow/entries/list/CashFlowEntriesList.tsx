'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';
import { formatCurrency } from '../../CashFlowUtils';
import TablePagination from '../../../table/TablePagination';

interface CashFlowEntriesListProps {
	entries: CashFlowEntry[],
	onEntryDeleted: () => void,
	onEntryIsEditing: (entry: CashFlowEntry) => void,
	isLoading: boolean,
	isError: boolean,
	cashFlowType: CashFlowType,
}

export default function CashFlowEntriesList(props: CashFlowEntriesListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const endpoint: string = "CashFlowEntries";
	const cashFlowTypeLowerCase: string = props.cashFlowType.toLowerCase();

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const sortedEntries = props.entries.sort((a, b) => a.date.localeCompare(b.date));
	const currentEntries = sortedEntries.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(props.entries.length / itemsPerPage);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this entry?')) {
			const result = await deleteRequest<CashFlowEntry>(endpoint, id);
			if (result.successful)
				props.onEntryDeleted();
		}
	};

	if (props.isError) {
		return (
			<p className="alert alert-error alert-soft">Failed to load {cashFlowTypeLowerCase} entries.</p>
		);
	}
	if (props.isLoading) {
		return (
			<p className="alert alert-info alert-soft">Loading {cashFlowTypeLowerCase} entries...</p>
		);
	}
	if (props.entries.length === 0) {
		return (
			<p className="alert alert-warning alert-soft">You haven’t added any {cashFlowTypeLowerCase} entries yet.</p>
		);
	}

	return (
		<div className="space-y-4 flex flex-col justify-center">
			<h2 className="text-lg text-center">{props.cashFlowType} Entries</h2>
			<table className="table w-full">
				<thead>
					<tr>
						<th className="w-1/5">Date</th>
						<th className="w-1/5">Amount</th>
						<th className="w-3/10">Category</th>
						<th className="w-3/10">Description</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{currentEntries.map((entry) => (
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
									onClick={() => props.onEntryIsEditing(entry)}
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
					))}
				</tbody>
			</table>
			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				handlePageChange={handlePageChange}
				handlePrevious={handlePrevious}
				handleNext={handleNext}
			/>
			</div>
	);
}
