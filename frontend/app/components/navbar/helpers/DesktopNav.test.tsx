import { render, screen } from '@testing-library/react';
import { DesktopNav } from './DesktopNav';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className} data-testid={`nav-link-${href}`}>
      {children}
    </a>
  ),
}));

jest.mock('@/app/cashflow/components', () => ({
  CASHFLOW_ITEM_NAME: 'Cash Flow',
  CASHFLOW_ITEM_NAME_LOWERCASE: 'cashflow',
}));

jest.mock('./index', () => ({
  navItems: [
    { href: '/cashflow/expenses', label: 'Cash Flow' },
    { href: '/net-worth', label: 'Net Worth' },
    { href: '/dashboards', label: 'Dashboards' },
  ],
}));

describe('DesktopNav', () => {
  it('renders all navigation items', () => {
    render(<DesktopNav pathname="/test" />);

    expect(screen.getByTestId('nav-link-/cashflow/expenses')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-/net-worth')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-/dashboards')).toBeInTheDocument();
  });

  it('renders navigation items with correct labels', () => {
    render(<DesktopNav pathname="/test" />);

    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Net Worth')).toBeInTheDocument();
    expect(screen.getByText('Dashboards')).toBeInTheDocument();
  });

  it('applies correct classes to container', () => {
    render(<DesktopNav pathname="/test" />);

    const container = screen.getByText('Cash Flow').closest('.navbar-center');
    expect(container).toHaveClass('navbar-center', 'hidden', 'lg:flex');
  });

  it('applies correct classes to navigation items container', () => {
    render(<DesktopNav pathname="/test" />);

    const itemsContainer = screen.getByText('Cash Flow').closest('.flex');
    expect(itemsContainer).toHaveClass('flex', 'space-x-1');
  });

  it('marks cash flow as active when pathname starts with /cashflow', () => {
    render(<DesktopNav pathname="/cashflow/expenses" />);

    const cashFlowLink = screen.getByTestId('nav-link-/cashflow/expenses');
    expect(cashFlowLink).toHaveClass('btn', 'btn-primary');
  });

  it('marks cash flow as active when pathname starts with /cashflow/income', () => {
    render(<DesktopNav pathname="/cashflow/income" />);

    const cashFlowLink = screen.getByTestId('nav-link-/cashflow/expenses');
    expect(cashFlowLink).toHaveClass('btn', 'btn-primary');
  });

  it('marks net worth as active when pathname starts with /net-worth', () => {
    render(<DesktopNav pathname="/net-worth/holdings" />);

    const netWorthLink = screen.getByTestId('nav-link-/net-worth');
    expect(netWorthLink).toHaveClass('btn', 'btn-primary');
  });

  it('marks dashboards as active when pathname starts with /dashboards', () => {
    render(<DesktopNav pathname="/dashboards/cashflow" />);

    const dashboardsLink = screen.getByTestId('nav-link-/dashboards');
    expect(dashboardsLink).toHaveClass('btn', 'btn-primary');
  });

  it('marks items as inactive when pathname does not match', () => {
    render(<DesktopNav pathname="/profile" />);

    const cashFlowLink = screen.getByTestId('nav-link-/cashflow/expenses');
    const netWorthLink = screen.getByTestId('nav-link-/net-worth');
    const dashboardsLink = screen.getByTestId('nav-link-/dashboards');

    expect(cashFlowLink).toHaveClass('btn', 'btn-ghost');
    expect(netWorthLink).toHaveClass('btn', 'btn-ghost');
    expect(dashboardsLink).toHaveClass('btn', 'btn-ghost');
  });

  it('handles exact pathname matches', () => {
    render(<DesktopNav pathname="/net-worth" />);

    const netWorthLink = screen.getByTestId('nav-link-/net-worth');
    expect(netWorthLink).toHaveClass('btn', 'btn-primary');
  });

  it('handles root pathname', () => {
    render(<DesktopNav pathname="/" />);

    const cashFlowLink = screen.getByTestId('nav-link-/cashflow/expenses');
    const netWorthLink = screen.getByTestId('nav-link-/net-worth');
    const dashboardsLink = screen.getByTestId('nav-link-/dashboards');

    expect(cashFlowLink).toHaveClass('btn', 'btn-ghost');
    expect(netWorthLink).toHaveClass('btn', 'btn-ghost');
    expect(dashboardsLink).toHaveClass('btn', 'btn-ghost');
  });

  it('handles cash flow sub-paths correctly', () => {
    render(<DesktopNav pathname="/cashflow/budget" />);

    const cashFlowLink = screen.getByTestId('nav-link-/cashflow/expenses');
    expect(cashFlowLink).toHaveClass('btn', 'btn-primary');
  });

  it('handles deep nested paths', () => {
    render(<DesktopNav pathname="/net-worth/holdings/categories" />);

    const netWorthLink = screen.getByTestId('nav-link-/net-worth');
    expect(netWorthLink).toHaveClass('btn', 'btn-primary');
  });
}); 