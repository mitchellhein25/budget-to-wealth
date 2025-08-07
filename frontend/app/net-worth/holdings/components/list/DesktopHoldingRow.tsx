import { Holding } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

interface DesktopHoldingRowProps {
	holding: Holding;
	onEdit: (holding: Holding) => void;
	onDelete: (id: number) => void;
}

export default function DesktopHoldingRow(props: DesktopHoldingRowProps) {
	
  return (
    <tr key={props.holding.id} className="hover">
			<td className="whitespace-nowrap">
				<div className="max-w-xs truncate" title={props.holding.name}>
					{props.holding.name}
				</div>
			</td>
			<td className="whitespace-nowrap">
				{props.holding.institution && (
					<div className="max-w-xs truncate" title={props.holding.institution}>
						{props.holding.institution}
					</div>
				)}
			</td>
			<td className="whitespace-nowrap">
				{props.holding.holdingCategory?.name && (
					<span className="badge badge-primary badge-sm">
						{props.holding.holdingCategory.name}
					</span>
				)}
			</td>
			<td className="whitespace-nowrap">
				<span className={`badge badge-sm ${
					props.holding.type === 'Asset' ? 'badge-success' : 'badge-error'
				}`}>
					{props.holding.type}
				</span>
			</td>
			<td className="text-right">
				<div className="flex items-center justify-end space-x-2">
					<EditButton onClick={() => props.onEdit(props.holding as Holding)} />
					<DeleteButton onClick={() => props.onDelete(props.holding.id as number)} />
				</div>
			</td>
		</tr>
  )
}
