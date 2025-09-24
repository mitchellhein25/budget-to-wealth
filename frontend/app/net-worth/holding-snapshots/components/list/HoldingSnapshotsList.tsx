'use client'

import React from 'react';
import { deleteHoldingSnapshot } from '@/app/lib/api';
import { ListTable, DeleteConfirmationModal } from '@/app/components';
import { useDeleteConfirmation } from '@/app/hooks';
import { DesktopHoldingSnapshotRow, HOLDING_SNAPSHOT_ITEM_NAME, HoldingSnapshot, MobileHoldingSnapshotCard } from '@/app/net-worth/holding-snapshots';

type HoldingSnapshotsListProps = {
	snapshots: HoldingSnapshot[],
	onSnapshotDeleted: () => void,
	onSnapshotIsEditing: (snapshot: HoldingSnapshot) => void,
	isLoading: boolean,
  isError: boolean
}

export function HoldingSnapshotsList(props: HoldingSnapshotsListProps) {

	const {
		isModalOpen,
		isLoading: isDeleting,
		openDeleteModal,
		closeDeleteModal,
		confirmDelete
	} = useDeleteConfirmation({
		deleteFunction: deleteHoldingSnapshot,
		onSuccess: props.onSnapshotDeleted
	});

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
			onDelete={openDeleteModal}
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
			onDelete={openDeleteModal}
		/>
	);

	return (
		<>
			<ListTable
				title={`${HOLDING_SNAPSHOT_ITEM_NAME}s`}
				headerRow={tableHeaderRow}
				bodyRow={desktopRow}
				mobileRow={mobileRow}
				items={props.snapshots}
				isError={props.isError}
				isLoading={props.isLoading}
			/>
			<DeleteConfirmationModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Snapshot"
				message="Are you sure you want to delete this snapshot? This action cannot be undone."
			/>
		</>
	);
}
