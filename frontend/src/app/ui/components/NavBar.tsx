'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SessionData } from "@auth0/nextjs-auth0/types";
import Link from 'next/link';
import { Import, User, Menu } from 'lucide-react';
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
    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav className="navbar px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="navbar-start">
            <div className="flex-none lg:hidden">
              <label htmlFor="mobile-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <Menu className="w-6 h-6" />
              </label>
            </div>
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
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      {session?.user?.picture ? (
                        <Image
                          src={session.user.picture}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
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
      </div>
      <div className="drawer-side">
        <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="bg-base-200 min-h-full w-80 p-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`btn btn-block justify-start ${
                    isActive
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {isAuthenticated && pathname !== '/import' && (
              <Link
                href="/import"
                className="btn btn-ghost btn-block justify-start"
              >
                <Import className="w-5 h-5 mr-2" />
                Import Data
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
