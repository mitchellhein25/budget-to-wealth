import React from 'react'
import { SideBar } from '@/app/components'

export function DashboardSideBar() {
  return (
    <SideBar 
      navItems={[
        { href: `/dashboards/net-worth`, label: 'Net Worth' },
        { href: `/dashboards/cashflow`, label: 'Cash Flow' }
      ]}
    />
  )
}
