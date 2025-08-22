import React from 'react'
import { ListTable } from '@/app/components/table/ListTable';
import { DesktopManualInvestmentReturnRow } from './DesktopManualInvestmentReturnRow';
import { MobileManualInvestmentReturnCard } from './MobileManualInvestmentReturnCard';
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_PLURAL } from '../../form';
import { getManualInvestmentReturnDisplayName, ManualInvestmentReturn } from '../../ManualInvestmentReturn';

type ManualInvestmentReturnListProps = {
  manualInvestmentReturns: ManualInvestmentReturn[],
  onManualInvestmentReturnDeleted: () => void,
  onManualInvestmentReturnIsEditing: (investmentReturn: ManualInvestmentReturn) => void,
  tableHeaderRow: React.ReactNode,
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
