"use client"

import React, { useCallback } from 'react'
import { NetWorthTrendGraphData } from '@/app/dashboards/net-worth/components/NetWorthTrendGraphData';
import { formatDate } from '@/app/components/Utils';
import TrendGraph from '../components/TrendGraph';
import { DashboardPage } from '../components/DashboardPage';
import { getHoldingSnapshotsDateRange } from '@/app/lib/api/data-methods/holdingSnapshotRequests';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/components';
import { NetWorthTrendDatasets } from './components/NetWorthTrendDatasets';
import { getNetWorthTrendGraphForDateRange } from '@/app/lib/api/data-methods/trendGraphRequests';
import { NetWorthTotalDisplays } from './components/NetWorthTotalDisplays';
import { NetWorthTrendGraphListTable } from './components/NetWorthTrendGraphListTable';
import { DateRange } from '@/app/components';

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
