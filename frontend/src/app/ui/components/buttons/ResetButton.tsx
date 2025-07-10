import React from 'react'

interface ResetButtonProps {
  onClick: () => void;
  isHidden: boolean;
}

export default function ResetButton(props : ResetButtonProps) {
  return (
    <button
      type="reset"
      className="m-1 btn btn-secondary min-w-25"
      onClick={props.onClick}
      hidden={props.isHidden}
    >
      Reset
    </button>
  )
}
