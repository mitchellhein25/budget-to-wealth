'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavBarProps } from './helpers/types';
import { closeDrawer, navItems } from './helpers/utils';
import Logo from './helpers/Logo';
import UserProfile from './helpers/UserProfile';
import DesktopNav from './helpers/DesktopNav';
import MobileDrawer from './helpers/MobileDrawer';
import MobileMenuButton from './helpers/MobileMenuButton';

export default function NavBar({ session }: NavBarProps) {
  const pathname = usePathname();

  return (
    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav className="navbar px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="navbar-start">
            <MobileMenuButton />
            <Logo className="hidden lg:flex" />
          </div>

          <div className="navbar-center lg:hidden">
            <Logo />
          </div>

          <DesktopNav navItems={navItems} pathname={pathname} />
          <UserProfile session={session} pathname={pathname} />
        </nav>
      </div>
      
      <MobileDrawer 
        navItems={navItems} 
        pathname={pathname} 
        onClose={closeDrawer} 
      />
    </div>
  );
}
