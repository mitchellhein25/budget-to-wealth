import { convertCentsToDollars } from '@/app/components';
import { HoldingSnapshot } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

interface DesktopHoldingSnapshotRowProps {
	snapshot: HoldingSnapshot;
	onEdit: (snapshot: HoldingSnapshot) => void;
	onDelete: (id: number) => void;
}

export default function DesktopHoldingSnapshotRow(props: DesktopHoldingSnapshotRowProps) {
	
  return (
    <tr key={props.snapshot.id} className="hover">
			<td className="whitespace-nowrap">
				<div className="max-w-xs truncate" title={`${props.snapshot.holding?.name} - ${props.snapshot.holding?.institution} - ${props.snapshot.holding?.holdingCategory?.name} (${props.snapshot.holding?.type})`}>
					{props.snapshot.holding?.name} - {props.snapshot.holding?.institution} - {props.snapshot.holding?.holdingCategory?.name} ({props.snapshot.holding?.type})
				</div>
			</td>
			<td className="whitespace-nowrap">
				{props.snapshot.date.toLocaleLowerCase('en-US')}
			</td>
			<td className="whitespace-nowrap font-medium">
				{convertCentsToDollars(props.snapshot.balance)}
			</td>
			<td className="text-right">
				<div className="flex items-center justify-end space-x-2">
					<EditButton onClick={() => props.onEdit(props.snapshot as HoldingSnapshot)} />
					<DeleteButton onClick={() => props.onDelete(props.snapshot.id as number)} />
				</div>
			</td>
		</tr>
  )
}
