import { convertCentsToDollars, convertToDate, formatDate } from '@/app/components/Utils';
import { CashFlowEntry, CashFlowType, getRecurrenceText } from '..';
import { DesktopListItemRow, DesktopListItemCell } from '@/app/components';

interface DesktopCashFlowEntryRowProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
}

export function DesktopCashFlowEntryRow(props: DesktopCashFlowEntryRowProps) {
	const handleEdit = () => props.onEdit(props.entry as CashFlowEntry);
	const handleDelete = () => props.onDelete(props.entry.id as number);
	
  return (
    <DesktopListItemRow key={props.entry.id} onEdit={handleEdit} onDelete={handleDelete}>
			<DesktopListItemCell>
				{formatDate(convertToDate(props.entry.date))}
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
			{/* {!props.cashFlowType && (
				<DesktopListItemCell>
					{getRecurrenceText(props.entry)}
				</DesktopListItemCell>
			)} */}
		</DesktopListItemRow>
  )
}
