import { CashFlowType } from '@/app/cashflow/components/CashFlowType'
import CashFlowPage from '@/app/cashflow/components/CashFlowPage'
import React from 'react'

export default async function Expenses() {
  return (
    <CashFlowPage cashFlowType={CashFlowType.Expense} />
  )
}
