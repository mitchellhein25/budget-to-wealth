import { convertCentsToDollars } from "@/app/components";
import { HoldingSnapshot } from "..";
import { EditButton, DeleteButton } from "@/app/components/buttons";

interface MobileHoldingSnapshotCardProps {
	snapshot: HoldingSnapshot;
	onEdit: (snapshot: HoldingSnapshot) => void;
	onDelete: (id: number) => void;
}

export function MobileHoldingSnapshotCard({ snapshot, onEdit, onDelete }: MobileHoldingSnapshotCardProps) {
	return (
		<div className="card bg-base-100 border border-base-300 shadow-sm">
			<div className="card-body p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-3">
						<div className="text-sm font-medium text-base-content">
							{snapshot.date.toLocaleLowerCase('en-US')}
						</div>
						<div className="text-lg font-bold text-base-content">
							{convertCentsToDollars(snapshot.balance)}
						</div>
					</div>
					{snapshot.holding?.holdingCategory?.name && (
						<span className="badge badge-primary badge-md">
							{snapshot.holding.holdingCategory.name}
						</span>
					)}
				</div>

				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<p className="text-sm text-base-content break-words" title={`${snapshot.holding?.name} - ${snapshot.holding?.institution} (${snapshot.holding?.type})`}>
							{snapshot.holding?.name} - {snapshot.holding?.institution} ({snapshot.holding?.type})
						</p>
					</div>
					<div className="flex items-center space-x-2 flex-shrink-0">
						<EditButton onClick={() => onEdit(snapshot)} />
						<DeleteButton onClick={() => onDelete(snapshot.id as number)} />
					</div>
				</div>
			</div>
		</div>
	);
}
