import { convertCentsToDollars } from "@/app/components/Utils";
import { HoldingSnapshot } from "..";
import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from "@/app/components";

interface MobileHoldingSnapshotCardProps {
	snapshot: HoldingSnapshot;
	onEdit: (snapshot: HoldingSnapshot) => void;
	onDelete: (id: number) => void;
}

export function MobileHoldingSnapshotCard({ snapshot, onEdit, onDelete }: MobileHoldingSnapshotCardProps) {
	const handleEdit = () => onEdit(snapshot);
	const handleDelete = () => onDelete(snapshot.id as number);

	return (
		<MobileListItemCard>
			<MobileListItemCardHeader
				leftContent={
					<>
						<div className="text-sm font-medium text-base-content">
							{snapshot.date.toLocaleLowerCase('en-US')}
						</div>
						<div className="text-lg font-bold text-base-content">
							{convertCentsToDollars(snapshot.balance)}
						</div>
					</>
				}
				rightContent={
					snapshot.holding?.holdingCategory?.name && (
						<span className="badge badge-primary badge-md">
							{snapshot.holding.holdingCategory.name}
						</span>
					)
				}
			/>
			<MobileListItemCardContent
				description={
					<p className="text-sm text-base-content break-words" title={`${snapshot.holding?.name} - ${snapshot.holding?.institution} (${snapshot.holding?.type})`}>
						{snapshot.holding?.name} - {snapshot.holding?.institution} ({snapshot.holding?.type})
					</p>
				}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</MobileListItemCard>
	);
}
