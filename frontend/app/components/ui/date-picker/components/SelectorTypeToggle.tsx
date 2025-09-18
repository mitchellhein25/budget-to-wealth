import React from 'react'

type SelectorTypeToggleProps = {
  showDateRange: boolean;
  handleDateRangeToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SelectorTypeToggle({ showDateRange, handleDateRangeToggle }: SelectorTypeToggleProps) {
  return (
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
  )
}
