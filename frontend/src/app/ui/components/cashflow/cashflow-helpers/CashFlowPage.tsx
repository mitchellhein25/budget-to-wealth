import React from 'react'
import CashflowSideBar from '../CashflowSideBar'

export default function CashFlowPage(
  props: {
    formComponent: React.ReactElement,
    datePickerComponent: React.ReactElement,
    listComponent: React.ReactElement,
}) {
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      <CashflowSideBar />
      <div className="flex flex-1 gap-6">
        <div className="flex-shrink-0">
          {props.formComponent}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {props.datePickerComponent}
          {props.listComponent}
        </div>
      </div>
    </div>
  )
}
