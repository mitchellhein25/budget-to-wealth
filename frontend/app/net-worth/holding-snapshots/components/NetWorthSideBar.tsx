import React from 'react'
import { SideBar } from '@/app/components'
import { NetWorthSubNavItems } from '@/app/components/navbar/helpers/utils'

export function NetWorthSideBar() {
  return (
    <SideBar 
      navItems={NetWorthSubNavItems}
    />
  )
}
