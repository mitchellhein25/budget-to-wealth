'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SessionData } from "@auth0/nextjs-auth0/types";
import Link from 'next/link';
import { Import } from 'lucide-react';

export default function NavBar({ session }: { session: SessionData | null }) {
  const isTokenExpired : boolean = session?.tokenSet?.expiresAt
    ? session.tokenSet.expiresAt * 1000 < Date.now()
    : false;

  const isAuthenticated: boolean = (session ?? false) && !isTokenExpired;
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]

  const navItems = [
    { href: '/cashflow/expenses', label: 'Cashflow' },
    { href: '/net-worth', label: 'Net Worth' },
    { href: '/dashboards', label: 'Dashboards' }
  ]
  return (
    <nav className="navbar">
      <div className="navbar-start"></div>

      <div className="navbar-center">
        {navItems.map((item) => {
          const isActive = basePath && item.href.startsWith(`/${basePath}`);

          return (
            <Link
              key={item.href}
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

      {isAuthenticated ? (
        <div className="navbar-end">
          {pathname !== '/import' && (
          <Link
            href="/import"
            className={`btn btn-ghost btn-circle mx-2`}
            title="Import Data"
          >
              <Import className="w-6 h-6" />
            </Link>
          )}
          <div className="flex mx-10">
            <div className="p-3 rounded-full bg-base-content mx-2"></div>
            <span className="text-base-content mx-2">
              {session?.user.name ?? "User"}
            </span>
          </div>
          <a href="/auth/logout"
            className="btn btn-soft btn-error">
              Logout
          </a>
        </div>
      ) : (
        <div className="navbar-end">
          <a href="/auth/login"
            className="btn btn-primary">
              Login/Sign Up
          </a>
        </div>
      )}
    </nav>
  )
}
