import React from 'react'

type ApplyFilterButtonProps = {
  handleSetRange: () => void;
  hasChanges: () => boolean;
}

export default function ApplyFilterButton(props: ApplyFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={props.handleSetRange}
      disabled={!props.hasChanges()}
      className={`btn btn-sm ${props.hasChanges() ? 'btn-primary' : 'btn-disabled'}`}
    >
      <span className="font-semibold">Apply Filter</span>
    </button>
  )
}
