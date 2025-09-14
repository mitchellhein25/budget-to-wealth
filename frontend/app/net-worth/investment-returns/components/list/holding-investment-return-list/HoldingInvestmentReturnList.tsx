import React from 'react'
import { ListTable } from '@/app/components';
import { getHoldingInvestmentReturnDisplayName, HoldingInvestmentReturn, HOLDING_INVESTMENT_RETURN_ITEM_NAME_PLURAL, DesktopHoldingInvestmentReturnRow, MobileHoldingInvestmentReturnCard } from '@/app/net-worth/investment-returns';

type HoldingInvestmentReturnListProps = {
  holdingInvestmentReturns: HoldingInvestmentReturn[],
  onHoldingInvestmentReturnDeleted: () => void,
  onHoldingInvestmentReturnIsEditing: (investmentReturn: HoldingInvestmentReturn) => void,
  tableHeaderRow: React.ReactNode,
  columnWidths: {
    investment: string;
    return: string;
    month: string;
    actions: string;
  },
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
      columnWidths={props.columnWidths}
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
