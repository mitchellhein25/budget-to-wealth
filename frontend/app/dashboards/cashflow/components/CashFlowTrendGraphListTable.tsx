import React from 'react'
import { convertCentsToDollars, formatDate } from '@/app/lib/utils';
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow';
import { ListTable } from '@/app/components';
import { CashFlowTrendGraphData, CashFlowTrendGraphEntry } from '@/app/dashboards/cashflow';
import MobileCashFlowTrendGraphCard from './MobileCashFlowTrendGraphCard';

export function CashFlowTrendGraphListTable({ cashFlowTrendGraph }: { cashFlowTrendGraph: CashFlowTrendGraphData }) {
  const columnWidths = {
    date: "w-3/12",
    income: "w-3/12",
    expenses: "w-3/12",
    netCashFlow: "w-3/12"
  };
  const tableHeaderRow = (
    <tr>
      <th className={columnWidths.date}>Month</th>
      <th className={columnWidths.income}>{INCOME_ITEM_NAME}</th>
      <th className={columnWidths.expenses}>{EXPENSE_ITEM_NAME_PLURAL}</th>
      <th className={columnWidths.netCashFlow}>{CASHFLOW_ITEM_NAME}</th>
    </tr>
  );
  const tableBodyRow = (item: CashFlowTrendGraphEntry) => (
    <tr>
      <td className={columnWidths.date}>{formatDate(new Date(item.date), true)}</td>
      <td className={columnWidths.income}>{convertCentsToDollars(item.incomeInCents)}</td>
      <td className={columnWidths.expenses}>{convertCentsToDollars(item.expensesInCents)}</td>
      <td className={columnWidths.netCashFlow}>{convertCentsToDollars(item.netCashFlowInCents)}</td>
    </tr>
  );
  const tableMobileRow = (item: CashFlowTrendGraphEntry) => (
    <MobileCashFlowTrendGraphCard item={item} />
  );
  return (
    <div className="mt-3 sm:mt-4">
      <ListTable
        title={`${CASHFLOW_ITEM_NAME} Entries`}
        items={cashFlowTrendGraph.entries}
        headerRow={tableHeaderRow}
        bodyRow={tableBodyRow}
        mobileRow={tableMobileRow}
      />
    </div>
  )
}
