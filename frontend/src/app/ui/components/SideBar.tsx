'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export type SideBarProps = {
  navItems: { href: string, label: string }[]
}

export default function SideBar(props: SideBarProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col items-center gap-6">
        {props.navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link 
              key={item.href}
              href={item.href}
              className={
                  isActive
                  ? 'btn btn-primary'
                  : 'btn btn-ghost'
              }
              >
              {item.label}
              </Link>
            )
        })}
    </div>
  )
}
