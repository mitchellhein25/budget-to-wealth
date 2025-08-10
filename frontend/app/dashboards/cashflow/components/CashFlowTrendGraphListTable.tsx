import { convertCentsToDollars } from '@/app/components/Utils';
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow/components';
import { formatDate, ListTable, ListTableItem } from '@/app/components';
import React from 'react'
import { CashFlowTrendGraphData, CashFlowTrendGraphEntry } from './CashFlowTrendGraphData';

export function CashFlowTrendGraphListTable({ cashFlowTrendGraph }: { cashFlowTrendGraph: CashFlowTrendGraphData }) {
  return (
    <div className="mt-4">
      <ListTable
        title={`${CASHFLOW_ITEM_NAME} Entries`}
        items={cashFlowTrendGraph.entries.map(e => ({ date: e.date })) as ListTableItem[]}
        headerRow={(
          <tr>
            <th>Month</th>
            <th className="text-right">{INCOME_ITEM_NAME}</th>
            <th className="text-right">{EXPENSE_ITEM_NAME_PLURAL}</th>
            <th className="text-right">{CASHFLOW_ITEM_NAME}</th>
          </tr>
        )}
        bodyRow={(item) => {
          const entry = cashFlowTrendGraph.entries.find(e => e.date === (item as CashFlowTrendGraphEntry).date)!;
          return (
            <tr>
              <td>{formatDate(new Date(entry.date), true)}</td>
              <td className="text-right">{convertCentsToDollars(entry.incomeInCents)}</td>
              <td className="text-right">{convertCentsToDollars(entry.expensesInCents)}</td>
              <td className="text-right">{convertCentsToDollars(entry.netCashFlowInCents)}</td>
            </tr>
          );
        }}
      />
    </div>
  )
}
