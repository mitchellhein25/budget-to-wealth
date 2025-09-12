import React from 'react';
import { render, screen } from '@testing-library/react';
import NetWorthPage from '@/app/net-worth/page';

const netWorthSideBarTestId = 'net-worth-side-bar';
const netWorthSideBarText = 'Net Worth Side Bar';

jest.mock('@/app/hooks', () => ({
  useMobileDetection: () => false,
  useSidebarDetection: () => true,
}));

jest.mock('@/app/net-worth', () => ({
  ...jest.requireActual('@/app/net-worth'),
  NetWorthSideBar: () => <div data-testid={netWorthSideBarTestId}>{netWorthSideBarText}</div>,
}));

describe('NetWorthPage', () => {
  it('renders component with correct structure', () => {
    render(<NetWorthPage />);

    const container = document.querySelector('div.page-layout');
    expect(container).toBeInTheDocument();
  });

  it('renders NetWorthSideBar when not on mobile', () => {
    render(<NetWorthPage />);

    expect(screen.getByTestId(netWorthSideBarTestId)).toBeInTheDocument();
    expect(screen.getByText(netWorthSideBarText)).toBeInTheDocument();
  });

  it('does not render NetWorthSideBar when on mobile', () => {
    jest.doMock('@/app/hooks', () => ({
      useMobileDetection: () => true,
      useSidebarDetection: () => false,
    }));

    // Clear the module cache and re-import
    jest.resetModules();
    const NetWorthPage = jest.requireMock('@/app/net-worth/page').default;
    
    render(<NetWorthPage />);

    expect(screen.queryByTestId(netWorthSideBarTestId)).not.toBeInTheDocument();
    expect(screen.queryByText(netWorthSideBarText)).not.toBeInTheDocument();
  });

  it('has correct CSS classes for layout', () => {
    render(<NetWorthPage />);

    const container = document.querySelector('div.page-layout');
    expect(container).toHaveClass('page-layout');
  });

  it('renders without errors', () => {
    expect(() => render(<NetWorthPage />)).not.toThrow();
  });
});
