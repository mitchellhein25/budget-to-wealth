import React from 'react'
import { deleteHolding } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';
import { HOLDING_ITEM_NAME, Holding } from '..';
import { MobileHoldingCard } from './MobileHoldingCard';
import { DesktopHoldingRow } from './DesktopHoldingRow';

type HoldingsListProps = {
  holdings: Holding[],
  onHoldingDeleted: () => void,
  onHoldingIsEditing: (holding: Holding) => void,
  isLoading: boolean,
	isError: boolean
}

export function HoldingsList(props: HoldingsListProps) {
  const tableHeaderRow = (
    <tr>
      <th className="w-1/5">Name</th>
      <th className="w-1/5">Institution</th>
      <th className="w-2/5">Category</th>
      <th className="w-1/5">Type</th>
      <th className="w-20 text-right">Actions</th>
    </tr>
  );

  async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteHolding(id);
			if (result.successful)
      props.onHoldingDeleted();
		}
	};

  const desktopRow = (holding: Holding) => (
    <DesktopHoldingRow
      key={holding.id}
      holding={holding}
      onEdit={props.onHoldingIsEditing}
      onDelete={handleDelete}
    />
  );

  const mobileRow = (holding: Holding) => (
    <MobileHoldingCard
      key={holding.id}
      holding={holding}
      onEdit={props.onHoldingIsEditing}
      onDelete={handleDelete}
    />
  );

  return (
    <ListTable
      items={props.holdings}
      bodyRow={desktopRow}
      mobileRow={mobileRow}
      headerRow={tableHeaderRow}
      isLoading={props.isLoading}
      isError={props.isError}
      title={`${HOLDING_ITEM_NAME}s`}
    />
  )
}

