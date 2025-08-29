import { render, screen } from '@testing-library/react';
import DashboardsPage from './page';

jest.mock('./components/DashboardSideBar', () => ({
  __esModule: true,
  DashboardSideBar: () => <div data-testid="dashboard-sidebar">DashboardSideBar Component</div>,
}));

jest.mock('@/app/hooks', () => ({
  useMobileDetection: () => false,
}));

describe('DashboardsPage', () => {
  it('renders the main dashboard page structure', () => {
    render(<DashboardsPage />);

    const mainContainer = screen.getByTestId('dashboard-sidebar').closest('.page-layout');
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders the DashboardSideBar component', () => {
    render(<DashboardsPage />);

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
  });

  it('renders DashboardSideBar with correct text', () => {
    render(<DashboardsPage />);

    expect(screen.getByText('DashboardSideBar Component')).toBeInTheDocument();
  });
});  