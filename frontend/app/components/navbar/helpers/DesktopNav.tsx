'use client';

import React from 'react';
import Link from 'next/link';
import { DesktopNavProps } from './types';

export default function DesktopNav({ navItems, pathname }: DesktopNavProps) {
  return (
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
          );
        })}
      </div>
    </div>
  );
}