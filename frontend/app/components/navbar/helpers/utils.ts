import { SessionData } from "@auth0/nextjs-auth0/types";
import { CASHFLOW_ITEM_NAME, CASHFLOW_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE_PLURAL, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from "@/app/cashflow/components";
import { HOLDING_SNAPSHOT_ITEM_NAME_LINK, HOLDING_SNAPSHOT_ITEM_NAME_PLURAL, NET_WORTH_ITEM_NAME, NET_WORTH_ITEM_NAME_LINK } from "@/app/net-worth/holding-snapshots/components";
import { INVESTMENT_RETURN_ITEM_NAME_PLURAL, INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK } from "@/app/net-worth/investment-returns/components/form";
import { DASHBOARDS_ITEM_NAME, DASHBOARDS_ITEM_NAME_LOWERCASE } from "@/app/dashboards/components/constants";
import { BUDGET_ITEM_NAME, BUDGET_ITEM_NAME_LOWERCASE } from "@/app/cashflow/budget/components/constants";
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

export const CASHFLOW_EXPENSES_LINK = `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${EXPENSE_ITEM_NAME_LOWERCASE_PLURAL}`;
export const CASHFLOW_INCOME_LINK = `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${INCOME_ITEM_NAME_LOWERCASE}`;
export const CASHFLOW_BUDGET_LINK = `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${BUDGET_ITEM_NAME_LOWERCASE}`;
export const NET_WORTH_INVESTMENT_RETURNS_LINK = `/${NET_WORTH_ITEM_NAME_LINK}/${INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK}`;
export const NET_WORTH_HOLDING_SNAPSHOTS_LINK = `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LINK}`;
export const DASHBOARDS_NET_WORTH_LINK = `/${DASHBOARDS_ITEM_NAME_LOWERCASE}/${NET_WORTH_ITEM_NAME_LINK}`;
export const DASHBOARDS_CASHFLOW_LINK = `/${DASHBOARDS_ITEM_NAME_LOWERCASE}/${CASHFLOW_ITEM_NAME_LOWERCASE}`;

export const NavItems: NavItem[] = [
  { href: CASHFLOW_EXPENSES_LINK, label: CASHFLOW_ITEM_NAME },
  { href: NET_WORTH_INVESTMENT_RETURNS_LINK, label: NET_WORTH_ITEM_NAME },
  { href: DASHBOARDS_NET_WORTH_LINK, label: DASHBOARDS_ITEM_NAME }
];

export const CashflowSubNavItems: NavItem[] = [
  { href: CASHFLOW_EXPENSES_LINK, label: EXPENSE_ITEM_NAME_PLURAL },
  { href: CASHFLOW_INCOME_LINK, label: INCOME_ITEM_NAME },
  { href: CASHFLOW_BUDGET_LINK, label: BUDGET_ITEM_NAME }
]; 

export const NetWorthSubNavItems: NavItem[] = [
  { href: NET_WORTH_INVESTMENT_RETURNS_LINK, label: INVESTMENT_RETURN_ITEM_NAME_PLURAL },
  { href: NET_WORTH_HOLDING_SNAPSHOTS_LINK, label: HOLDING_SNAPSHOT_ITEM_NAME_PLURAL }
]; 

export const DashboardsSubNavItems: NavItem[] = [
  { href: DASHBOARDS_NET_WORTH_LINK, label: NET_WORTH_ITEM_NAME },
  { href: DASHBOARDS_CASHFLOW_LINK, label: CASHFLOW_ITEM_NAME }
];