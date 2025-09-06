"use client"

import React, { useCallback } from 'react'
import { getCashFlowTrendGraphForDateRange, getCashFlowEntriesDateRange } from '@/app/lib/api';
import { formatDate } from '@/app/lib/utils';
import { DateRange } from '@/app/components';
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow';
import { DashboardPage, TrendGraph } from '@/app/dashboards';
import { CashFlowTrendDatasets, CashFlowTotalDisplays, CashFlowTrendGraphListTable, CashFlowTrendGraphData } from '@/app/dashboards/cashflow';

export function CashFlowTrendGraph() {
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
      {({ trendGraphData }) => renderContent(trendGraphData as CashFlowTrendGraphData | null)}
    </DashboardPage>
  )
}
