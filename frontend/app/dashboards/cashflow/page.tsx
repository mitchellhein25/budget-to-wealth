"use client"

import React, { useCallback } from 'react'
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow/components';
import { DateRange, formatDate } from '@/app/components';
import { getCashFlowTrendGraphForDateRange, getCashFlowEntriesDateRange } from '@/app/lib/api/data-methods';
import { DashboardPage, TrendGraph } from '../components';
import { CashFlowTrendDatasets, CashFlowTotalDisplays, CashFlowTrendGraphListTable, CashFlowTrendGraphData } from './components';

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
