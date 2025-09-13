import React from 'react'
import { convertCentsToDollars, formatDate } from '@/app/lib/utils';
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow';
import { ListTable, ListTableItem } from '@/app/components';
import { CashFlowTrendGraphData, CashFlowTrendGraphEntry } from '@/app/dashboards/cashflow';

export function CashFlowTrendGraphListTable({ cashFlowTrendGraph }: { cashFlowTrendGraph: CashFlowTrendGraphData }) {
  const columnWidths = {
    date: "w-3/12",
    income: "w-3/12",
    expenses: "w-3/12",
    netCashFlow: "w-3/12"
  };
  return (
    <div className="mt-3 sm:mt-4">
      <ListTable
        title={`${CASHFLOW_ITEM_NAME} Entries`}
        items={cashFlowTrendGraph.entries.map(e => ({ date: e.date })) as ListTableItem[]}
        headerRow={(
          <tr>
            <th className={columnWidths.date}>Month</th>
            <th className={columnWidths.income}>{INCOME_ITEM_NAME}</th>
            <th className={columnWidths.expenses}>{EXPENSE_ITEM_NAME_PLURAL}</th>
            <th className={columnWidths.netCashFlow}>{CASHFLOW_ITEM_NAME}</th>
          </tr>
        )}
        bodyRow={(item) => {
          const entry = cashFlowTrendGraph.entries.find(e => e.date === (item as CashFlowTrendGraphEntry).date)!;
          return (
            <tr>
              <td className={columnWidths.date}>{formatDate(new Date(entry.date), true)}</td>
              <td className={columnWidths.income}>{convertCentsToDollars(entry.incomeInCents)}</td>
              <td className={columnWidths.expenses}>{convertCentsToDollars(entry.expensesInCents)}</td>
              <td className={columnWidths.netCashFlow}>{convertCentsToDollars(entry.netCashFlowInCents)}</td>
            </tr>
          );
        }}
      />
    </div>
  )
}
