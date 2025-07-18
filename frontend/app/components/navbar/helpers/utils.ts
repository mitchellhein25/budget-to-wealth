import { SessionData } from "@auth0/nextjs-auth0/types";
import { NavItem } from './types';

export const isTokenExpired = (session: SessionData | null): boolean => {
  return session?.tokenSet?.expiresAt
    ? session.tokenSet.expiresAt * 1000 < Date.now()
    : false;
};

export const isAuthenticated = (session: SessionData | null): boolean => {
  return (session ?? false) && !isTokenExpired(session);
};

export const closeDrawer = (): void => {
  const drawerCheckbox = document.getElementById('mobile-drawer') as HTMLInputElement;
  if (drawerCheckbox) {
    drawerCheckbox.checked = false;
  }
};

export const navItems: NavItem[] = [
  { href: '/cashflow/expenses', label: 'Cashflow' },
  { href: '/net-worth', label: 'Net Worth' },
  { href: '/dashboards', label: 'Dashboards' }
]; 