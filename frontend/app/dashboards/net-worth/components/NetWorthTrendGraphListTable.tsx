import { convertCentsToDollars } from '@/app/components/Utils';
import { formatDate, ListTable } from '@/app/components';
import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/components';
import React from 'react'
import { NetWorthTrendGraphData } from './NetWorthTrendGraphData';

export function NetWorthTrendGraphListTable({ netWorthTrendGraph }: { netWorthTrendGraph: NetWorthTrendGraphData }) {
  return (
    <div className="mt-4">
      <ListTable
        title={`${NET_WORTH_ITEM_NAME} Entries`}
        items={netWorthTrendGraph.entries.map(e => ({ date: e.date })) as any}
        headerRow={(
          <tr>
            <th>Date</th>
            <th className="text-right">{ASSET_ITEM_NAME_PLURAL}</th>
            <th className="text-right">{DEBT_ITEM_NAME_PLURAL}</th>
            <th className="text-right">{NET_WORTH_ITEM_NAME}</th>
          </tr>
        )}
        bodyRow={(item) => {
          const entry = netWorthTrendGraph.entries.find(e => e.date === (item as any).date)!;
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
