import { SessionData } from "@auth0/nextjs-auth0/types";
import { CASHFLOW_ITEM_NAME, CASHFLOW_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE_PLURAL, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from "@/app/cashflow/components";
import { HOLDING_SNAPSHOT_ITEM_NAME_LINK, HOLDING_SNAPSHOT_ITEM_NAME_PLURAL, INVESTMENT_RETURN_ITEM_NAME_PLURAL, INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK, NET_WORTH_ITEM_NAME, NET_WORTH_ITEM_NAME_LINK } from "@/app/net-worth/holding-snapshots/components";
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

const cashflowExpensesLink = `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${EXPENSE_ITEM_NAME_LOWERCASE_PLURAL}`;
const netWorthInvestmentReturnsLink = `/${NET_WORTH_ITEM_NAME_LINK}/${INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK}`;
const dashboardsNetWorthLink = `/${DASHBOARDS_ITEM_NAME_LOWERCASE}/${NET_WORTH_ITEM_NAME_LINK}`;

export const NavItems: NavItem[] = [
  { href: cashflowExpensesLink, label: CASHFLOW_ITEM_NAME },
  { href: netWorthInvestmentReturnsLink, label: NET_WORTH_ITEM_NAME },
  { href: dashboardsNetWorthLink, label: DASHBOARDS_ITEM_NAME }
];

export const CashflowSubNavItems: NavItem[] = [
  { href: cashflowExpensesLink, label: EXPENSE_ITEM_NAME_PLURAL },
  { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${INCOME_ITEM_NAME_LOWERCASE}`, label: INCOME_ITEM_NAME },
  { href: `/${CASHFLOW_ITEM_NAME_LOWERCASE}/${BUDGET_ITEM_NAME_LOWERCASE}`, label: BUDGET_ITEM_NAME }
]; 

export const NetWorthSubNavItems: NavItem[] = [
  { href: netWorthInvestmentReturnsLink, label: INVESTMENT_RETURN_ITEM_NAME_PLURAL },
  { href: `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LINK}`, label: HOLDING_SNAPSHOT_ITEM_NAME_PLURAL }
]; 

export const DashboardsSubNavItems: NavItem[] = [
  { href: dashboardsNetWorthLink, label: NET_WORTH_ITEM_NAME },
  { href: `/${DASHBOARDS_ITEM_NAME_LOWERCASE}/${CASHFLOW_ITEM_NAME_LOWERCASE}`, label: CASHFLOW_ITEM_NAME }
];