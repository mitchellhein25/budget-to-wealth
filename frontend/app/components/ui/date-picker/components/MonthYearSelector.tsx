import React from 'react'

type MonthYearSelectorProps = {
  selectedMonth: string;
  selectedYear: string;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

  const yearSelectorOptions = (
    yearOptions.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    )));

  function SelectorComponent(
    label: string,
    value: string,
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    options: React.ReactNode
  ) {
    return (
      <div className="flex flex-col form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <select
          value={value}
          onChange={handleChange}
          className="select select-bordered"
        >
          {options}
        </select>
      </div>
    );
  }

  return (
    <div className="flex gap-3 justify-center items-end">
      {SelectorComponent("Month", props.selectedMonth, props.handleMonthChange, monthSelectorOptions)}
      {SelectorComponent("Year", props.selectedYear, props.handleYearChange, yearSelectorOptions)}
    </div>
  )
}
