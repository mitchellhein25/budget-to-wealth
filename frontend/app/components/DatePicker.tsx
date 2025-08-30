"use client";

import React, { useState, useEffect } from 'react';
import { MobileState, useMobileDetection } from '@/app/hooks';
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

export function DatePicker({ dateRange, setDateRange, className = "" }: DatePickerProps) {
  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');
  const mobileState = useMobileDetection();

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

  const isXSmall = mobileState === MobileState.XSMALL;

  return (
    <div className={`card bg-base-100 shadow-sm ${className}`}>
      <div className={`card-body p-4 ${isXSmall ? 'justify-center items-center' : ''}`}>
        <h3 className="card-title text-base mb-3 sm:mb-4">Date Range Filter</h3>
        <div className={`flex ${isXSmall ? 'flex-col' : 'flex-row'} items-center gap-3`}>
          <div className='flex flex-row items-center gap-3' >
            <div className="form-control w-full sm:w-auto">
              {!isXSmall && 
                <label className="label">
                  <span className="label-text text-sm">From</span>
                </label>
              }
              <input
                type="date"
                value={fromInputValue}
                onChange={handleFromChange}
                className="input input-bordered input-sm"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div className={`flex items-center text-base-content/60 ${mobileState === 'xsmall' ? 'justify-center' : ''}`}>
              <span className="text-sm">to</span>
            </div>
            <div className="form-control w-full sm:w-auto">
              
              {!isXSmall && 
                <label className="label">
                  <span className="label-text text-sm">To</span>
                </label>
              }

              <input
                type="date"
                value={toInputValue}
                onChange={handleToChange}
                className="input input-bordered input-sm"
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>
          <div>
            <div className="form-control w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSetRange}
                disabled={!hasChanges()}
                className={`btn btn-sm ${hasChanges() ? 'btn-primary' : 'btn-disabled'}`}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
