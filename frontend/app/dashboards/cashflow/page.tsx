"use client"

import React, { useCallback, useState } from 'react'
import { formatDate } from '@/app/components/Utils';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow/components/CashFlowTrendGraphData';
import TrendGraph from '../components/TrendGraph';
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow/components';
import { DashboardPage } from '../components/DashboardPage';
import { getCashFlowEntriesDateRange } from '@/app/lib/api/data-methods/cashFlowEntryRequests';
import { getCashFlowTrendGraphDateRange } from '@/app/lib/api/data-methods/trendGraphRequests';
import { CashFlowTrendDatasets } from './components/CashFlowTrendDatasets';
import { CashFlowTotalDisplays } from './components/CashFlowTotalDisplays';
import { CashFlowTrendGraphListTable } from './components/CashFlowTrendGraphListTable';
import { DateRange } from '@/app/components/DatePicker';

export default function CashFlowTrendGraph() {
  const [cashFlowTrendGraph, setCashFlowTrendGraph] = useState<CashFlowTrendGraphData | null>(null);

  const getCashFlowTrendGraph = useCallback(async (range: { from: Date; to: Date }) => {
    try {
      const response = await getCashFlowTrendGraphDateRange(range);
      if (!response.successful) {
        return false;
      }
      setCashFlowTrendGraph(response.data as CashFlowTrendGraphData);
      return true;
    } catch (error) {
      console.error('Error fetching net worth dashboard:', error);
      return false;
    }
  }, []);

  const renderContent = (isMobile: boolean) => {
    if (!cashFlowTrendGraph?.entries) 
      return null;

    return (
      <>
        <TrendGraph 
          title={CASHFLOW_ITEM_NAME} 
          labels={cashFlowTrendGraph.entries.map(entry => formatDate(new Date(entry.date), true) ?? '')} 
          datasets={CashFlowTrendDatasets(cashFlowTrendGraph)} 
          height={isMobile ? 240 : 420}
        />

        <CashFlowTotalDisplays 
          incomes={cashFlowTrendGraph.entries.map(e => e.incomeInCents)} 
          expenses={cashFlowTrendGraph.entries.map(e => e.expensesInCents)} 
          netCashFlows={cashFlowTrendGraph.entries.map(e => e.netCashFlowInCents)} 
        />

        <CashFlowTrendGraphListTable cashFlowTrendGraph={cashFlowTrendGraph} />
      </>
    );
  };

  const getAvailableDateRange = async () => {
    const res = await getCashFlowEntriesDateRange();
    return res.successful ? res.data! : null;
  };

  const onFetch = async (range: DateRange) => {
    const ok = await getCashFlowTrendGraph({ from: range.from!, to: range.to! });
    const count = ok && cashFlowTrendGraph ? cashFlowTrendGraph.entries.length : (cashFlowTrendGraph?.entries.length ?? 0);
    return { ok, itemCount: count };
  };

  return (
    <DashboardPage
      getAvailableDateRange={getAvailableDateRange}
      onFetch={onFetch}
      loadingMessage={`Loading ${CASHFLOW_ITEM_NAME} Trend Graph...`}
      errorMessage={`Failed to load ${CASHFLOW_ITEM_NAME} Trend Graph.`}
      emptyMessage={`No data found. Add some ${CASHFLOW_ITEM_NAME} entries to see your ${CASHFLOW_ITEM_NAME} trends.`}
    >
      {({ isMobile }) => renderContent(isMobile)}
    </DashboardPage>
  )
}
