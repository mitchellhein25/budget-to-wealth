import React from 'react'
import { DateRange, DayPicker } from 'react-day-picker'

type DatePickerProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

export default function DatePicker(props: DatePickerProps) {
  const { dateRange, setDateRange } = props;

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-lg text-center">
        Select Date Range
      </label>
      <button id="date-picker-button" popoverTarget="rdp-popover" className="input input-border flex justify-center w-fit">
        {`${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`}
      </button>
      <div popover="auto" id="rdp-popover" className="dropdown flex justify-center">
        <DayPicker
          className="react-day-picker"
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          required={true}
          classNames={{
            today: 'text-primary',
            selected: '',
          }}
        />
      </div>
    </div>
  )
}
