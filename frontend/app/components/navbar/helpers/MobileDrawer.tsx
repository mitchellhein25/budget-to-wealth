'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { MobileDrawerProps } from './types';

export default function MobileDrawer({ navItems, pathname, onClose }: MobileDrawerProps) {
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
        </div>
      </aside>
    </div>
  );
}