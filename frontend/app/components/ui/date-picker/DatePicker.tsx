"use client";

import React, { useState, useEffect } from 'react';
import { MobileState, useMobileDetection } from '@/app/hooks';
import { convertDateToISOString, convertToDate, datesAreCurrentFullMonthRange, getCurrentMonthRange } from '@/app/lib/utils';
import SpecificDateRangeInputs from './components/SpecificDateRangeSelector';
import SpecificDateRangeToggle from './components/SelectorTypeToggle';
import MonthYearSelector from './components/MonthYearSelector';
import ApplyFilterButton from './components/ApplyFilterButton';

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
  const dateRangeIsFullMonth = datesAreCurrentFullMonthRange(dateRange.from, dateRange.to);
  const selectedMonthValue = dateRangeIsFullMonth ? dateRange.from?.getUTCMonth().toString() : '';
  const selectedYearValue = dateRangeIsFullMonth ? dateRange.from?.getUTCFullYear().toString() : '';

  const [fromInputValue, setFromInputValue] = useState(() => fromDateString);
  const [toInputValue, setToInputValue] = useState(() => toDateString);
  const [selectedMonth, setSelectedMonth] = useState(() => selectedMonthValue);
  const [selectedYear, setSelectedYear] = useState(() => selectedYearValue);
  const [showSpecificDateRange, setShowSpecificDateRange] = useState(() => !dateRangeIsFullMonth);
  const mobileState = useMobileDetection();
  
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSingleDateChange(e, setFromInputValue, e.target.value, toInputValue,);

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSingleDateChange(e, setToInputValue, fromInputValue, e.target.value);

  const handleSingleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    fromDateValue: string,
    toDateValue: string
  ) => {
    const newValue = e.target.value;
    setter(newValue);

    if (datesAreCurrentFullMonthRange(fromDateValue, toDateValue)) {
      const dateObj = convertToDate(fromDateValue, true);
      setSelectedMonth(dateObj.getUTCMonth().toString());
      setSelectedYear(dateObj.getUTCFullYear().toString());
    } else {
      setSelectedMonth('');
      setSelectedYear('');
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateDateRangeFromMonthYear(month, selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    updateDateRangeFromMonthYear(selectedMonth, year);
  };

  const updateDateRangeFromMonthYear = (month: string | undefined, year: string | undefined) => {
    if (month && year) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      const currentMonthRange = getCurrentMonthRange(new Date(yearNum, monthNum - 1, 1, 12));
      setFromInputValue(convertDateToISOString(currentMonthRange.from) ?? '');
      setToInputValue(convertDateToISOString(currentMonthRange.to) ?? '');
    }
  };

  const handleSetRange = () => {
    const newFrom = fromInputValue && isValidDate(fromInputValue) ? new Date(fromInputValue) : undefined;
    const newTo = toInputValue && isValidDate(toInputValue) ? new Date(toInputValue) : undefined;

    setDateRange({ from: newFrom, to: newTo });
  };

  const isValidDate = (dateString: string | undefined): boolean => {
    if (!dateString)
      return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === convertDateToISOString(date);
  };

  const hasChanges = () => {
    const currentFrom = dateRange.from ? convertDateToISOString(dateRange.from) : '';
    const currentTo = dateRange.to ? convertDateToISOString(dateRange.to) : '';

    if (showSpecificDateRange) {
      return fromInputValue !== currentFrom || toInputValue !== currentTo;
    } else {
      return fromInputValue !== currentFrom || toInputValue !== currentTo;
    }
  };

  const isXSmall = mobileState === MobileState.XSMALL;

  return (
    <div className={`card ${className}`}>
      <div className={`card-body p-2 sm:p-4 ${isXSmall ? 'justify-center items-center' : ''}`}>
        <h3 className="card-title text-base justify-center">Date Range</h3>

        {showSpecificDateRange ? (
          <SpecificDateRangeInputs
            fromInputValue={fromInputValue}
            toInputValue={toInputValue}
            handleFromChange={handleFromChange}
            handleToChange={handleToChange}
          />
        ) : (
          <MonthYearSelector
            selectedMonth={selectedMonth ?? ''}
            selectedYear={selectedYear ?? ''}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
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
            handleSetRange={handleSetRange}
            hasChanges={hasChanges}
          />
        </div>
      </div>
    </div>
  );
}
