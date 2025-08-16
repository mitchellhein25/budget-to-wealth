import { render, screen, fireEvent } from '@testing-library/react';
import { MobileDrawer } from './MobileDrawer';
import { NavItems, CashflowSubNavItems, NetWorthSubNavItems } from './utils';

jest.mock('lucide-react', () => ({
  X: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="close-icon" />
  ),
}));

describe('MobileDrawer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders the mobile drawer structure', () => {
    render(<MobileDrawer pathname="" onClose={mockOnClose} />);

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders all navigation items with correct labels', () => {
    render(<MobileDrawer pathname="" onClose={mockOnClose} />);

    NavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('applies correct classes', () => {
    render(<MobileDrawer pathname="" onClose={mockOnClose} />);

    const drawerSide = screen.getByText('Menu').closest('.drawer-side');
    expect(drawerSide).toBeInTheDocument();
    const aside = screen.getByText('Menu').closest('aside');
    expect(aside).toHaveClass('bg-base-200', 'min-h-full', 'w-80', 'p-4');
    const closeButton = screen.getByTestId('close-icon').closest('label');
    expect(closeButton).toHaveClass('btn', 'btn-square', 'btn-ghost', 'btn-sm');
    const closeIcon = screen.getByTestId('close-icon');
    expect(closeIcon).toHaveClass('w-5', 'h-5');
  });

  it('marks main nav item as active when pathname starts with just first level but not sub-items', () => {
    const sectionRoot = `${NavItems[0].href.split('/').slice(0, 2).join('/')}/`;
    render(<MobileDrawer pathname={sectionRoot} onClose={mockOnClose} />);

    const cashFlowMainLink = screen.getByRole('link', { name: NavItems[0].label });
    expect(cashFlowMainLink).toHaveClass('btn', 'btn-primary');

    const cashflowSubLabel = CashflowSubNavItems.find(i => i.href === NavItems[0].href)!.label;
    const cashflowSubLink = screen.getByRole('link', { name: cashflowSubLabel });
    expect(cashflowSubLink).toHaveClass('btn', 'btn-ghost');
  });

  it('marks items as active when pathname starts with exact match', () => {
    render(<MobileDrawer pathname={NavItems[0].href} onClose={mockOnClose} />);

    const cashFlowMainLink = screen.getByRole('link', { name: NavItems[0].label });
    expect(cashFlowMainLink).toHaveClass('btn', 'btn-primary');

    const cashflowSubLabel = CashflowSubNavItems.find(i => i.href === NavItems[0].href)!.label;
    const cashflowSubLink = screen.getByRole('link', { name: cashflowSubLabel });
    expect(cashflowSubLink).toHaveClass('btn', 'btn-primary');
  });

  it('handles deep nested paths', () => {
    render(<MobileDrawer pathname={`${NavItems[1].href}/test1/test2`} onClose={mockOnClose} />);

    const netWorthMainLink = screen.getByRole('link', { name: NavItems[1].label });
    expect(netWorthMainLink).toHaveClass('btn', 'btn-primary');

    const netWorthSubLabel = NetWorthSubNavItems.find(i => i.href === NavItems[1].href)!.label;
    const netWorthSubLink = screen.getByRole('link', { name: netWorthSubLabel });
    expect(netWorthSubLink).toHaveClass('btn', 'btn-primary');
  });

  it('calls onClose when any navigation link is clicked', () => {
    render(<MobileDrawer pathname="" onClose={mockOnClose} />);

    const cashFlowLink = screen.getByText(NavItems[0].label);
    const netWorthLink = screen.getByText(NavItems[1].label);
    const dashboardsLink = screen.getByText(NavItems[2].label);

    fireEvent.click(cashFlowLink);
    fireEvent.click(netWorthLink);
    fireEvent.click(dashboardsLink);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });
}); 