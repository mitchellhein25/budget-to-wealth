import React from 'react'
import { SideBar } from '@/app/components'
import { BUDGET_ITEM_NAME, BUDGET_ITEM_NAME_LOWERCASE } from '../budget/components/constants'
import { EXPENSE_ITEM_NAME, EXPENSE_ITEM_NAME_LOWERCASE, INCOME_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE } from './constants'

export function CashFlowSideBar() {
  return (
    <SideBar 
      navItems={[
        { href: `/cashflow/${EXPENSE_ITEM_NAME_LOWERCASE}`, label: EXPENSE_ITEM_NAME }, 
        { href: `/cashflow/${INCOME_ITEM_NAME_LOWERCASE}`, label: INCOME_ITEM_NAME }, 
        { href: `/cashflow/${BUDGET_ITEM_NAME_LOWERCASE}`, label: BUDGET_ITEM_NAME }
      ]}
    />
  )
}
