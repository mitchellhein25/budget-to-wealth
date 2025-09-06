import React from 'react'
import { SideBar, DashboardsSubNavItems } from '@/app/components'

export function DashboardSideBar() {
  return (
    <SideBar 
      navItems={DashboardsSubNavItems}
    />
  )
}
