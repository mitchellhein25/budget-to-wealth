import React from 'react'
import { deleteHoldingInvestmentReturn, deleteManualInvestmentReturn, FetchResult } from '@/app/lib/api';
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

  async function handleDelete<T>(
    id: number, 
    deleteRequest: (id: number) => Promise<FetchResult<T>>,   
    onDeleted: () => void) 
  {
		if (window.confirm('Are you sure you want to delete this?')) {
			const result = await deleteRequest(id);
			if (result.successful)
        onDeleted();
		}
	};
  
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
        handleDelete={(id: number) => handleDelete(id, deleteHoldingInvestmentReturn, props.onHoldingInvestmentReturnDeleted)}
        isLoading={props.isLoading}
        isError={props.isError}
      />
      <ManualInvestmentReturnList
        manualInvestmentReturns={props.manualInvestmentReturns}
        onManualInvestmentReturnDeleted={props.onManualInvestmentReturnDeleted}
        onManualInvestmentReturnIsEditing={props.onManualInvestmentReturnIsEditing}
        tableHeaderRow={tableHeaderRow}
        columnWidths={columnWidths}
        handleDelete={(id: number) => handleDelete(id, deleteManualInvestmentReturn, props.onManualInvestmentReturnDeleted)}
        isLoading={props.isLoading}
        isError={props.isError}
      />
    </>
  )
}
