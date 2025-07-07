import React from 'react'

type UpdateCreateButtonProps = {
  isUpdateState: boolean;
  isDisabled: boolean;
  onClick?: () => void; // Optional onClick for non-form usage
  disableForm?: boolean; // New prop to disable form behavior
};

export default function UpdateCreateButton(props: UpdateCreateButtonProps) {
  return (
    <button
      type={props.disableForm ? "button" : "submit"}
      disabled={props.isDisabled}
      className="m-1 btn btn-primary min-w-25"
      onClick={props.disableForm ? props.onClick : undefined}
    >
      {props.isUpdateState ? "Update" : "Create"}
    </button>
  )
}
