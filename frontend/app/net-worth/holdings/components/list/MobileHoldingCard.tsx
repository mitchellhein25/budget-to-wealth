import { Holding } from "..";
import { EditButton, DeleteButton } from "@/app/components/buttons";

interface MobileHoldingCardProps {
	holding: Holding;
	onEdit: (holding: Holding) => void;
	onDelete: (id: number) => void;
}

export function MobileHoldingCard({ holding, onEdit, onDelete }: MobileHoldingCardProps) {
	return (
		<div className="card bg-base-100 border border-base-300 shadow-sm">
			<div className="card-body p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-3">
						<div className="text-lg font-bold text-base-content">
							{holding.name}
						</div>
						<span className={`badge badge-md ${
							holding.type === 'Asset' ? 'badge-success' : 'badge-error'
						}`}>
							{holding.type}
						</span>
					</div>
					{holding.holdingCategory?.name && (
						<span className="badge badge-primary badge-md">
							{holding.holdingCategory.name}
						</span>
					)}
				</div>

				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						{holding.institution && (
							<p className="text-sm text-base-content break-words" title={holding.institution}>
								{holding.institution}
							</p>
						)}
					</div>
					<div className="flex items-center space-x-2 flex-shrink-0">
						<EditButton onClick={() => onEdit(holding)} />
						<DeleteButton onClick={() => onDelete(holding.id as number)} />
					</div>
				</div>
			</div>
		</div>
	);
}
