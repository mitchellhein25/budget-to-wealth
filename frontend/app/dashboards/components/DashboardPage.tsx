'use client';

import React, { useState } from 'react';
import { useMobileDetection } from '@/app/hooks';
import DashboardSideBar from './DashboardSideBar';
import { DatePicker, DateRange } from '@/app/components/DatePicker';
import { HistoryToggle } from './HistoryToggle';
import { getCompletedMonthsDefaultRange } from './Utils';

export type AvailableDateRangeFetcher = () => Promise<{ startDate?: string; endDate?: string } | null>;

export function DashboardPage({
  initialDateRange,
  getAvailableDateRange,
  onFetch,
  children,
  sideBar = <DashboardSideBar />,
  onDateRangeChange,
  loadingMessage,
  errorMessage,
  emptyMessage,
}: {
  initialDateRange?: DateRange;
  getAvailableDateRange: AvailableDateRangeFetcher;
  onFetch: (range: DateRange) => Promise<{ ok: boolean; itemCount: number }>;
  children: (args: { isMobile: boolean }) => React.ReactNode;
  sideBar?: React.ReactNode;
  onDateRangeChange?: (range: DateRange) => void;
  loadingMessage: string;
  errorMessage: string;
  emptyMessage: string;
}) {
  const isMobile = useMobileDetection();
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange ?? getCompletedMonthsDefaultRange(new Date()));
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  React.useEffect(() => {
    onDateRangeChange?.(dateRange);
  }, [dateRange]);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await onFetch(dateRange);
        if (isMounted) {
          setIsError(!result.ok);
          setIsEmpty(result.itemCount === 0);
        }
      } catch {
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [dateRange]);

  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      {!isMobile && sideBar}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-4">
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
          <HistoryToggle
            isLoading={isHistoryLoading}
            onToggle={async (checked) => {
              if (checked) {
                setIsHistoryLoading(true);
                setDateRange({ from: new Date(2000, 0, 1), to: new Date() });
                try {
                  const res = await getAvailableDateRange();
                  if (res?.startDate && res?.endDate) {
                    setDateRange({ from: new Date(res.startDate), to: new Date(res.endDate) });
                  }
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
          <p className="alert alert-error alert-soft">{errorMessage}</p>
        ) : isLoading ? (
          <p className="alert alert-info alert-soft">{loadingMessage}</p>
        ) : isEmpty ? (
          <div className="alert alert-info alert-soft">{emptyMessage}</div>
        ) : (
          children({ isMobile })
        )}
      </div>
    </div>
  );
}


