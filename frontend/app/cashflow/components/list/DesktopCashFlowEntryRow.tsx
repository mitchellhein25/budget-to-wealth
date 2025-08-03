import { convertCentsToDollars } from '@/app/components';
import { CashFlowEntry } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

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
					<EditButton onClick={() => props.onEdit(props.entry as CashFlowEntry)} />
					<DeleteButton onClick={() => props.onDelete(props.entry.id as number)} />
				</div>
			</td>
		</tr>
  )
}
