"use client"

import React, { useCallback } from 'react'
import { getNetWorthTrendGraphForDateRange, getHoldingSnapshotsDateRange } from '@/app/lib/api/data-methods';
import { formatDate, DateRange } from '@/app/components';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots/components';
import { DashboardPage, TrendGraph } from '../components';
import { NetWorthTrendDatasets, NetWorthTotalDisplays, NetWorthTrendGraphListTable, NetWorthTrendGraphData } from './components';

export default function NetWorthTrendGraph() {
  const renderContent = (trendGraphData: NetWorthTrendGraphData | null) => {
    if (!trendGraphData?.entries) 
      return null;

    return (
      <>
        <TrendGraph 
          title={NET_WORTH_ITEM_NAME} 
          labels={trendGraphData.entries.map(entry => formatDate(new Date(entry.date)) ?? '')}
          datasets={NetWorthTrendDatasets(trendGraphData)}
        />
        
        <NetWorthTotalDisplays 
          assets={trendGraphData.entries.map(e => e.assetValueInCents)} 
          debts={trendGraphData.entries.map(e => e.debtValueInCents)} 
          netWorths={trendGraphData.entries.map(e => e.netWorthInCents)} 
        />

        <NetWorthTrendGraphListTable netWorthTrendGraph={trendGraphData} />
      </>
    );
  }

  const getTrendGraph = useCallback(async (range: DateRange) => 
    await getNetWorthTrendGraphForDateRange(range), []);

  return (
    <DashboardPage
      getAvailableDateRange={getHoldingSnapshotsDateRange}
      getTrendGraph={getTrendGraph}
      itemName={NET_WORTH_ITEM_NAME}
    >
      {({ trendGraphData }) => renderContent(trendGraphData)}
    </DashboardPage>
  )
}
