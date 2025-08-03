import React from 'react'
import { deleteHolding } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';
import { HOLDING_ITEM_NAME, Holding } from '..';
import { EditButton, DeleteButton } from '@/app/components/buttons';

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
      <th></th>
    </tr>
  );

  async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteHolding(id);
			if (result.successful)
      props.onHoldingDeleted();
		}
	};

  const tableBodyRow = (holding: Holding) => (
    <tr key={holding.id}>
      <td className="flex-1">
        {holding.name}
      </td>
      <td className="flex-1">
        {holding.institution}
      </td>
      <td className="flex-1">
        {holding.holdingCategory?.name}
      </td>
      <td className="flex-1">
        {holding.type}
      </td>
      <td className="flex space-x-2">
        <EditButton 
          onClick={() => props.onHoldingIsEditing(holding)}
          className="p-1 hover:text-primary"
        />
        <DeleteButton 
          onClick={() => handleDelete(holding.id as number)}
          className="p-1 hover:text-error"
        />
      </td>
    </tr>
  );

  return (
    <ListTable
      items={props.holdings}
      bodyRow={tableBodyRow}
      headerRow={tableHeaderRow}
      isLoading={props.isLoading}
      isError={props.isError}
      title={`${HOLDING_ITEM_NAME}s`}
    />
  )
}

