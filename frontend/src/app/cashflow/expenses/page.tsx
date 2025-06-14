import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType'
import CashFlowPage from '@/app/ui/components/cashflow/CashFlowPage'
import React from 'react'

export default async function Expenses() {
  return (
    <CashFlowPage cashFlowType={CashFlowType.Expense} />
  )
}
