import { CashFlowType } from '@/app/lib/models/cashflow/CashFlowType'
import CashFlowPage from '@/app/ui/components/cashflow/CashFlowPage'
import React from 'react'

export default async function Expenses() {
  return (
    <CashFlowPage cashFlowType={CashFlowType.Expense} />
  )
}
