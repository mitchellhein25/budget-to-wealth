import React from 'react'
import { deleteHolding, deleteHoldingInvestmentReturn } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';
import { HoldingInvestmentReturn } from '../HoldingInvestmentReturn';
import { ManualInvestmentReturn } from '../ManualInvestmentReturn';
import { FetchResult } from '@/app/lib/api/apiClient';
import { DesktopHoldingInvestmentReturnRow } from './holding-investment-return-list/DesktopHoldingInvestmentReturnRow';
import { HoldingInvestmentReturnList } from './holding-investment-return-list/HoldingInvestmentReturnList';

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
      <th className="w-3/5">Investment</th>
    <th className="w-1/5">Return</th>
      <th className="w-1/5">Month</th>
    </tr>
  );

  // const holdingInvestmentReturnDesktopRow = (investmentReturn: HoldingInvestmentReturn) => (
  //   <DesktopHoldingInvestmentReturnRow
  //     key={investmentReturn.id}
  //     investmentReturn={investmentReturn}
  //     onEdit={props.onHoldingInvestmentReturnIsEditing}
  //     onDelete={() => handleDelete(investmentReturn.id as number, deleteHoldingInvestmentReturn, props.onHoldingInvestmentReturnDeleted)}
  //   />
  // );

  // const mobileRow = (holding: Holding) => (
  //   <MobileHoldingCard
  //     key={holding.id}
  //     holding={holding}
  //     onEdit={props.onHoldingIsEditing}
  //     onDelete={handleDelete}
  //   />
  // );

  return (
    <HoldingInvestmentReturnList
      holdingInvestmentReturns={props.holdingInvestmentReturns}
      onHoldingInvestmentReturnDeleted={props.onHoldingInvestmentReturnDeleted}
      onHoldingInvestmentReturnIsEditing={props.onHoldingInvestmentReturnIsEditing}
      tableHeaderRow={tableHeaderRow}
      handleDelete={(id: number) => handleDelete(id, deleteHoldingInvestmentReturn, props.onHoldingInvestmentReturnDeleted)}
      isLoading={props.isLoading}
      isError={props.isError}
    />
    // <ListTable
    //   items={props.holdings}
    //   bodyRow={desktopRow}
    //   mobileRow={mobileRow}
    //   headerRow={tableHeaderRow}
    //   isLoading={props.isLoading}
    //   isError={props.isError}
    //   title={`${HOLDING_ITEM_NAME}s`}
    // />
  )
}
