import { SessionData } from "@auth0/nextjs-auth0/types";
import { CASHFLOW_ITEM_NAME, CASHFLOW_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE } from "@/app/cashflow/components";
import { NET_WORTH_ITEM_NAME, NET_WORTH_ITEM_NAME_LINK } from "@/app/net-worth/components";
import { DASHBOARDS_ITEM_NAME, DASHBOARDS_ITEM_NAME_LOWERCASE } from "@/app/dashboards/components/constants";
import { BUDGET_ITEM_NAME_LOWERCASE } from "@/app/cashflow/budget/components/constants";
import { INCOME_ITEM_NAME_LOWERCASE } from "@/app/cashflow/components/";

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

export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${EXPENSE_ITEM_NAME_LOWERCASE}s`, label: CASHFLOW_ITEM_NAME },
  { href: `/${NET_WORTH_ITEM_NAME_LINK}`, label: NET_WORTH_ITEM_NAME },
  { href: `/${DASHBOARDS_ITEM_NAME_LOWERCASE}`, label: DASHBOARDS_ITEM_NAME }
];

export const cashflowSubNavItems: NavItem[] = [
  { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${EXPENSE_ITEM_NAME_LOWERCASE}s`, label: 'Expenses' },
  { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${INCOME_ITEM_NAME_LOWERCASE}`, label: 'Income' },
  { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${BUDGET_ITEM_NAME_LOWERCASE}`, label: 'Budget' }
]; 