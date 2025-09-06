import { DesktopListItemRow, DesktopListItemCell, TruncatedBadge, convertCentsToDollars, convertToDate, formatDate } from '@/app/components';
import { CashFlowEntry, getRecurrenceText } from '../..';

interface DesktopCashFlowEntryRowProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
	recurringOnly?: boolean;
	columnWidths: {
		date: string;
		amount: string;
		category: string;
		description: string;
		recurrence: string;
	};
	actionColumnWidth?: string;
}

export function DesktopCashFlowEntryRow(props: DesktopCashFlowEntryRowProps) {
	const handleEdit = () => props.onEdit(props.entry as CashFlowEntry);
	const handleDelete = () => props.onDelete(props.entry.id as number);
	
  return (
    <DesktopListItemRow key={props.entry.id} onEdit={handleEdit} onDelete={handleDelete} actionColumnWidth={props.actionColumnWidth}>
			<DesktopListItemCell className={props.columnWidths.date + " whitespace-nowrap"}>
				{formatDate(convertToDate(props.entry.date))}
			</DesktopListItemCell>
			<DesktopListItemCell className={props.columnWidths.amount + " whitespace-nowrap font-medium"}>
				{convertCentsToDollars(props.entry.amount)}
			</DesktopListItemCell>
			<DesktopListItemCell className={props.columnWidths.category}>
				{props.entry.category?.name && (
					<TruncatedBadge title={props.entry.category.name}>
						{props.entry.category.name}
					</TruncatedBadge>
				)}
			</DesktopListItemCell>
			<DesktopListItemCell className={props.columnWidths.description} title={props.entry.description}>
				{props.entry.description}
			</DesktopListItemCell>
			{props.recurringOnly && (
				<DesktopListItemCell className={props.columnWidths.recurrence}>
					{getRecurrenceText(props.entry)}
				</DesktopListItemCell>
			)}
		</DesktopListItemRow>
  )
}
