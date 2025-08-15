import React from 'react'
import { convertCentsToDollars, formatDate, ListTable, ListTableItem } from '@/app/components';
import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots/components';
import { NetWorthTrendGraphData, NetWorthTrendGraphEntry } from './';

export function NetWorthTrendGraphListTable({ netWorthTrendGraph }: { netWorthTrendGraph: NetWorthTrendGraphData }) {
  return (
    <div className="mt-4">
      <ListTable
        title={`${NET_WORTH_ITEM_NAME} Entries`}
        items={netWorthTrendGraph.entries.map(e => ({ date: e.date })) as ListTableItem[]}
        headerRow={(
          <tr>
            <th>Date</th>
            <th className="text-right">{ASSET_ITEM_NAME_PLURAL}</th>
            <th className="text-right">{DEBT_ITEM_NAME_PLURAL}</th>
            <th className="text-right">{NET_WORTH_ITEM_NAME}</th>
          </tr>
        )}
        bodyRow={(item) => {
          const entry = netWorthTrendGraph.entries.find(e => e.date === (item as NetWorthTrendGraphEntry).date)!;
          return (
            <tr>
              <td>{formatDate(new Date(entry.date))}</td>
              <td className="text-right">{convertCentsToDollars(entry.assetValueInCents)}</td>
              <td className="text-right">{convertCentsToDollars(entry.debtValueInCents)}</td>
              <td className="text-right">{convertCentsToDollars(entry.netWorthInCents)}</td>
            </tr>
          );
        }}
      />
    </div>
  )
}
