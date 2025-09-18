"use client";

import React, { useState, useEffect } from 'react';
import { MobileState, useMobileDetection } from '@/app/hooks';
import { convertDateToISOString, convertToDate, datesAreCurrentFullMonthRange, getCurrentMonthRange } from '@/app/lib/utils';

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
  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showDateRange, setShowDateRange] = useState(false);
  const mobileState = useMobileDetection();

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSingleDateChange(e, setFromInputValue, e.target.value, toInputValue, );

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSingleDateChange(e, setToInputValue, fromInputValue, e.target.value);

  const monthOptions = [
    { value: '', label: 'Select Month', short: '' },
    { value: '1', label: 'January', short: 'Jan' },
    { value: '2', label: 'February', short: 'Feb' },
    { value: '3', label: 'March', short: 'Mar' },
    { value: '4', label: 'April', short: 'Apr' },
    { value: '5', label: 'May', short: 'May' },
    { value: '6', label: 'June', short: 'Jun' },
    { value: '7', label: 'July', short: 'Jul' },
    { value: '8', label: 'August', short: 'Aug' },
    { value: '9', label: 'September', short: 'Sep' },
    { value: '10', label: 'October', short: 'Oct' },
    { value: '11', label: 'November', short: 'Nov' },
    { value: '12', label: 'December', short: 'Dec' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

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

  const updateDateRangeFromMonthYear = (month: string, year: string) => {
    if (month && year) {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      if (monthNum >= 1 && monthNum <= 12 && yearNum > 1900 && yearNum < 2100) {
        const currentMonthRange = getCurrentMonthRange(new Date(yearNum, monthNum - 1, 1));
        setFromInputValue(convertDateToISOString(currentMonthRange.from));
        setToInputValue(convertDateToISOString(currentMonthRange.to));
      }
    }
  };


  const handleDateRangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowDateRange(checked);
    
    if (!checked) {
      setSelectedMonth('');
      setSelectedYear('');
      setFromInputValue('');
      setToInputValue('');
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

    if (showDateRange) {
      return fromInputValue !== currentFrom || toInputValue !== currentTo;
    } else {
      return fromInputValue !== currentFrom || toInputValue !== currentTo;
    }
  };

  const isXSmall = mobileState === MobileState.XSMALL;

  useEffect(() => {
    setFromInputValue(dateRange.from ? convertDateToISOString(dateRange.from) : '');
    setToInputValue(dateRange.to ? convertDateToISOString(dateRange.to) : '');
    
    if (dateRange.from && dateRange.to && datesAreCurrentFullMonthRange(convertDateToISOString(dateRange.from), convertDateToISOString(dateRange.to))) {
      const dateObj = convertToDate(convertDateToISOString(dateRange.from), true);
      setSelectedMonth((dateObj.getUTCMonth() + 1).toString());
      setSelectedYear(dateObj.getUTCFullYear().toString());
      setShowDateRange(false);
    } else if (dateRange.from || dateRange.to) {
      setShowDateRange(true);
      setSelectedMonth('');
      setSelectedYear('');
    } else {
      setShowDateRange(false);
      setSelectedMonth('');
      setSelectedYear('');
    }
  }, [dateRange.from, dateRange.to]);

  const INPUT_CLASSES = "input input-bordered input-sm text-center";

  const dateInput = (value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={INPUT_CLASSES}
      placeholder="MM/DD/YYYY"
    />
  )

  return (
    <div className={`card ${className}`}>
      <div className={`card-body p-2 sm:p-4 ${isXSmall ? 'justify-center items-center' : ''}`}>
        <h3 className="card-title text-base justify-center">Date Range</h3>
        
        {!showDateRange && (
          <div className="flex gap-3 justify-center items-end">
            <div className="flex flex-col form-control">
              <label className="label">
                <span className="label-text">Month</span>
              </label>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="select select-bordered"
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col form-control">
              <label className="label">
                <span className="label-text">Year</span>
              </label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="select select-bordered"
              >
                <option value="">Year</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Custom Date Range Selection */}
        {showDateRange && (
          <div>
            <div className={`flex ${isXSmall ? 'flex-col' : 'flex-row items-end'} justify-center gap-3`}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">From</span>
                </label>
                {dateInput(fromInputValue, handleFromChange)}
              </div>
              
              {!isXSmall && (
                <div className="flex">
                  <span>→</span>
                </div>
              )}
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">To</span>
                </label>
                {dateInput(toInputValue, handleToChange)}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={showDateRange}
                onChange={handleDateRangeToggle}
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Specific date range</span>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSetRange}
            disabled={!hasChanges()}
            className={`btn btn-sm ${hasChanges() ? 'btn-primary' : 'btn-disabled'}`}
          >
            <span className="font-semibold">Apply Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
