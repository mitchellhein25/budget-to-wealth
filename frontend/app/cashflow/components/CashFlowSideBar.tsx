import React from 'react'
import SideBar from '../../components/SideBar'
import { BUDGET_ITEM_NAME } from '../budget/components/constants'

export function CashFlowSideBar() {
  return (
    <SideBar 
      navItems={[
        { href: `/cashflow/expenses`, label: 'Expenses' }, 
        { href: `/cashflow/income`, label: 'Income' }, 
        { href: `/cashflow/budget`, label: BUDGET_ITEM_NAME }
      ]}
    />
  )
}
