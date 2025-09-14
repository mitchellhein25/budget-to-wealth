import React from 'react'
import { convertCentsToDollars, formatDate } from '@/app/lib/utils';
import { ListTable } from '@/app/components';
import { ASSET_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots'
import { NetWorthTrendGraphData, NetWorthTrendGraphEntry } from '@/app/dashboards/net-worth';
import MobileNetWorthTrendGraphCard from './MobileNetWorthTrendGraphCard';

export function NetWorthTrendGraphListTable({ netWorthTrendGraph }: { netWorthTrendGraph: NetWorthTrendGraphData }) {
  const tableHeaderRow = (
    <tr>
      <th>Date</th>
      <th className="text-right">{ASSET_ITEM_NAME_PLURAL}</th>
      <th className="text-right">{DEBT_ITEM_NAME_PLURAL}</th>
      <th className="text-right">{NET_WORTH_ITEM_NAME}</th>
    </tr>
  );
  const tableMobileRow = (item: NetWorthTrendGraphEntry) => (
    <MobileNetWorthTrendGraphCard item={item} />
  );
  const tableBodyRow = (item: NetWorthTrendGraphEntry) => (
    <tr>
      <td>{formatDate(new Date(item.date))}</td>
      <td className="text-right">{convertCentsToDollars(item.assetValueInCents)}</td>
      <td className="text-right">{convertCentsToDollars(item.debtValueInCents)}</td>
      <td className="text-right">{convertCentsToDollars(item.netWorthInCents)}</td>
    </tr>
  );
  return (
    <div className="mt-3 sm:mt-4">
      <ListTable
        title={`${NET_WORTH_ITEM_NAME} Entries`}
        items={netWorthTrendGraph.entries}
        headerRow={tableHeaderRow}
        bodyRow={tableBodyRow}
        mobileRow={tableMobileRow}
      />
    </div>
  )
}