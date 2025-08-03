import { convertCentsToDollars } from "@/app/components";
import { CashFlowEntry } from "..";
import { EditButton, DeleteButton } from "@/app/components/buttons";

interface MobileCashFlowEntryCardProps {
	entry: CashFlowEntry;
	onEdit: (entry: CashFlowEntry) => void;
	onDelete: (id: number) => void;
}

export function MobileCashFlowEntryCard({ entry, onEdit, onDelete }: MobileCashFlowEntryCardProps) {
	return (
		<div className="card bg-base-100 border border-base-300 shadow-sm">
			<div className="card-body p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-3">
						<div className="text-sm font-medium text-base-content">
							{entry.date.toLocaleLowerCase('en-US')}
						</div>
						<div className="text-lg font-bold text-base-content">
							{convertCentsToDollars(entry.amount)}
						</div>
					</div>
					{entry.category?.name && (
						<span className="badge badge-primary badge-md">
							{entry.category.name}
						</span>
					)}
				</div>

				<div className="flex items-center justify-between">
					<div className="flex-1 mr-4">
						<p className="text-sm text-base-content truncate" title={entry.description}>
							{entry.description}
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<EditButton onClick={() => onEdit(entry)} />
						<DeleteButton onClick={() => onDelete(entry.id as number)} />
					</div>
				</div>
			</div>
		</div>
	);
}
