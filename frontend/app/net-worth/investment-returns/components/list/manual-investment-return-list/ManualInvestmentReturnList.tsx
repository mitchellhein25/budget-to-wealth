import React from 'react'
import { ListTable } from '@/app/components';
import { getManualInvestmentReturnDisplayName, ManualInvestmentReturn,  MANUAL_INVESTMENT_RETURN_ITEM_NAME_PLURAL, DesktopManualInvestmentReturnRow, MobileManualInvestmentReturnCard } from '@/app/net-worth/investment-returns';

type ManualInvestmentReturnListProps = {
  manualInvestmentReturns: ManualInvestmentReturn[],
  onManualInvestmentReturnDeleted: () => void,
  onManualInvestmentReturnIsEditing: (investmentReturn: ManualInvestmentReturn) => void,
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

export function ManualInvestmentReturnList(props: ManualInvestmentReturnListProps) {

  props.manualInvestmentReturns.forEach(investmentReturn => {
    if (!investmentReturn.name) {
      investmentReturn.name = getManualInvestmentReturnDisplayName(investmentReturn);
    }
  });

  const manualInvestmentReturnDesktopRow = (investmentReturn: ManualInvestmentReturn) => (
    <DesktopManualInvestmentReturnRow
      key={investmentReturn.id}
      investmentReturn={investmentReturn}
      onEdit={props.onManualInvestmentReturnIsEditing}
      onDelete={props.handleDelete}
      columnWidths={props.columnWidths}
    />
  );

  const mobileRow = (investmentReturn: ManualInvestmentReturn) => (
    <MobileManualInvestmentReturnCard
      key={investmentReturn.id}
      investmentReturn={investmentReturn}
      onEdit={props.onManualInvestmentReturnIsEditing}
      onDelete={props.handleDelete}
    />
  );

  return (
    <ListTable
      items={props.manualInvestmentReturns}
      bodyRow={manualInvestmentReturnDesktopRow}
      mobileRow={mobileRow}
      headerRow={props.tableHeaderRow}
      isLoading={props.isLoading}
      isError={props.isError}
      title={`${MANUAL_INVESTMENT_RETURN_ITEM_NAME_PLURAL}`}
    />
  )
}
