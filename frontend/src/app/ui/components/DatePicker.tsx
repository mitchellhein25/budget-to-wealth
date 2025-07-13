import React, { useState, useEffect } from 'react';
import { convertDateToISOString } from './Utils';

export type DateRange = {
  from?: Date;
  to?: Date;
}

type DatePickerProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  className?: string;
}

export default function DatePicker({ dateRange, setDateRange, className = "" }: DatePickerProps) {
  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');

  useEffect(() => {
    setFromInputValue(dateRange.from ? convertDateToISOString(dateRange.from) : '');
    setToInputValue(dateRange.to ? convertDateToISOString(dateRange.to) : '');
  }, [dateRange.from, dateRange.to]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromInputValue(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToInputValue(e.target.value);
  };

  const handleSetRange = () => {
    const newFrom = fromInputValue && isValidDate(fromInputValue) ? new Date(fromInputValue) : undefined;
    const newTo = toInputValue && isValidDate(toInputValue) ? new Date(toInputValue) : undefined;
    
    setDateRange({ from: newFrom, to: newTo });
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === convertDateToISOString(date);
  };

  const hasChanges = () => {
    const currentFrom = dateRange.from ? convertDateToISOString(dateRange.from) : '';
    const currentTo = dateRange.to ? convertDateToISOString(dateRange.to) : '';
    
    return fromInputValue !== currentFrom || toInputValue !== currentTo;
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <label className="text-lg text-center">
        Select Date Range
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={fromInputValue}
          onChange={handleFromChange}
          className="input input-bordered"
          placeholder="MM/DD/YYYY"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={toInputValue}
          onChange={handleToChange}
          className="input input-bordered"
          placeholder="MM/DD/YYYY"
        />
        <button
          type="button"
          onClick={handleSetRange}
          disabled={!hasChanges()}
          className={`btn ${hasChanges() ? 'btn-primary' : 'btn-disabled'}`}
        >
          Set Range
        </button>
      </div>
    </div>
  );
}
