import React from 'react';
import { render, screen } from '@testing-library/react';
import NetWorthPage from '@/app/net-worth/page';

const netWorthSideBarTestId = 'net-worth-side-bar';
const netWorthSideBarText = 'Net Worth Side Bar';

jest.mock('@/app/hooks', () => ({
  useSidebarDetection: jest.fn(),
}));

jest.mock('@/app/net-worth', () => ({
  ...jest.requireActual('@/app/net-worth'),
  NetWorthSideBar: () => <div data-testid={netWorthSideBarTestId}>{netWorthSideBarText}</div>,
}));

describe('NetWorthPage', () => {
  const mockUseSidebarDetection = jest.requireMock('@/app/hooks').useSidebarDetection;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with correct structure', () => {
    mockUseSidebarDetection.mockReturnValue(true);
    
    expect(() => render(<NetWorthPage />)).not.toThrow();

    const container = document.querySelector('div.page-layout');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('page-layout');
  });

  it('renders NetWorthSideBar when showSidebar is true', () => {
    mockUseSidebarDetection.mockReturnValue(true);
    
    render(<NetWorthPage />);

    expect(screen.getByTestId(netWorthSideBarTestId)).toBeInTheDocument();
    expect(screen.getByText(netWorthSideBarText)).toBeInTheDocument();
  });

  it('does not render NetWorthSideBar when showSidebar is false', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    
    render(<NetWorthPage />);

    expect(screen.queryByTestId(netWorthSideBarTestId)).not.toBeInTheDocument();
    expect(screen.queryByText(netWorthSideBarText)).not.toBeInTheDocument();
  });
});