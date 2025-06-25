'use client'

import DashboardSideBar from '@/app/ui/components/dashboards/DashboardSideBar'
import React, { useCallback, useEffect, useState } from 'react'
import { formatDate, getCurrentYearRange } from '@/app/ui/components/Utils';
import { getRequestSingle } from '@/app/lib/api/rest-methods/getRequest';
import { DateRange } from 'react-day-picker';
import DatePicker from '@/app/ui/components/DatePicker';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { CashFlowTrendGraphData } from '@/app/lib/models/dashboards/CashFlowTrendGraphData';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

export default function CashFlowDashboard() {
  const [cashFlowTrendGraph, setCashFlowTrendGraph] = useState<CashFlowTrendGraphData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentYearRange(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getCashFlowDashboard = useCallback(async () => {
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
    getCashFlowDashboard();
  }, [getCashFlowDashboard]);

  const renderContent = () => {
    if (isError) {
      return (
        <p className="alert alert-error alert-soft">Failed to load CashFlow Dashboard.</p>
      );
    }
  
    if (isLoading) {
      return (
        <p className="alert alert-info alert-soft">Loading CashFlow Dashboard...</p>
      );
    }

    if (!cashFlowTrendGraph?.entries || cashFlowTrendGraph.entries.length === 0) {
      return (
        <div className="alert alert-info alert-soft">No data found. Add some cash flow entries to see your cash flow trends.</div>
      );
    }

    const labels = cashFlowTrendGraph.entries.map(entry => formatDate(new Date(entry.date), true));
    const data = {
      labels,
      datasets: [
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
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart',
        },
      }
    };

    return (
      <div className="flex-1 flex flex-col">
        <div className="h-3/4 w-full">
          <Chart type="line" options={options} data={data} />
        </div>
      </div>
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
