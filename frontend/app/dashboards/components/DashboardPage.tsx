'use client';

import React, { useEffect, useState } from 'react';
import { useMobileDetection } from '@/app/hooks';
import { DatePicker, DateRange } from '@/app/components';
import { DashboardSideBar, HistoryToggle, TrendGraphData, TrendGraphEntry, getCompletedMonthsDefaultRange } from './';
import { DateRangeResponse } from '@/app/lib/api/data-methods';
import { FetchResult } from '@/app/lib/api/apiClient';

export type DashboardPageProps<T extends TrendGraphData<TrendGraphEntry>> = {
  getAvailableDateRange: () => Promise<FetchResult<DateRangeResponse>>;
  getTrendGraph: (range: DateRange) => Promise<FetchResult<T>>;
  itemName: string;
  children: (args: { trendGraphData: T | null }) => React.ReactNode;
}

export function DashboardPage<T extends TrendGraphData<TrendGraphEntry>>({
  getAvailableDateRange,
  getTrendGraph,
  itemName,
  children
}: DashboardPageProps<T>) {
  const [trendGraphData, setTrendGraphData] = useState<T | null>(null);
  const isMobile = useMobileDetection();
  const [dateRange, setDateRange] = useState<DateRange>(getCompletedMonthsDefaultRange(new Date()));
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const getTrendGraphData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getTrendGraph(dateRange);
        if (!response.successful) {
          setIsError(true);
          return;
        }
        setTrendGraphData(response.data);
        setIsEmpty(response.data?.entries?.length === 0);
      } catch (error) {
        console.error('Error fetching trend graph:', error);
        setIsError(true);
      } finally {
          setIsLoading(false);
        }
    };
    getTrendGraphData();
  }, [dateRange, getTrendGraph]);

  return (
    <div className="flex gap-3 sm:gap-6 pt-3 sm:pt-6 px-3 sm:px-6 pb-0 h-full min-h-screen">
      {!isMobile && <DashboardSideBar />}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
          <HistoryToggle
            isLoading={isHistoryLoading}
            onToggle={async (checked) => {
              if (checked) {
                setIsHistoryLoading(true);
                setDateRange({ from: new Date(2000, 0, 1), to: new Date() });
                try {                  
                  const res = await getAvailableDateRange();
                  if (!res?.successful)
                  {
                    setDateRange(getCompletedMonthsDefaultRange(new Date()));
                    return;
                  }
                  if (res?.data?.startDate && res?.data?.endDate) 
                    setDateRange({ from: new Date(res.data.startDate), to: new Date(res.data.endDate) });
                } finally {
                  setIsHistoryLoading(false);
                }
              } else {
                setDateRange(getCompletedMonthsDefaultRange(new Date()));
              }
            }}
          />
        </div>
        {isError ? (
          <p className="alert alert-error alert-soft">{`Failed to load ${itemName} trend graph.`}</p>
        ) : isLoading ? (
          <p className="alert alert-info alert-soft">{`Loading ${itemName} trend graph...`}</p>
        ) : isEmpty ? (
          <div className="alert alert-info alert-soft">{`No data found. Add some entries to see your ${itemName} trends.`}</div>
        ) : (
          children({ trendGraphData })
        )}
      </div>
    </div>
  );
}


