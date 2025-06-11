'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface IncomeEntriesListProps {
	entries: CashFlowEntry[],
	onEntryDeleted: () => void,
	onEntryIsEditing: (entry: CashFlowEntry) => void,
	isLoading: boolean,
	isError: boolean
}

export default function IncomeEntriesList(props: IncomeEntriesListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const endpoint: string = "CashFlowEntries";
	
	const formatCurrency = (cents: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100);
	};

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
			<p className="alert alert-error alert-soft">Failed to load income entries.</p>
		);
	}

	if (props.entries.length === 0) {
		return (
			<p className="alert alert-warning alert-soft">You haven’t added any income entries yet.</p>
		);
	}

	return (
		<div className="space-y-4 flex flex-col justify-center">
			<h2 className="text-lg text-center">Income Entries</h2>
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
			{totalPages > 1 && (
				<div className="flex justify-center items-center space-x-2 mt-4">
					<button
						onClick={handlePrevious}
						disabled={currentPage === 1}
						className="btn btn-outline"
					>
						Previous
					</button>

					<div className="flex space-x-1">
						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter((pageNumber) => {
								if (pageNumber === 1 || pageNumber === totalPages) return true;
								if (
									pageNumber >= currentPage - 2 &&
									pageNumber <= currentPage + 2
								)
									return true;
								return false;
							})
							.map((pageNumber, index, filteredPages) => {
								const prevPage = filteredPages[index - 1];
								const shouldShowEllipsis = prevPage && pageNumber !== prevPage + 1;

								return (
									<React.Fragment key={pageNumber}>
										{shouldShowEllipsis && <span className="px-2">...</span>}
										<button
											onClick={() => handlePageChange(pageNumber)}
											className={`btn btn-square ${
												currentPage === pageNumber ? 'btn-primary' : 'btn-outline'
											}`}
										>
											{pageNumber}
										</button>
									</React.Fragment>
								);
							})}
					</div>

					<button
						onClick={handleNext}
						disabled={currentPage === totalPages}
						className="btn btn-outline"
					>
						Next
					</button>
				</div>
			)}		
		</div>
	);
}
