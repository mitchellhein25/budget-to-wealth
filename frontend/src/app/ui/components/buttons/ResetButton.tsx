import React from 'react'

interface ResetButtonProps {
  onClick: () => void;
  isHidden: boolean;
  disableForm?: boolean; // New prop to disable form behavior
}

export default function ResetButton(props : ResetButtonProps) {
  return (
    <button
      type={props.disableForm ? "button" : "reset"}
      className="m-1 btn btn-secondary min-w-25"
      onClick={props.onClick}
      hidden={props.isHidden}
    >
      Reset
    </button>
  )
}
