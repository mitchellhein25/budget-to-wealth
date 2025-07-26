'use client'

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { convertCentsToDollars } from '@/app/components';
import { HOLDING_SNAPSHOT_ITEM_NAME, HoldingSnapshot } from '@/app/net-worth/components';
import { deleteHoldingSnapshot } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';

type HoldingSnapshotsListProps = {
	snapshots: HoldingSnapshot[],
	onSnapshotDeleted: () => void,
	onSnapshotIsEditing: (snapshot: HoldingSnapshot) => void,
	isLoading: boolean,
	isError: boolean
}

export function HoldingSnapshotsList(props: HoldingSnapshotsListProps) {

	async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteHoldingSnapshot(id);
			if (result.successful)
				props.onSnapshotDeleted();
		}
	};

	const tableHeaderRow = (
		<tr>
			<th className="w-3/10">Holding</th>
			<th className="w-1/5">Date</th>
			<th className="w-1/5">Balance</th>
			<th></th>
		</tr>
	);

	const tableBodyRow = (snapshot: HoldingSnapshot) => (
		<tr key={snapshot.id}>
			<td className="flex-1">
				{snapshot.holding?.name} - {snapshot.holding?.institution} - {snapshot.holding?.holdingCategory?.name} ({snapshot.holding?.type})
			</td>
			<td className="flex-1">
				{snapshot.date.toLocaleLowerCase('en-US')}
			</td>
			<td className="flex-1">
				{convertCentsToDollars(snapshot.balance)}
			</td>
			<td className="flex space-x-2">
				<button
					id="edit-button"
					onClick={() => props.onSnapshotIsEditing(snapshot)}
					className="p-1 hover:text-primary"
					aria-label="Edit"
				>
					<Pencil size={16} />
				</button>
				<button
					id="delete-button"
					onClick={() => handleDelete(snapshot.id as number)}
					className="p-1 hover:text-error"
					aria-label="Delete"
				>
					<Trash2 size={16} />
				</button>
			</td>
		</tr>
	);

	return (
		<ListTable
			title={`${HOLDING_SNAPSHOT_ITEM_NAME}s`}
			headerRow={tableHeaderRow}
			bodyRow={tableBodyRow}
			items={props.snapshots}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
