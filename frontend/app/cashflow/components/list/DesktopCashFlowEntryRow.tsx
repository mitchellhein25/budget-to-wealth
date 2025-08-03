import { convertCentsToDollars } from '@/app/components';
import { CashFlowEntry } from '..';
import { Pencil, Trash2 } from 'lucide-react';

interface DesktopCashFlowEntryRowProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
}

export default function DesktopCashFlowEntryRow(props: DesktopCashFlowEntryRowProps) {
	
  return (
    <tr key={props.entry.id} className="hover">
			<td className="whitespace-nowrap">
				{props.entry.date.toLocaleLowerCase('en-US')}
			</td>
			<td className="whitespace-nowrap font-medium">
				{convertCentsToDollars(props.entry.amount)}
			</td>
			<td className="whitespace-nowrap">
				{props.entry.category?.name && (
					<span className="badge badge-primary badge-sm">
						{props.entry.category.name}
					</span>
				)}
			</td>
			<td>
				<div className="max-w-xs truncate" title={props.entry.description}>
					{props.entry.description}
				</div>
			</td>
			{/* <td className="whitespace-nowrap">
				{getRecurrenceText(entry)}
			</td> */}
			<td className="text-right">
				<div className="flex items-center justify-end space-x-2">
					<button
						id="edit-button"
						onClick={() => props.onEdit(props.entry as CashFlowEntry)}
						className="btn btn-ghost btn-xs text-primary hover:bg-primary hover:text-primary-content"
						aria-label="Edit"
					>
						<Pencil size={16} />
					</button>
					<button
						id="delete-button"
						onClick={() => props.onDelete(props.entry.id as number)}
						className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
						aria-label="Delete"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</td>
		</tr>
  )
}
