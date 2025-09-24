import React from 'react'
import { deleteHoldingInvestmentReturn, deleteManualInvestmentReturn } from '@/app/lib/api';
import { DeleteConfirmationModal } from '@/app/components';
import { useDeleteConfirmation } from '@/app/hooks';
import { HoldingInvestmentReturn, ManualInvestmentReturn, HoldingInvestmentReturnList, ManualInvestmentReturnList } from '@/app/net-worth/investment-returns';

type InvestmentReturnListProps = {
  manualInvestmentReturns: ManualInvestmentReturn[],
  holdingInvestmentReturns: HoldingInvestmentReturn[],
  onManualInvestmentReturnDeleted: () => void,
  onHoldingInvestmentReturnDeleted: () => void,
  onManualInvestmentReturnIsEditing: (investmentReturn: ManualInvestmentReturn) => void,
  onHoldingInvestmentReturnIsEditing: (investmentReturn: HoldingInvestmentReturn) => void,
  isLoading: boolean,
	isError: boolean
}

export function InvestmentReturnList(props: InvestmentReturnListProps) {

  const manualDeleteConfirmation = useDeleteConfirmation({
    deleteFunction: deleteManualInvestmentReturn,
    onSuccess: props.onManualInvestmentReturnDeleted
  });

  const holdingDeleteConfirmation = useDeleteConfirmation({
    deleteFunction: deleteHoldingInvestmentReturn,
    onSuccess: props.onHoldingInvestmentReturnDeleted
  });
  
  const columnWidths = {
    investment: "w-5/12",
    return: "w-2/12",
    month: "w-3/12",
    actions: "w-2/12",
  };

  const tableHeaderRow = (
    <tr>
      <th className={columnWidths.investment}>Investment</th>
      <th className={columnWidths.return}>Return</th>
      <th className={columnWidths.month}>Month</th>
    </tr>
  );

  return (
    <>
      <HoldingInvestmentReturnList
        holdingInvestmentReturns={props.holdingInvestmentReturns}
        onHoldingInvestmentReturnDeleted={props.onHoldingInvestmentReturnDeleted}
        onHoldingInvestmentReturnIsEditing={props.onHoldingInvestmentReturnIsEditing}
        tableHeaderRow={tableHeaderRow}
        columnWidths={columnWidths}
        handleDelete={holdingDeleteConfirmation.openDeleteModal}
        isLoading={props.isLoading}
        isError={props.isError}
      />
      <ManualInvestmentReturnList
        manualInvestmentReturns={props.manualInvestmentReturns}
        onManualInvestmentReturnDeleted={props.onManualInvestmentReturnDeleted}
        onManualInvestmentReturnIsEditing={props.onManualInvestmentReturnIsEditing}
        tableHeaderRow={tableHeaderRow}
        columnWidths={columnWidths}
        handleDelete={manualDeleteConfirmation.openDeleteModal}
        isLoading={props.isLoading}
        isError={props.isError}
      />
      <DeleteConfirmationModal
        isOpen={holdingDeleteConfirmation.isModalOpen}
        onClose={holdingDeleteConfirmation.closeDeleteModal}
        onConfirm={holdingDeleteConfirmation.confirmDelete}
        isLoading={holdingDeleteConfirmation.isLoading}
        title="Delete Holding Investment Return"
        message="Are you sure you want to delete this holding investment return? This action cannot be undone."
      />
      <DeleteConfirmationModal
        isOpen={manualDeleteConfirmation.isModalOpen}
        onClose={manualDeleteConfirmation.closeDeleteModal}
        onConfirm={manualDeleteConfirmation.confirmDelete}
        isLoading={manualDeleteConfirmation.isLoading}
        title="Delete Manual Investment Return"
        message="Are you sure you want to delete this manual investment return? This action cannot be undone."
      />
    </>
  )
}
