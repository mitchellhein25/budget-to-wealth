'use client'

import React from 'react';
import { deleteHoldingSnapshot } from '@/app/lib/api';
import { ListTable } from '@/app/components';
import { DesktopHoldingSnapshotRow, HOLDING_SNAPSHOT_ITEM_NAME, HoldingSnapshot, MobileHoldingSnapshotCard } from '@/app/net-worth/holding-snapshots';

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

	const columnWidths = {
		holding: "w-6/12",
		date: "w-2/12",
		balance: "w-2/12",
		actions: "w-2/12"
	};

	const tableHeaderRow = (
		<tr>
			<th className={columnWidths.holding}>Holding</th>
			<th className={columnWidths.date}>Date</th>
			<th className={columnWidths.balance}>Balance</th>
			<th className={columnWidths.actions + " text-right"}>Actions</th>
		</tr>
	);

	const desktopRow = (snapshot: HoldingSnapshot) => (
		<DesktopHoldingSnapshotRow
			key={snapshot.id}
			snapshot={snapshot}
			columnWidths={columnWidths}
			onEdit={props.onSnapshotIsEditing}
			onDelete={handleDelete}
      onUpdate={(s) => {
        const todayIso = new Date().toISOString();
        props.onSnapshotIsEditing({ ...s, id: undefined, date: todayIso } as HoldingSnapshot);
      }}
		/>
	);

	const mobileRow = (snapshot: HoldingSnapshot) => (
		<MobileHoldingSnapshotCard
			key={snapshot.id}
			snapshot={snapshot}
			onEdit={props.onSnapshotIsEditing}
			onDelete={handleDelete}
		/>
	);

	return (
		<ListTable
			title={`${HOLDING_SNAPSHOT_ITEM_NAME}s`}
			headerRow={tableHeaderRow}
			bodyRow={desktopRow}
			mobileRow={mobileRow}
			items={props.snapshots}
			isError={props.isError}
			isLoading={props.isLoading}
		/>	
	);
}
