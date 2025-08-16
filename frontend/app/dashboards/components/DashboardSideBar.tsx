import React from 'react'
import { SideBar } from '@/app/components'
import { DashboardsSubNavItems } from '@/app/components/navbar/helpers/utils'

export function DashboardSideBar() {
  return (
    <SideBar 
      navItems={DashboardsSubNavItems}
    />
  )
}
