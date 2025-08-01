import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SideBar } from './SideBar';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = jest.mocked(usePathname);

const mockNavItems = [
  { href: '/cashflow', label: 'Cash Flow' },
  { href: '/net-worth', label: 'Net Worth' },
  { href: '/dashboards', label: 'Dashboards' },
];

const defaultProps = {
  navItems: mockNavItems,
};

describe('SideBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/cashflow');
  });

  it('renders the component with navigation title', () => {
    render(<SideBar {...defaultProps} />);
    
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<SideBar {...defaultProps} />);
    
    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Net Worth')).toBeInTheDocument();
    expect(screen.getByText('Dashboards')).toBeInTheDocument();
  });

  it('renders navigation items as links', () => {
    render(<SideBar {...defaultProps} />);
    
    const cashFlowLink = screen.getByText('Cash Flow');
    const netWorthLink = screen.getByText('Net Worth');
    const dashboardsLink = screen.getByText('Dashboards');
    
    expect(cashFlowLink.closest('a')).toHaveAttribute('href', '/cashflow');
    expect(netWorthLink.closest('a')).toHaveAttribute('href', '/net-worth');
    expect(dashboardsLink.closest('a')).toHaveAttribute('href', '/dashboards');
  });

  it('highlights active navigation item', () => {
    mockUsePathname.mockReturnValue('/cashflow');
    render(<SideBar {...defaultProps} />);
    
    const activeLink = screen.getByText('Cash Flow').closest('a');
    expect(activeLink).toHaveClass('btn-primary');
  });

  it('applies correct styling to non-active items', () => {
    mockUsePathname.mockReturnValue('/cashflow');
    render(<SideBar {...defaultProps} />);
    
    const nonActiveLinks = [
      screen.getByText('Net Worth').closest('a'),
      screen.getByText('Dashboards').closest('a'),
    ];
    
    nonActiveLinks.forEach(link => {
      expect(link).toHaveClass('btn-ghost');
      expect(link).not.toHaveClass('btn-primary');
    });
  });

  it('handles different active paths', () => {
    mockUsePathname.mockReturnValue('/net-worth');
    render(<SideBar {...defaultProps} />);
    
    const activeLink = screen.getByText('Net Worth').closest('a');
    expect(activeLink).toHaveClass('btn-primary');
  });

  it('handles empty navigation items', () => {
    render(<SideBar navItems={[]} />);
    
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to container', () => {
    render(<SideBar {...defaultProps} />);
    
    const container = screen.getByText('Navigation').closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'space-y-2', 'p-4', 'bg-base-200', 'rounded-lg', 'shadow-sm');
  });
}); 