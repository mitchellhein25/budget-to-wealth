import { convertCentsToDollars } from "@/app/lib/utils";
import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from "@/app/components";
import { CashFlowEntry, getRecurrenceText } from "@/app/cashflow";

interface MobileCashFlowEntryCardProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
	recurringOnly?: boolean;
}

export function MobileCashFlowEntryCard({ entry, onEdit, onDelete, recurringOnly }: MobileCashFlowEntryCardProps) {
	const handleEdit = () => onEdit(entry);
	const handleDelete = () => onDelete(entry.id as number);

	return (
		<MobileListItemCard>
			<MobileListItemCardHeader
				leftContent={
					<>
						<div className="text-sm font-medium text-base-content">
							{entry.date.toLocaleLowerCase('en-US')}
						</div>
						<div className="text-lg font-bold text-base-content">
							{convertCentsToDollars(entry.amount)}
						</div>
					</>
				}
				rightContent={
					entry.category?.name && (
						<span className="badge badge-primary badge-md">
							{entry.category.name}
						</span>
					)
				}
			/>
			<MobileListItemCardContent
				description={
					<p className="text-sm text-base-content break-words" title={recurringOnly ? entry.description + ' - ' + getRecurrenceText(entry) : entry.description}>
						{recurringOnly ? entry.description + ' - ' + getRecurrenceText(entry) : entry.description}
					</p>
				}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</MobileListItemCard>
	);
}
