"use client"

import React, { useCallback, useState } from 'react'
import { NetWorthTrendGraphData } from '@/app/dashboards/net-worth/components/NetWorthTrendGraphData';
import { formatDate } from '@/app/components/Utils';
import TrendGraph from '../components/TrendGraph';
import { DashboardPage } from '../components/DashboardPage';
import { DateRange } from '@/app/components';
import { getHoldingSnapshotsDateRange } from '@/app/lib/api/data-methods/holdingSnapshotRequests';
import { ASSET_ITEM_NAME_PLURAL_LOWERCASE, DEBT_ITEM_NAME_PLURAL_LOWERCASE, NET_WORTH_ITEM_NAME } from '@/app/net-worth/components';
import { NetWorthTrendDatasets } from './components/NetWorthTrendDatasets';
import { getNetWorthTrendGraphDateRange } from '@/app/lib/api/data-methods/trendGraphRequests';
import { NetWorthTotalDisplays } from './components/NetWorthTotalDisplays';
import { NetWorthTrendGraphListTable } from './components/NetWorthTrendGraphListTable';

export default function NetWorthTrendGraph() {
  const [netWorthTrendGraph, setNetWorthTrendGraph] = useState<NetWorthTrendGraphData | null>(null);
  const getNetWorthTrendGraph = useCallback(async (range: { from: Date; to: Date }) => {
    try {
      const response = await getNetWorthTrendGraphDateRange(range);
      if (!response.successful) {
        return false;
      }
      setNetWorthTrendGraph(response.data as NetWorthTrendGraphData);
      return true;
    } catch (error) {
      console.error('Error fetching net worth dashboard:', error);
      return false;
    }
  }, []);

  const renderContent = (isMobile: boolean) => {
    if (!netWorthTrendGraph?.entries) 
      return null;

    return (
      <>
        <TrendGraph 
          title={NET_WORTH_ITEM_NAME} 
          labels={netWorthTrendGraph.entries.map(entry => formatDate(new Date(entry.date)) ?? '')}
          datasets={NetWorthTrendDatasets(netWorthTrendGraph)}
          height={isMobile ? 240 : 420}
        />
        
        <NetWorthTotalDisplays 
          assets={netWorthTrendGraph.entries.map(e => e.assetValueInCents)} 
          debts={netWorthTrendGraph.entries.map(e => e.debtValueInCents)} 
          netWorths={netWorthTrendGraph.entries.map(e => e.netWorthInCents)} 
        />

        <NetWorthTrendGraphListTable netWorthTrendGraph={netWorthTrendGraph} />
      </>
    );
  }

  const getAvailableDateRange = async () => {
    const res = await getHoldingSnapshotsDateRange();
    return res.successful ? res.data! : null;
  };

  const onFetch = async (range: DateRange) => {
    const ok = await getNetWorthTrendGraph({ from: range.from!, to: range.to! });
    const count = ok && netWorthTrendGraph ? netWorthTrendGraph.entries.length : (netWorthTrendGraph?.entries.length ?? 0);
    return { ok, itemCount: count };
  };

  return (
    <DashboardPage
      getAvailableDateRange={getAvailableDateRange}
      onFetch={onFetch}
      loadingMessage={`Loading ${NET_WORTH_ITEM_NAME} Trend Graph...`}
      errorMessage={`Failed to load ${NET_WORTH_ITEM_NAME} Trend Graph.`}
      emptyMessage={`No data found. Add some ${ASSET_ITEM_NAME_PLURAL_LOWERCASE} and ${DEBT_ITEM_NAME_PLURAL_LOWERCASE} to see your ${NET_WORTH_ITEM_NAME} trends.`}
    >
      {({ isMobile }) => renderContent(isMobile)}
    </DashboardPage>
  )
}
