import React from 'react'
import { deleteHolding } from '@/app/lib/api/data-methods';
import { ListTable } from '@/app/components/table/ListTable';
import { HoldingInvestmentReturn } from '../form/holding-investment-return-form/HoldingInvestmentReturn';
import { ManualInvestmentReturn } from '../form/manual-investment-return-form/ManualInvestmentReturn';
import { FetchResult } from '@/app/lib/api/apiClient';

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
  const tableHeaderRow = (
    <tr>
      <th className="w-3/5">Investment</th>
      <th className="w-1/5">Return</th>
      <th className="w-1/5">Month</th>
    </tr>
  );

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

  // const desktopRow = (holding: Holding) => (
    // <DesktopHoldingRow
    //   key={holding.id}
    //   holding={holding}
    //   onEdit={props.onHoldingIsEditing}
    //   onDelete={handleDelete}
    // />
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
    <div></div>
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
