'use client'

import DashboardSideBar from '../components/DashboardSideBar'
import React, { useCallback, useEffect, useState } from 'react'
import { NetWorthTrendGraphData } from '@/app/dashboards/net-worth/NetWorthTrendGraphData';
import { formatDate, getCurrentYearRange } from '@/app/components/Utils';
import { getRequestSingle } from '@/app/lib/api/rest-methods/getRequest';
import { DateRange } from '../../components/DatePicker';
import { DatePicker } from '@/app/components/DatePicker';
import TrendGraph, { TrendGraphDataset } from '../components/TrendGraph';
import { useMobileDetection } from '@/app/hooks';

export default function NetWorthTrendGraph() {
  const [netWorthTrendGraph, setNetWorthTrendGraph] = useState<NetWorthTrendGraphData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentYearRange(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const isMobile = useMobileDetection();

  const getNetWorthTrendGraph = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getRequestSingle<NetWorthTrendGraphData>(`NetWorthTrendGraph?startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`);
      if (!response.successful) {
        setIsError(true);
      }
      setNetWorthTrendGraph(response.data as NetWorthTrendGraphData);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching net worth dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    getNetWorthTrendGraph();
  }, [getNetWorthTrendGraph]);

  const renderContent = () => {
    if (isError) {
      return (
        <p className="alert alert-error alert-soft">Failed to load Net Worth Dashboard.</p>
      );
    }
  
    if (isLoading) {
      return (
        <p className="alert alert-info alert-soft">Loading Net Worth Dashboard...</p>
      );
    }

    if (!netWorthTrendGraph?.entries || netWorthTrendGraph.entries.length === 0) {
      return (
        <div className="alert alert-info alert-soft">No data found. Add some assets and debts to see your net worth.</div>
      );
    }

    const datasets: TrendGraphDataset[] = [
      {
        type: 'line' as const,
        label: 'Assets',
        data: netWorthTrendGraph.entries.map(entry => entry.assetValueInCents / 100),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        type: 'line' as const,
        label: 'Debt',
        data: netWorthTrendGraph.entries.map(entry => entry.debtValueInCents / 100),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
      {
        type: 'line' as const,
        label: 'Net Worth',
        data: netWorthTrendGraph.entries.map(entry => entry.netWorthInCents / 100),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246)',
      }
    ];

    return (
      <TrendGraph 
        title='Net Worth' 
        labels={netWorthTrendGraph.entries.map(entry => formatDate(new Date(entry.date)) ?? '')}
        datasets={datasets}
      />
    );
  }

  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      {!isMobile && <DashboardSideBar />}
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
