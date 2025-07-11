import React from 'react'

type UpdateCreateButtonProps = {
  isUpdateState: boolean;
  isDisabled: boolean;
  onClick?: () => void;
};

export default function UpdateCreateButton(props: UpdateCreateButtonProps) {
  return (
    <button
      type="submit"
      disabled={props.isDisabled}
      className="m-1 btn btn-primary min-w-25"
      onClick={props.onClick}
    >
      {props.isUpdateState ? "Update" : "Create"}
    </button>
  )
}
