'use client'

import React from 'react';
import { HOLDING_SNAPSHOT_ITEM_NAME, HoldingSnapshot } from '@/app/net-worth/components';
import { deleteHoldingSnapshot } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';
import { MobileHoldingSnapshotCard } from './MobileHoldingSnapshotCard';
import { DesktopHoldingSnapshotRow } from './DesktopHoldingSnapshotRow';

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
			<th className="text-right">Actions</th>
		</tr>
	);

	const desktopRow = (snapshot: HoldingSnapshot) => (
		<DesktopHoldingSnapshotRow
			key={snapshot.id}
			snapshot={snapshot}
			onEdit={props.onSnapshotIsEditing}
			onDelete={handleDelete}
      onUpdate={(s) => {
        const todayIso = new Date().toISOString();
        props.onSnapshotIsEditing({ ...s, id: undefined, date: todayIso, balance: 0 } as HoldingSnapshot);
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
