import React from 'react'
import { SideBar } from '@/app/components'
import { HOLDING_SNAPSHOT_ITEM_NAME, HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE, INVESTMENT_RETURN_ITEM_NAME_PLURAL, INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK, NET_WORTH_ITEM_NAME_LINK } from './constants'

export function NetWorthSideBar() {
  return (
    <SideBar 
      navItems={[
        { href: `/${NET_WORTH_ITEM_NAME_LINK}/${INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK}`, label: INVESTMENT_RETURN_ITEM_NAME_PLURAL },
        { href: `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE}s`, label: HOLDING_SNAPSHOT_ITEM_NAME }
      ]}
    />
  )
}
