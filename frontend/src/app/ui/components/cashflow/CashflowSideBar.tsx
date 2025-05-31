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
            <div 
                key={item.href}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isActive 
                    ? 'bg-nav-item-active-bg-light dark:bg-nav-item-active-bg-dark' 
                    : ''
                }`}
            >
                <Link 
                href={item.href}
                className={
                    isActive
                    ? 'text-nav-item-active-light dark:text-nav-item-active-dark'
                    : 'text-nav-item-light dark:text-nav-item-dark hover:text-nav-item-hover-light dark:hover:text-nav-item-hover-dark transition-colors'
                }
                >
                {item.label}
                </Link>
            </div>
            )
        })}
    </div>
  )
}
