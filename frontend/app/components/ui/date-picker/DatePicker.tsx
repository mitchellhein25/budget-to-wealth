"use client";

import React, { useState } from 'react';
import { MobileState, useMobileDetection } from '@/app/hooks';
import { convertDateToISOString, datesAreFullMonthRange } from '@/app/lib/utils';
import SpecificDateRangeInputs from '@/app/components/ui/date-picker/components/SpecificDateRangeSelector';
import SpecificDateRangeToggle from '@/app/components/ui/date-picker/components/SelectorTypeToggle';
import MonthYearSelector from '@/app/components/ui/date-picker/components/MonthYearSelector';
import ApplyFilterButton from '@/app/components/ui/date-picker/components/ApplyFilterButton';
import { handleFromChange, handleToChange, handleMonthChange, handleYearChange, handleSetRange, hasChanges } from '@/app/components/ui/date-picker/components/functions';

export type DateRange = {
  from?: Date;
  to?: Date;
}

type DatePickerProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  className?: string;
}

export function DatePicker({ dateRange, setDateRange, className = "" }: DatePickerProps) {
  const fromDateString = dateRange.from ? convertDateToISOString(dateRange.from) : '';
  const toDateString = dateRange.to ? convertDateToISOString(dateRange.to) : '';
  const dateRangeIsFullMonth = datesAreFullMonthRange(dateRange.from, dateRange.to);
  const selectedMonthValue = dateRangeIsFullMonth ? ((dateRange.from?.getUTCMonth() ?? 0) + 1).toString() : '';
  const selectedYearValue = dateRangeIsFullMonth ? dateRange.from?.getUTCFullYear().toString() : '';

  const [fromInputValue, setFromInputValue] = useState(() => fromDateString);
  const [toInputValue, setToInputValue] = useState(() => toDateString);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(() => selectedMonthValue);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(() => selectedYearValue);
  const [showSpecificDateRange, setShowSpecificDateRange] = useState(() => !dateRangeIsFullMonth);
  const mobileState = useMobileDetection();
  
  const isXSmall = mobileState === MobileState.XSMALL;

  return (
    <div className={`card ${className}`}>
      <div className={`card-body p-2 sm:p-4 ${isXSmall ? 'justify-center items-center' : ''}`}>
        <h3 className="card-title text-base justify-center">Date Range</h3>

        {showSpecificDateRange ? (
          <SpecificDateRangeInputs
            fromInputValue={fromInputValue}
            toInputValue={toInputValue}
            handleFromChange={(e) => handleFromChange(e, setFromInputValue, toInputValue, setSelectedMonth, setSelectedYear)}
            handleToChange={(e) => handleToChange(e, setToInputValue, fromInputValue, setSelectedMonth, setSelectedYear)}
          />
        ) : (
          <MonthYearSelector
            selectedMonth={selectedMonth ?? ''}
            selectedYear={selectedYear ?? ''}
            handleMonthChange={(e) => handleMonthChange(e, setSelectedMonth, selectedYear ?? '', setFromInputValue, setToInputValue)}
            handleYearChange={(e) => handleYearChange(e, setSelectedYear, selectedMonth ?? '', setFromInputValue, setToInputValue)}
          />
        )}

        <div className="flex justify-center">
          <SpecificDateRangeToggle
            showDateRange={showSpecificDateRange}
            handleDateRangeToggle={(e) => setShowSpecificDateRange(e.target.checked)}
          />
        </div>

        <div className="flex justify-center">
          <ApplyFilterButton
            handleSetRange={() => handleSetRange(fromInputValue, toInputValue, setDateRange)}
            hasChanges={() => hasChanges(fromInputValue, toInputValue, dateRange, showSpecificDateRange)}
          />
        </div>
      </div>
    </div>
  );
}
