import { Holding } from '@/app/lib/models/net-worth/Holding';
import React from 'react'
import { MessageState } from '../../../Utils';
import { Pencil, Trash2 } from 'lucide-react';
import ListTable from '../../../table/ListTable';
import { deleteRequest } from '@/app/lib/api/rest-methods/deleteRequest';

type HoldingsListProps = {
  holdings: Holding[],
  isLoading: boolean,
  message: MessageState,
  onHoldingDeleted: () => void,
  onHoldingIsEditing: (holding: Holding) => void,
}

export default function HoldingsList(props: HoldingsListProps) {
  const tableHeaderRow = (
    <tr>
      <th className="w-1/5">Name</th>
      <th className="w-1/5">Type</th>
      <th className="w-3/10">Category</th>
      <th></th>
    </tr>
  );

  const tableBodyRow = (holding: Holding) => (
    <tr key={holding.id}>
      <td className="flex-1">
        {holding.name}
      </td>
      <td className="flex-1">
        {holding.holdingCategory?.name}
      </td>
      <td className="flex-1">
        {holding.type}
      </td>
      <td className="flex space-x-2">
        <button
          id="edit-button"
          onClick={() => props.onHoldingIsEditing(holding)}
          className="p-1 hover:text-primary"
          aria-label="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          id="delete-button"
          onClick={() => handleDelete(holding.id as number)}
          className="p-1 hover:text-error"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );

  async function handleDelete(id: number) {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteRequest<Holding>("Holdings", id);
			if (result.successful)
      props.onHoldingDeleted();
		}
	};

  return (
    <ListTable
      items={props.holdings}
      bodyRow={tableBodyRow}
      headerRow={tableHeaderRow}
      isLoading={props.isLoading}
      isError={props.message.type === 'list-error'}
      title="Holdings"
    />
  )
}

