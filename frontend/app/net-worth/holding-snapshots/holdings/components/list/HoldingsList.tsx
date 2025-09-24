import React from 'react'
import { deleteHolding } from '@/app/lib/api';
import { ListTable, DeleteConfirmationModal } from '@/app/components';
import { useDeleteConfirmation } from '@/app/hooks';
import { HOLDING_ITEM_NAME, Holding, DesktopHoldingRow, MobileHoldingCard } from '@/app/net-worth/holding-snapshots/holdings';

type HoldingsListProps = {
  holdings: Holding[],
  onHoldingDeleted: () => void,
  onHoldingIsEditing: (holding: Holding) => void,
  isLoading: boolean,
	isError: boolean
}

export function HoldingsList(props: HoldingsListProps) {
  const {
		isModalOpen,
		isLoading: isDeleting,
		openDeleteModal,
		closeDeleteModal,
		confirmDelete
	} = useDeleteConfirmation({
		deleteFunction: deleteHolding,
		onSuccess: props.onHoldingDeleted
	});

  const tableHeaderRow = (
    <tr>
      <th className="w-1/5">Name</th>
      <th className="w-1/5">Institution</th>
      <th className="w-2/5">Category</th>
      <th className="w-1/5">Type</th>
      <th className="w-20 text-right">Actions</th>
    </tr>
  );

  const desktopRow = (holding: Holding) => (
    <DesktopHoldingRow
      key={holding.id}
      holding={holding}
      onEdit={props.onHoldingIsEditing}
      onDelete={openDeleteModal}
    />
  );

  const mobileRow = (holding: Holding) => (
    <MobileHoldingCard
      key={holding.id}
      holding={holding}
      onEdit={props.onHoldingIsEditing}
      onDelete={openDeleteModal}
    />
  );

  return (
    <>
      <ListTable
        items={props.holdings}
        bodyRow={desktopRow}
        mobileRow={mobileRow}
        headerRow={tableHeaderRow}
        isLoading={props.isLoading}
        isError={props.isError}
        title={`${HOLDING_ITEM_NAME}s`}
      />
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Holding"
        message="Are you sure you want to delete this holding? This action cannot be undone."
      />
    </>
  )
}

