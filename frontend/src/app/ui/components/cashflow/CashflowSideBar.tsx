'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function CashflowSideBar() {
  const pathname = usePathname()
  
  const basePath = pathname.split('/').slice(0, -1).join('/') || pathname
  
  const navItems = [
    { href: `${basePath}/expenses`, label: 'Expenses' },
    { href: `${basePath}/income`, label: 'Income' },
    { href: `${basePath}/budget`, label: 'Budget' }
  ]
  return (
    <div className="flex flex-col items-center gap-6">
        {navItems.map((item) => {
            const isActive = pathname.endsWith(item.href)
            
            return (
              <Link 
              href={item.href}
              className={
                  isActive
                  ? 'btn btn-primary mx-5'
                  : 'btn btn-ghost mx-5'
              }
              >
              {item.label}
              </Link>
            )
        })}
    </div>
  )
}
