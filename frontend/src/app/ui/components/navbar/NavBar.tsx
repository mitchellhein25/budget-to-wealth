'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SessionData } from "@auth0/nextjs-auth0/types";
import Link from 'next/link';

export default function NavBar({ session }: { session: SessionData | null }) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]

  const navItems = [
    { href: '/cashflow/expenses', label: 'Cashflow' },
    { href: '/net-worth', label: 'Net Worth' },
    { href: '/dashboards', label: 'Dashboards' }
  ]
  return (
    <nav className="flex items-center justify-between gap-6 px-6 py-4 bg-nav-bg-light dark:bg-nav-bg-dark border-b border-nav-border-light dark:border-nav-border-dark ">
      <div></div>

      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = basePath && item.href.startsWith(`/${basePath}`);

          return (
            <div
              key={item.href}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isActive
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

      {session ? (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary-100-light dark:bg-primary-100-dark"></div>
            <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
              {session.user.name ?? "User"}
            </span>
          </div>
          <a href="/auth/logout"
            className="font-medium rounded px-2 py-1 text-error-600-light dark:text-error-500-dark hover:text-error-700-light dark:hover:text-error-600-dark transition-colors">
              Logout
          </a>
        </div>
      ) : (
        <a href="/auth/login"
          className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium border border-transparent text-text-inverse-light dark:text-text-inverse-dark bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-primary-hover-light dark:hover:bg-button-primary-hover-dark transition-colors">
            Login/Sign Up
        </a>
      )}
    </nav>
  )
}
