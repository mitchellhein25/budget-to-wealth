import { render, screen, fireEvent } from '@testing-library/react';
import { MobileDrawer } from './MobileDrawer';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children, onClick }: { href: string; className?: string; children: React.ReactNode; onClick?: () => void }) => (
    <a href={href} className={className} onClick={onClick} data-testid={`mobile-nav-link-${href}`}>
      {children}
    </a>
  ),
}));

jest.mock('lucide-react', () => ({
  X: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="close-icon" />
  ),
}));

jest.mock('.', () => ({
  navItems: [
    { href: '/cashflow/expenses', label: 'Cash Flow' },
    { href: '/net-worth', label: 'Net Worth' },
    { href: '/dashboards', label: 'Dashboards' },
  ],
}));

describe('MobileDrawer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders the mobile drawer structure', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    expect(screen.getByTestId('mobile-nav-link-/cashflow/expenses')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-nav-link-/net-worth')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-nav-link-/dashboards')).toBeInTheDocument();
  });

  it('renders navigation items with correct labels', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Net Worth')).toBeInTheDocument();
    expect(screen.getByText('Dashboards')).toBeInTheDocument();
  });

  it('applies correct classes to drawer side', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const drawerSide = screen.getByText('Menu').closest('.drawer-side');
    expect(drawerSide).toBeInTheDocument();
  });

  it('applies correct classes to aside element', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const aside = screen.getByText('Menu').closest('aside');
    expect(aside).toHaveClass('bg-base-200', 'min-h-full', 'w-80', 'p-4');
  });

  it('renders close button with correct classes', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const closeButton = screen.getByTestId('close-icon').closest('label');
    expect(closeButton).toHaveClass('btn', 'btn-square', 'btn-ghost', 'btn-sm');
  });

  it('renders close icon with correct classes', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const closeIcon = screen.getByTestId('close-icon');
    expect(closeIcon).toHaveClass('w-5', 'h-5');
  });

  it('marks cash flow as active when pathname starts with /cashflow', () => {
    render(<MobileDrawer pathname="/cashflow/expenses" onClose={mockOnClose} />);

    const cashFlowLink = screen.getByTestId('mobile-nav-link-/cashflow/expenses');
    expect(cashFlowLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-primary');
  });

  it('marks net worth as active when pathname starts with /net-worth', () => {
    render(<MobileDrawer pathname="/net-worth/holdings" onClose={mockOnClose} />);

    const netWorthLink = screen.getByTestId('mobile-nav-link-/net-worth');
    expect(netWorthLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-primary');
  });

  it('marks dashboards as active when pathname starts with /dashboards', () => {
    render(<MobileDrawer pathname="/dashboards/cashflow" onClose={mockOnClose} />);

    const dashboardsLink = screen.getByTestId('mobile-nav-link-/dashboards');
    expect(dashboardsLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-primary');
  });

  it('marks items as inactive when pathname does not match', () => {
    render(<MobileDrawer pathname="/profile" onClose={mockOnClose} />);

    const cashFlowLink = screen.getByTestId('mobile-nav-link-/cashflow/expenses');
    const netWorthLink = screen.getByTestId('mobile-nav-link-/net-worth');
    const dashboardsLink = screen.getByTestId('mobile-nav-link-/dashboards');

    expect(cashFlowLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-ghost');
    expect(netWorthLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-ghost');
    expect(dashboardsLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-ghost');
  });

  it('calls onClose when navigation link is clicked', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const cashFlowLink = screen.getByTestId('mobile-nav-link-/cashflow/expenses');
    fireEvent.click(cashFlowLink);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose for all navigation links', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const cashFlowLink = screen.getByTestId('mobile-nav-link-/cashflow/expenses');
    const netWorthLink = screen.getByTestId('mobile-nav-link-/net-worth');
    const dashboardsLink = screen.getByTestId('mobile-nav-link-/dashboards');

    fireEvent.click(cashFlowLink);
    fireEvent.click(netWorthLink);
    fireEvent.click(dashboardsLink);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it('renders navigation items container with correct classes', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const navContainer = screen.getByText('Cash Flow').closest('.flex');
    expect(navContainer).toHaveClass('flex', 'flex-col', 'space-y-2');
  });

  it('renders header with correct classes', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const header = screen.getByText('Menu').closest('.flex');
    expect(header).toHaveClass('flex', 'justify-between', 'items-center', 'mb-4');
  });

  it('renders menu title with correct classes', () => {
    render(<MobileDrawer pathname="/test" onClose={mockOnClose} />);

    const menuTitle = screen.getByText('Menu');
    expect(menuTitle).toHaveClass('text-lg', 'font-semibold');
  });

  it('handles exact pathname matches', () => {
    render(<MobileDrawer pathname="/net-worth" onClose={mockOnClose} />);

    const netWorthLink = screen.getByTestId('mobile-nav-link-/net-worth');
    expect(netWorthLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-primary');
  });

  it('handles root pathname', () => {
    render(<MobileDrawer pathname="/" onClose={mockOnClose} />);

    const cashFlowLink = screen.getByTestId('mobile-nav-link-/cashflow/expenses');
    const netWorthLink = screen.getByTestId('mobile-nav-link-/net-worth');
    const dashboardsLink = screen.getByTestId('mobile-nav-link-/dashboards');

    expect(cashFlowLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-ghost');
    expect(netWorthLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-ghost');
    expect(dashboardsLink).toHaveClass('btn', 'btn-block', 'justify-start', 'btn-ghost');
  });
}); 