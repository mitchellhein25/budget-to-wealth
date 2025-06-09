'use client'

import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import { Pencil, Trash2 } from 'lucide-react';

interface IncomeEntriesListProps {
	entries: CashFlowEntry[],
	onEntryDeleted: () => void,
	onEntryIsEditing: (entry: CashFlowEntry) => void,
	isLoading: boolean,
	isError: boolean
}

export default function IncomeEntriesList(props: IncomeEntriesListProps) {
	const endpoint: string = "CashFlowEntries";
	console.log("entries: ", props.entries);
	const formatCurrency = (cents: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100);
	};

	async function handleDelete(id: number) {
		const result = await deleteRequest<CashFlowEntry>(endpoint, id);
		if (result.successful)
			props.onEntryDeleted();
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
			<ul className="list">
				{props.entries.sort((a, b) => a.date.localeCompare(b.date)).map((entry) => (
					<li key={entry.id} className="list-row">
						<div className="flex-1 mr-4">
							<span>{formatCurrency(entry.amount)}</span>
						</div>
						<div className="flex-1 mr-4">
							<span>{entry.date}</span>
						</div>
						<div className="flex-1 mr-4">
							<span>{entry.category?.name}</span>
						</div>
						<div className="flex-1 mr-4">
							<span>{entry.description}</span>
						</div>
						<div></div>
						<div className="flex space-x-2">
							<>
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
							</>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
