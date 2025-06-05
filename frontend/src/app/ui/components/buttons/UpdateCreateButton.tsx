import React from 'react'

type UpdateCreateButtonProps = {
  isUpdateState: boolean;
};

export default function UpdateCreateButton({ isUpdateState }: UpdateCreateButtonProps) {
  return (
    <button
      type="submit"
      className="m-1 btn btn-primary min-w-25"
    >
      {isUpdateState ? "Update" : "Create"}
    </button>
  )
}
