'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SessionData } from "@auth0/nextjs-auth0/types";
import Link from 'next/link';
import { Import, User } from 'lucide-react';
import Image from 'next/image';

export default function NavBar({ session }: { session: SessionData | null }) {
  const isTokenExpired : boolean = session?.tokenSet?.expiresAt
    ? session.tokenSet.expiresAt * 1000 < Date.now()
    : false;

  const isAuthenticated: boolean = (session ?? false) && !isTokenExpired;
  const pathname = usePathname()

  const navItems = [
    { href: '/cashflow/expenses', label: 'Cashflow' },
    { href: '/net-worth', label: 'Net Worth' },
    { href: '/dashboards', label: 'Dashboards' }
  ]
  
  return (
    <nav className="navbar px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Image 
            src="/favicon.ico" 
            alt="Budget to Wealth Logo" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
          Budget to Wealth
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`btn ${
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
      </div>

      {isAuthenticated ? (
        <div className="navbar-end space-x-2">
          {pathname !== '/import' && (
            <Link
              href="/import"
              className="btn btn-ghost btn-circle"
              title="Import Data"
            >
              <Import className="w-5 h-5" />
            </Link>
          )}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
              <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">{session?.user.name ?? "User"}</span>
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/profile">Profile</Link></li>
              <li><a href="/auth/logout">Logout</a></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end">
          <a href="/auth/login" className="btn btn-primary">
            Login
          </a>
        </div>
      )}
    </nav>
  )
}
