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

  const tableHeaderRow = (
    <tr>
      <th className="w-1/2 text-left">Investment</th>
      <th className="text-left">Return</th>
      <th className="text-left">Month</th>
    </tr>
  );

  return (
    <>
      <HoldingInvestmentReturnList
        holdingInvestmentReturns={props.holdingInvestmentReturns}
        onHoldingInvestmentReturnDeleted={props.onHoldingInvestmentReturnDeleted}
        onHoldingInvestmentReturnIsEditing={props.onHoldingInvestmentReturnIsEditing}
        tableHeaderRow={tableHeaderRow}
        handleDelete={(id: number) => handleDelete(id, deleteHoldingInvestmentReturn, props.onHoldingInvestmentReturnDeleted)}
        isLoading={props.isLoading}
        isError={props.isError}
      />
      <ManualInvestmentReturnList
        manualInvestmentReturns={props.manualInvestmentReturns}
        onManualInvestmentReturnDeleted={props.onManualInvestmentReturnDeleted}
        onManualInvestmentReturnIsEditing={props.onManualInvestmentReturnIsEditing}
        tableHeaderRow={tableHeaderRow}
        handleDelete={(id: number) => handleDelete(id, deleteManualInvestmentReturn, props.onManualInvestmentReturnDeleted)}
        isLoading={props.isLoading}
        isError={props.isError}
      />
    </>
  )
}
