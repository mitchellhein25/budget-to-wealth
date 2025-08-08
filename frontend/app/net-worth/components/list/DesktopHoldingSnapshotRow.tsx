import { convertCentsToDollars } from '@/app/components/Utils';
import { HoldingSnapshot } from '..';
import { DesktopListItemRow, DesktopListItemCell } from '@/app/components';

interface DesktopHoldingSnapshotRowProps {
	snapshot: HoldingSnapshot;
	onEdit: (snapshot: HoldingSnapshot) => void;
	onDelete: (id: number) => void;
}

export function DesktopHoldingSnapshotRow(props: DesktopHoldingSnapshotRowProps) {
	const handleEdit = () => props.onEdit(props.snapshot as HoldingSnapshot);
	const handleDelete = () => props.onDelete(props.snapshot.id as number);
	
  return (
    <DesktopListItemRow key={props.snapshot.id} onEdit={handleEdit} onDelete={handleDelete}>
			<DesktopListItemCell title={`${props.snapshot.holding?.name} - ${props.snapshot.holding?.institution} - ${props.snapshot.holding?.holdingCategory?.name} (${props.snapshot.holding?.type})`}>
				{props.snapshot.holding?.name} - {props.snapshot.holding?.institution} - {props.snapshot.holding?.holdingCategory?.name} ({props.snapshot.holding?.type})
			</DesktopListItemCell>
			<DesktopListItemCell>
				{props.snapshot.date.toLocaleLowerCase('en-US')}
			</DesktopListItemCell>
			<DesktopListItemCell className="whitespace-nowrap font-medium">
				{convertCentsToDollars(props.snapshot.balance)}
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
