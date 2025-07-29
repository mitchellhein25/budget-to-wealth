import { render, screen } from '@testing-library/react';
import DashboardSideBar from './DashboardSideBar';

jest.mock('../../components/SideBar', () => ({
  __esModule: true,
  default: ({ navItems }: { navItems: Array<{ href: string; label: string }> }) => (
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
    expect(navItems[0]).toEqual({ href: '/dashboards/net-worth', label: 'Net Worth' });
    expect(navItems[1]).toEqual({ href: '/dashboards/cashflow', label: 'Cash Flow' });
  });

  it('has correct navigation structure', () => {
    render(<DashboardSideBar />);

    const sidebar = screen.getByTestId('sidebar');
    const navItems = JSON.parse(sidebar.getAttribute('data-nav-items') || '[]');

    expect(navItems[0].href).toBe('/dashboards/net-worth');
    expect(navItems[0].label).toBe('Net Worth');
    expect(navItems[1].href).toBe('/dashboards/cashflow');
    expect(navItems[1].label).toBe('Cash Flow');
  });
}); 