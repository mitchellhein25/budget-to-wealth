import { convertCentsToDollars, convertToDate, formatDate } from '@/app/lib/utils';
import { DesktopListItemRow, DesktopListItemCell } from '@/app/components';
import { getHoldingSnapshotDisplayName, HoldingSnapshot } from '@/app/net-worth/holding-snapshots';

interface DesktopHoldingSnapshotRowProps {
	snapshot: HoldingSnapshot;
	onEdit: (snapshot: HoldingSnapshot) => void;
	onDelete: (id: number) => void;
  onUpdate?: (snapshot: HoldingSnapshot) => void;
}

export function DesktopHoldingSnapshotRow(props: DesktopHoldingSnapshotRowProps) {
	const handleEdit = () => props.onEdit(props.snapshot as HoldingSnapshot);
	const handleDelete = () => props.onDelete(props.snapshot.id as number);
  const handleUpdate = () => props.onUpdate && props.onUpdate(props.snapshot as HoldingSnapshot);
	
  return (
    <DesktopListItemRow
      key={props.snapshot.id}
      onEdit={handleEdit}
      onDelete={handleDelete}
      customActionButton={<button className="btn btn-sm" onClick={handleUpdate}>Update</button>}
    >
			<DesktopListItemCell title={getHoldingSnapshotDisplayName(props.snapshot)}>
				{getHoldingSnapshotDisplayName(props.snapshot)}
			</DesktopListItemCell>
			<DesktopListItemCell>
				{formatDate(convertToDate(props.snapshot.date))}
			</DesktopListItemCell>
			<DesktopListItemCell className="whitespace-nowrap font-medium">
				{convertCentsToDollars(props.snapshot.balance)}
			</DesktopListItemCell>
		</DesktopListItemRow>
  )
}
