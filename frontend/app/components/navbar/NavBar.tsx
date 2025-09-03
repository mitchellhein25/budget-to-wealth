'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SessionData } from '@auth0/nextjs-auth0/types';
import { Logo, UserProfile, DesktopNav, MobileDrawer, MobileMenuButton, closeDrawer } from '@/app/components';

export function NavBar({ session }: { session: SessionData | null }) {
  const pathname = usePathname();

  return (
    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav className="navbar px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="navbar-start">
            <MobileMenuButton />
            <Logo className="hidden lg:flex" />
          </div>

          <div className="navbar-center lg:hidden">
            <Logo />
          </div>

          <DesktopNav pathname={pathname} />
          <UserProfile session={session} pathname={pathname} />
        </nav>
      </div>
      
      <MobileDrawer 
        pathname={pathname} 
        onClose={closeDrawer} 
      />
    </div>
  );
}
