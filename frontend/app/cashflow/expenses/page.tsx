import React from 'react'
import { EXPENSE_ITEM_NAME, CashFlowPage } from '@/app/cashflow'

export default function Expenses() {
  return (
    <CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />
  )
}
