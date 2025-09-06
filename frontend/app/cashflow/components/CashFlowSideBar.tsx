import React from 'react'
import { SideBar } from '@/app/components'
import { CashflowSubNavItems } from '@/app/components/navbar/helpers'

export function CashFlowSideBar() {
  return (
    <SideBar 
      navItems={CashflowSubNavItems}
    />
  )
}
