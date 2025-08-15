import { Holding } from "..";
import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from "@/app/components";

interface MobileHoldingCardProps {
	holding: Holding;
	onEdit: (holding: Holding) => void;
	onDelete: (id: number) => void;
}

export function MobileHoldingCard({ holding, onEdit, onDelete }: MobileHoldingCardProps) {
	const handleEdit = () => onEdit(holding);
	const handleDelete = () => onDelete(holding.id as number);

	return (
		<MobileListItemCard>
			<MobileListItemCardHeader
				leftContent={
					<>
						<div className="text-lg font-bold text-base-content">
							{holding.name}
						</div>
						<span className={`badge badge-md ${
							holding.type === 'Asset' ? 'badge-success' : 'badge-error'
						}`}>
							{holding.type}
						</span>
					</>
				}
				rightContent={
					holding.holdingCategory?.name && (
						<span className="badge badge-primary badge-md">
							{holding.holdingCategory.name}
						</span>
					)
				}
			/>
			<MobileListItemCardContent
				description={
					holding.institution && (
						<p className="text-sm text-base-content break-words" title={holding.institution}>
							{holding.institution}
						</p>
					)
				}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</MobileListItemCard>
	);
}
