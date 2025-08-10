"use client"

import React, { useCallback } from 'react'
import { formatDate } from '@/app/components/Utils';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow/components/CashFlowTrendGraphData';
import TrendGraph from '../components/TrendGraph';
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow/components';
import { DashboardPage } from '../components/DashboardPage';
import { getCashFlowTrendGraphForDateRange } from '@/app/lib/api/data-methods/trendGraphRequests';
import { CashFlowTrendDatasets } from './components/CashFlowTrendDatasets';
import { CashFlowTotalDisplays } from './components/CashFlowTotalDisplays';
import { CashFlowTrendGraphListTable } from './components/CashFlowTrendGraphListTable';
import { getCashFlowEntriesDateRange } from '@/app/lib/api/data-methods/cashFlowEntryRequests';
import { DateRange } from '@/app/components';

export default function CashFlowTrendGraph() {
  const renderContent = (trendGraphData: CashFlowTrendGraphData | null) => {
    if (!trendGraphData?.entries) 
      return null;

    return (
      <>
        <TrendGraph 
          title={CASHFLOW_ITEM_NAME} 
          labels={trendGraphData.entries.map(entry => formatDate(new Date(entry.date), true) ?? '')} 
          datasets={CashFlowTrendDatasets(trendGraphData)} 
        />

        <CashFlowTotalDisplays 
          incomes={trendGraphData.entries.map(e => e.incomeInCents)} 
          expenses={trendGraphData.entries.map(e => e.expensesInCents)} 
          netCashFlows={trendGraphData.entries.map(e => e.netCashFlowInCents)} 
        />

        <CashFlowTrendGraphListTable cashFlowTrendGraph={trendGraphData} />
      </>
    );
  };

  const getTrendGraph = useCallback(async (range: DateRange) => 
    await getCashFlowTrendGraphForDateRange(range), []);

  return (
    <DashboardPage
      getAvailableDateRange={getCashFlowEntriesDateRange}
      getTrendGraph={getTrendGraph}
      itemName={CASHFLOW_ITEM_NAME}
    >
      {({ trendGraphData }) => renderContent(trendGraphData)}
    </DashboardPage>
  )
}
