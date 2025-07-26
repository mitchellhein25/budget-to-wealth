'use client';

import React from 'react';
import Link from 'next/link';
import { CASHFLOW_ITEM_NAME, CASHFLOW_ITEM_NAME_LOWERCASE } from '@/app/cashflow/components';
import { navItems } from '.';

export function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <div className="navbar-center hidden lg:flex">
      <div className="flex space-x-1">
        {navItems.map((item) => {
          let isActive = pathname.startsWith(item.href);
          if (item.label === CASHFLOW_ITEM_NAME) {
            isActive = pathname.startsWith(`/${CASHFLOW_ITEM_NAME_LOWERCASE}`);
          }
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
          );
        })}
      </div>
    </div>
  );
}