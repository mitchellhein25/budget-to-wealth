'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NavItem } from '@/app/components'

export type SideBarProps = {
  navItems: NavItem[];
}

export function SideBar(props: SideBarProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col space-y-1 sm:space-y-2 p-3 sm:p-4 bg-base-200 rounded-lg shadow-sm">
      <h3 className="text-xs sm:text-sm font-semibold text-base-content/70 mb-1 sm:mb-2 px-1 sm:px-2">Navigation</h3>
      {props.navItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={`btn btn-sm justify-start ${
              isActive
                ? 'btn-primary'
                : 'btn-ghost'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
