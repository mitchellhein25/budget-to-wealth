"use client"

import React, { useCallback, useState } from 'react'
import { convertCentsToDollars, formatDate } from '@/app/components/Utils';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow/components/CashFlowTrendGraphData';
import TrendGraph from '../components/TrendGraph';
import { ListTable, TotalDisplay } from '@/app/components';
import { CASHFLOW_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow/components';
import { DashboardPage } from '../components/DashboardPage';
import { getCashFlowEntriesDateRange } from '@/app/lib/api/data-methods/cashFlowEntryRequests';
import { getCashFlowTrendGraphDateRange } from '@/app/lib/api/data-methods/trendGraphRequests';
import { CashFlowTrendDatasets } from './components/CashFlowTrendDatasets';

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
    const graphHeight = isMobile ? 240 : 420;
    if (!cashFlowTrendGraph?.entries) return null;

    const datasets = CashFlowTrendDatasets(cashFlowTrendGraph);

    const incomes = cashFlowTrendGraph.entries.map(e => e.incomeInCents);
    const expenses = cashFlowTrendGraph.entries.map(e => e.expensesInCents);
    const netCashFlows = cashFlowTrendGraph.entries.map(e => e.netCashFlowInCents);
    const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
    const avg = (values: number[]) => (values.length ? Math.round(sum(values) / values.length) : 0);
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
          title={CASHFLOW_ITEM_NAME} 
          labels={cashFlowTrendGraph.entries.map(entry => formatDate(new Date(entry.date), true) ?? '')} 
          datasets={datasets} 
          height={graphHeight}
        />

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Min`} amount={min(incomes)} />
            <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Median`} amount={median(incomes)} />
            <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Average`} amount={avg(incomes)} />
            <TotalDisplay compact label={`${INCOME_ITEM_NAME} - Max`} amount={max(incomes)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Min`} amount={min(expenses)} />
            <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Median`} amount={median(expenses)} />
            <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Average`} amount={avg(expenses)} />
            <TotalDisplay compact label={`${EXPENSE_ITEM_NAME_PLURAL} - Max`} amount={max(expenses)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Min`} amount={min(netCashFlows)} />
            <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Median`} amount={median(netCashFlows)} />
            <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Average`} amount={avg(netCashFlows)} />
            <TotalDisplay compact label={`${CASHFLOW_ITEM_NAME} - Max`} amount={max(netCashFlows)} />
          </div>
        </div>

        <div className="mt-4">
          <ListTable
            title={`${CASHFLOW_ITEM_NAME} Entries`}
            items={cashFlowTrendGraph.entries.map(e => ({ date: e.date })) as any}
            headerRow={(
              <tr>
                <th>Month</th>
                <th className="text-right">{INCOME_ITEM_NAME}</th>
                <th className="text-right">{EXPENSE_ITEM_NAME_PLURAL}</th>
                <th className="text-right">{CASHFLOW_ITEM_NAME}</th>
              </tr>
            )}
            bodyRow={(item) => {
              const entry = cashFlowTrendGraph.entries.find(e => e.date === (item as any).date)!;
              return (
                <tr>
                  <td>{formatDate(new Date(entry.date), true)}</td>
                  <td className="text-right">{convertCentsToDollars(entry.incomeInCents)}</td>
                  <td className="text-right">{convertCentsToDollars(entry.expensesInCents)}</td>
                  <td className="text-right">{convertCentsToDollars(entry.netCashFlowInCents)}</td>
                </tr>
              );
            }}
          />
        </div>
      </>
    );
  };

  return (
    <DashboardPage
      getAvailableDateRange={async () => {
        const res = await getCashFlowEntriesDateRange();
        return res.successful ? res.data! : null;
      }}
      onFetch={async (range) => {
        const ok = await getCashFlowTrendGraph({ from: range.from!, to: range.to! });
        const count = ok && cashFlowTrendGraph ? cashFlowTrendGraph.entries.length : (cashFlowTrendGraph?.entries.length ?? 0);
        return { ok, itemCount: count };
      }}
      loadingMessage={`Loading ${CASHFLOW_ITEM_NAME} Trend Graph...`}
      errorMessage={`Failed to load ${CASHFLOW_ITEM_NAME} Trend Graph.`}
      emptyMessage={`No data found. Add some ${CASHFLOW_ITEM_NAME} entries to see your ${CASHFLOW_ITEM_NAME} trends.`}
    >
      {({ isMobile }) => {
        return renderContent(isMobile);
      }}
    </DashboardPage>
  )
}
