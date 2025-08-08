import { convertCentsToDollars } from '@/app/components';
import { CashFlowEntry } from '..';
import { DesktopListItemRow, DesktopListItemCell } from '@/app/components';

interface DesktopCashFlowEntryRowProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
}

export default function DesktopCashFlowEntryRow(props: DesktopCashFlowEntryRowProps) {
	const handleEdit = () => props.onEdit(props.entry as CashFlowEntry);
	const handleDelete = () => props.onDelete(props.entry.id as number);
	
  return (
    <DesktopListItemRow key={props.entry.id} onEdit={handleEdit} onDelete={handleDelete}>
			<DesktopListItemCell>
				{props.entry.date.toLocaleLowerCase('en-US')}
			</DesktopListItemCell>
			<DesktopListItemCell className="whitespace-nowrap font-medium">
				{convertCentsToDollars(props.entry.amount)}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{props.entry.category?.name && (
					<span className="badge badge-primary badge-sm">
						{props.entry.category.name}
					</span>
				)}
			</DesktopListItemCell>
			<DesktopListItemCell title={props.entry.description}>
				{props.entry.description}
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
