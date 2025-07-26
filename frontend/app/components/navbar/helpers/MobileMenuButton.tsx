'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export function MobileMenuButton() {
  return (
    <div className="flex-none lg:hidden">
      <label htmlFor="mobile-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
        <Menu className="w-6 h-6" />
      </label>
    </div>
  );
} 