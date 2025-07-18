import React from 'react'
import SideBar from '../../components/SideBar'

export default function CashFlowSideBar() {
  return (
    <SideBar 
      navItems={[
        { href: `/cashflow/expenses`, label: 'Expenses' }, 
        { href: `/cashflow/income`, label: 'Income' }, 
        { href: `/cashflow/budget`, label: 'Budget' }
      ]}
    />
  )
}
