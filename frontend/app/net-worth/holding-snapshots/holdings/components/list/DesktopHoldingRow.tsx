import { Holding } from '..';
import { DesktopListItemRow, DesktopListItemCell } from '@/app/components';

interface DesktopHoldingRowProps {
	holding: Holding;
	onEdit: (holding: Holding) => void;
	onDelete: (id: number) => void;
}

export function DesktopHoldingRow(props: DesktopHoldingRowProps) {
	const handleEdit = () => props.onEdit(props.holding as Holding);
	const handleDelete = () => props.onDelete(props.holding.id as number);
	
  return (
    <DesktopListItemRow key={props.holding.id} onEdit={handleEdit} onDelete={handleDelete}>
			<DesktopListItemCell title={props.holding.name}>
				{props.holding.name}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{props.holding.institution && (
					<div className="max-w-xs truncate" title={props.holding.institution}>
						{props.holding.institution}
					</div>
				)}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{props.holding.holdingCategory?.name && (
					<span className="badge badge-primary badge-sm">
						{props.holding.holdingCategory.name}
					</span>
				)}
			</DesktopListItemCell>
			<DesktopListItemCell>
				<span className={`badge badge-sm ${
					props.holding.type === 'Asset' ? 'badge-success' : 'badge-error'
				}`}>
					{props.holding.type}
				</span>
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
