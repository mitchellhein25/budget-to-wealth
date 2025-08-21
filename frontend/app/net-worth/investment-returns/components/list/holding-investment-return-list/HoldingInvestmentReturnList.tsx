import React from 'react'
import { ListTable } from '@/app/components/table/ListTable';
import { getHoldingInvestmentReturnDisplayName, HoldingInvestmentReturn } from '../../HoldingInvestmentReturn';
import { DesktopHoldingInvestmentReturnRow } from './DesktopHoldingInvestmentReturnRow';
import { MobileHoldingInvestmentReturnCard } from './MobileHoldingInvestmentReturnCard';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_PLURAL } from '../../form';

type HoldingInvestmentReturnListProps = {
  holdingInvestmentReturns: HoldingInvestmentReturn[],
  onHoldingInvestmentReturnDeleted: () => void,
  onHoldingInvestmentReturnIsEditing: (investmentReturn: HoldingInvestmentReturn) => void,
  tableHeaderRow: React.ReactNode,
  handleDelete: (id: number) => void,
  isLoading: boolean,
	isError: boolean
}

export function HoldingInvestmentReturnList(props: HoldingInvestmentReturnListProps) {

  props.holdingInvestmentReturns.forEach(investmentReturn => {
    if (!investmentReturn.name) {
      investmentReturn.name = getHoldingInvestmentReturnDisplayName(investmentReturn);
    }
  });

  const holdingInvestmentReturnDesktopRow = (investmentReturn: HoldingInvestmentReturn) => (
    <DesktopHoldingInvestmentReturnRow
      key={investmentReturn.id}
      investmentReturn={investmentReturn}
      onEdit={props.onHoldingInvestmentReturnIsEditing}
      onDelete={props.handleDelete}
    />
  );

  const mobileRow = (investmentReturn: HoldingInvestmentReturn) => (
    <MobileHoldingInvestmentReturnCard
      key={investmentReturn.id}
      investmentReturn={investmentReturn}
      onEdit={props.onHoldingInvestmentReturnIsEditing}
      onDelete={props.handleDelete}
    />
  );

  return (
    <ListTable
      items={props.holdingInvestmentReturns}
      bodyRow={holdingInvestmentReturnDesktopRow}
      mobileRow={mobileRow}
      headerRow={props.tableHeaderRow}
      isLoading={props.isLoading}
      isError={props.isError}
      title={`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_PLURAL}`}
    />
  )
}
