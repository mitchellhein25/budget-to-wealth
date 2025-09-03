'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { NavItems, CashflowSubNavItems, DashboardsSubNavItems, NavItem, NetWorthSubNavItems } from '@/app/components';
import { CASHFLOW_ITEM_NAME, CASHFLOW_ITEM_NAME_LOWERCASE } from '@/app/cashflow/components/components/constants';
import { DASHBOARDS_ITEM_NAME, DASHBOARDS_ITEM_NAME_LOWERCASE } from '@/app/dashboards/components/constants';
import { NET_WORTH_ITEM_NAME, NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/holding-snapshots';

export function MobileDrawer(
  { pathname, onClose }: { pathname: string, onClose: () => void }) 
{
  const isCashflowPage = pathname.startsWith(`/${CASHFLOW_ITEM_NAME_LOWERCASE}`);
  const isNetWorthPage = pathname.startsWith(`/${NET_WORTH_ITEM_NAME_LINK}`);
  const isDashboardsPage = pathname.startsWith(`/${DASHBOARDS_ITEM_NAME_LOWERCASE}`);

  const showSubDrawer = isCashflowPage || isNetWorthPage || isDashboardsPage;

  const DrawerNavLink = ({ item, isSubItem = false }: { item: NavItem; isSubItem?: boolean }) => {
    const isActive = isSubItem 
      ? pathname.startsWith(item.href)
      : (pathname === item.href || pathname.startsWith(item.href.split('/').slice(0, 2).join('/') + '/'));
    const baseClasses = 'btn btn-block justify-start';
    const sizeClasses = isSubItem ? ' btn-sm ml-4' : '';
    const stateClasses = isActive ? ' btn-primary' : ' btn-ghost';

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`${baseClasses}${sizeClasses}${stateClasses}`}
      >
        {item.label}
      </Link>
    );
  };
  
  return (
    <div className="drawer-side">
      <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <aside className="bg-base-200 min-h-full w-72 sm:w-80 p-3 sm:p-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <label htmlFor="mobile-drawer" aria-label="close sidebar" className="btn btn-square btn-ghost btn-sm">
            <X className="w-5 h-5" />
          </label>
        </div>
        <div className="flex flex-col space-y-1 sm:space-y-2">
          {NavItems.map((item) => (
            <DrawerNavLink key={item.href} item={item} />
          ))}
          
          {showSubDrawer && (
            <>
              <div className="divider my-3 sm:my-4"></div>
              <div className="text-xs sm:text-sm font-medium text-base-content/70 mb-2 px-2">
                {isCashflowPage ? CASHFLOW_ITEM_NAME : isNetWorthPage ? NET_WORTH_ITEM_NAME : DASHBOARDS_ITEM_NAME}
              </div>
              {(isCashflowPage ? CashflowSubNavItems : isNetWorthPage ? NetWorthSubNavItems : DashboardsSubNavItems).map((item: NavItem) => (
                <DrawerNavLink key={item.href} item={item} isSubItem />
              ))}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
