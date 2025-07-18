'use client'

import DashboardSideBar from '../components/DashboardSideBar'
import React, { useCallback, useEffect, useState } from 'react'
import { formatDate, getCurrentYearRange } from '@/app/components/Utils';
import { getRequestSingle } from '@/app/lib/api/rest-methods/getRequest';
import { DateRange } from '../../components/DatePicker';
import DatePicker from '@/app/components/DatePicker';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow/CashFlowTrendGraphData';
import TrendGraph, { TrendGraphDataset } from '../components/TrendGraph';

export default function CashFlowTrendGraph() {
  const [cashFlowTrendGraph, setCashFlowTrendGraph] = useState<CashFlowTrendGraphData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentYearRange(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getCashFlowTrendGraph = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getRequestSingle<CashFlowTrendGraphData>(`CashFlowTrendGraph?startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`);
      if (!response.successful) {
        setIsError(true);
      }
      setCashFlowTrendGraph(response.data as CashFlowTrendGraphData);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching net worth dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    getCashFlowTrendGraph();
  }, [getCashFlowTrendGraph]);

  const renderContent = () => {
    if (isError) {
      return (
        <p className="alert alert-error alert-soft">Failed to load CashFlow Trend Graph.</p>
      );
    }
  
    if (isLoading) {
      return (
        <p className="alert alert-info alert-soft">Loading CashFlow Trend Graph...</p>
      );
    }

    if (!cashFlowTrendGraph?.entries || cashFlowTrendGraph.entries.length === 0) {
      return (
        <div className="alert alert-info alert-soft">No data found. Add some cash flow entries to see your cash flow trends.</div>
      );
    }

    const datasets: TrendGraphDataset[] = [
        {
          type: 'bar' as const,
          label: 'Income',
          data: cashFlowTrendGraph.entries.map(entry => entry.incomeInCents / 100),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          type: 'bar' as const,
          label: 'Expenses',
          data: cashFlowTrendGraph.entries.map(entry => entry.expensesInCents / 100),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
        {
          type: 'line' as const,
          label: 'Net Cash Flow',
          data: cashFlowTrendGraph.entries.map(entry => entry.netCashFlowInCents / 100),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        }
    ];

    return (
      <TrendGraph 
        title="CashFlow" 
        labels={cashFlowTrendGraph.entries.map(entry => formatDate(new Date(entry.date), true) ?? '')} 
        datasets={datasets} 
      />
    );
  };

  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      <DashboardSideBar />
      <div className="flex flex-1 flex-col gap-2">
        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        {renderContent()}
      </div>
    </div>
  )
}
