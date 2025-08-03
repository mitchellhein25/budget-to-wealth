'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { navItems, cashflowSubNavItems } from './utils';

export function MobileDrawer(
  { pathname, onClose }: { pathname: string, onClose: () => void }) 
{
  const isCashflowPage = pathname.startsWith('/cashflow');
  
  return (
    <div className="drawer-side">
      <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <aside className="bg-base-200 min-h-full w-80 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <label htmlFor="mobile-drawer" aria-label="close sidebar" className="btn btn-square btn-ghost btn-sm">
            <X className="w-5 h-5" />
          </label>
        </div>
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`btn btn-block justify-start ${
                  isActive
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          {isCashflowPage && (
            <>
              <div className="divider my-4"></div>
              <div className="text-sm font-medium text-base-content/70 mb-2 px-2">
                Cashflow
              </div>
              {cashflowSubNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`btn btn-block justify-start btn-sm ml-4 ${
                      isActive
                        ? 'btn-primary'
                        : 'btn-ghost'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}