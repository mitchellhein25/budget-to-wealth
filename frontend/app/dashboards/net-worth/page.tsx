"use client"

import React, { useCallback, useState } from 'react'
import { NetWorthTrendGraphData } from '@/app/dashboards/net-worth/components/NetWorthTrendGraphData';
import { convertCentsToDollars, formatDate } from '@/app/components/Utils';
import TrendGraph from '../components/TrendGraph';
import { DashboardPage } from '../components/DashboardPage';
import { ListTable, TotalDisplay } from '@/app/components';
import { getHoldingSnapshotsDateRange } from '@/app/lib/api/data-methods/holdingSnapshotRequests';
import { ASSET_ITEM_NAME_PLURAL, ASSET_ITEM_NAME_PLURAL_LOWERCASE, DEBT_ITEM_NAME_PLURAL, DEBT_ITEM_NAME_PLURAL_LOWERCASE, NET_WORTH_ITEM_NAME } from '@/app/net-worth/components';
import { NetWorthTrendDatasets } from './components/NetWorthTrendDatasets';
import { getNetWorthTrendGraphDateRange } from '@/app/lib/api/data-methods/trendGraphRequests';

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
    const graphHeight = isMobile ? 240 : 420;
    if (!netWorthTrendGraph?.entries) return null;

    const datasets = NetWorthTrendDatasets(netWorthTrendGraph);

    const assets = netWorthTrendGraph.entries.map(e => e.assetValueInCents);
    const debts = netWorthTrendGraph.entries.map(e => e.debtValueInCents);
    const netWorths = netWorthTrendGraph.entries.map(e => e.netWorthInCents);
    const avg = (values: number[]) => (values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0);
    const min = (values: number[]) => (values.length ? Math.min(...values) : 0);
    const max = (values: number[]) => (values.length ? Math.max(...values) : 0);
    const median = (values: number[]) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
    };

    return (
      <>
        <TrendGraph 
          title={NET_WORTH_ITEM_NAME} 
          labels={netWorthTrendGraph.entries.map(entry => formatDate(new Date(entry.date)) ?? '')}
          datasets={datasets}
          height={graphHeight}
        />

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Min`} amount={min(assets)} />
            <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Median`} amount={median(assets)} />
            <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Average`} amount={avg(assets)} />
            <TotalDisplay compact label={`${ASSET_ITEM_NAME_PLURAL} - Max`} amount={max(assets)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Min`} amount={min(debts)} />
            <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Median`} amount={median(debts)} />
            <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Average`} amount={avg(debts)} />
            <TotalDisplay compact label={`${DEBT_ITEM_NAME_PLURAL} - Max`} amount={max(debts)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Min`} amount={min(netWorths)} />
            <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Median`} amount={median(netWorths)} />
            <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Average`} amount={avg(netWorths)} />
            <TotalDisplay compact label={`${NET_WORTH_ITEM_NAME} - Max`} amount={max(netWorths)} />
          </div>
        </div>

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
      </>
    );
  }

  return (
    <DashboardPage
      getAvailableDateRange={async () => {
        const res = await getHoldingSnapshotsDateRange();
        return res.successful ? res.data! : null;
      }}
      onFetch={async (range) => {
        const ok = await getNetWorthTrendGraph({ from: range.from!, to: range.to! });
        const count = ok && netWorthTrendGraph ? netWorthTrendGraph.entries.length : (netWorthTrendGraph?.entries.length ?? 0);
        return { ok, itemCount: count };
      }}
      loadingMessage={`Loading ${NET_WORTH_ITEM_NAME} Trend Graph...`}
      errorMessage={`Failed to load ${NET_WORTH_ITEM_NAME} Trend Graph.`}
      emptyMessage={`No data found. Add some ${ASSET_ITEM_NAME_PLURAL_LOWERCASE} and ${DEBT_ITEM_NAME_PLURAL_LOWERCASE} to see your ${NET_WORTH_ITEM_NAME} trends.`}
    >
      {({ isMobile }) => renderContent(isMobile)}
    </DashboardPage>
  )
}
