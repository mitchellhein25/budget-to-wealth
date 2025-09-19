import React from 'react'
import { maxYearOption, minYearOption } from '@/app/components/ui/date-picker/components/functions';

type MonthYearSelectorProps = {
  selectedMonth: string;
  selectedYear: string;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MonthYearSelector(props: MonthYearSelectorProps) {
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
  ]

  const monthSelectorOptions = (
    monthOptions.map(month => (
      <option key={month.value} value={month.value}>
        {month.label}
      </option>
    )));

  return (
    <div className="flex gap-3 justify-center items-end">
      <div className="flex flex-col form-control">
        <label className="label">
          <span className="label-text">Month</span>
        </label>
        <select
          value={props.selectedMonth}
          onChange={props.handleMonthChange}
          className="select select-bordered"
        >
          {monthSelectorOptions}
        </select>
      </div>
      <div className="flex flex-col form-control">
        <label className="label">
          <span className="label-text">Year</span>
        </label>
        <input 
          type="number" 
          min={minYearOption} 
          max={maxYearOption} 
          value={props.selectedYear}
          onChange={props.handleYearChange}
          placeholder="YYYY"
          className="input input-bordered"
        />
      </div>
    </div>
  )
}
