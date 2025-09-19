import React from 'react'
import { MobileState, useMobileDetection } from '@/app/hooks/useMobileDetection';

type SpecificDateRangeSelectorProps = {
  fromInputValue: string;
  toInputValue: string;
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SpecificDateRangeSelector(props: SpecificDateRangeSelectorProps) {
  const mobileState = useMobileDetection();

  const dateInput = (value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={"input input-bordered input-sm text-center"}
      placeholder="MM/DD/YYYY"
    />
  )

  const isXSmall = mobileState === MobileState.XSMALL;

  return (
    <div className={`flex ${isXSmall ? 'flex-col' : 'flex-row items-end'} justify-center gap-3`}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">From</span>
        </label>
        {dateInput(props.fromInputValue, props.handleFromChange)}
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
        {dateInput(props.toInputValue, props.handleToChange)}
      </div>
    </div>
  )
}
