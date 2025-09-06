import { render, screen } from '@testing-library/react';
import { DASHBOARDS_CASHFLOW_LINK, DASHBOARDS_NET_WORTH_LINK } from '@/app/components';
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots';
import { DashboardSideBar } from '@/app/dashboards';

jest.mock('next/navigation', () => ({
  usePathname: () => DASHBOARDS_NET_WORTH_LINK,
}));

jest.mock('@/app/dashboards', () => ({
  __esModule: true,
  SideBar: ({ navItems }: { navItems: Array<{ href: string; label: string }> }) => (
    <div data-testid="sidebar" data-nav-items={JSON.stringify(navItems)}>
      SideBar Component
    </div>
  ),
}));

describe('DashboardSideBar', () => {
  it('renders the DashboardSideBar component', () => {
    render(<DashboardSideBar />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders with correct text', () => {
    render(<DashboardSideBar />);

    expect(screen.getByText('SideBar Component')).toBeInTheDocument();
  });

  it('passes correct navigation items to SideBar', () => {
    render(<DashboardSideBar />);

    const sidebar = screen.getByTestId('sidebar');
    const navItems = JSON.parse(sidebar.getAttribute('data-nav-items') || '[]');

    expect(navItems).toHaveLength(2);
    expect(navItems[0]).toEqual({ href: DASHBOARDS_NET_WORTH_LINK, label: NET_WORTH_ITEM_NAME });
    expect(navItems[1]).toEqual({ href: DASHBOARDS_CASHFLOW_LINK, label: CASHFLOW_ITEM_NAME });
  });
}); 