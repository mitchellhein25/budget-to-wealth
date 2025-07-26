import React from 'react'
import { SideBar } from '@/app/components'
import { BUDGET_ITEM_NAME, BUDGET_ITEM_NAME_LOWERCASE } from '../budget/components/constants'
import { CASHFLOW_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME, EXPENSE_ITEM_NAME_LOWERCASE, INCOME_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE } from './constants'

export function CashFlowSideBar() {
  return (
    <SideBar 
      navItems={[
        { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${EXPENSE_ITEM_NAME_LOWERCASE}s`, label: EXPENSE_ITEM_NAME }, 
        { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${INCOME_ITEM_NAME_LOWERCASE}`, label: INCOME_ITEM_NAME }, 
        { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${BUDGET_ITEM_NAME_LOWERCASE}`, label: BUDGET_ITEM_NAME }
      ]}
    />
  )
}
