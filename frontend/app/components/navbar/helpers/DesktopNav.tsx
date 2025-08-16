'use client';

import React from 'react';
import Link from 'next/link';
import { NavItems } from './utils';

export function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <div className="navbar-center hidden lg:flex">
      <div className="flex space-x-1">
        {NavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href.split('/').slice(0, 2).join('/'));
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